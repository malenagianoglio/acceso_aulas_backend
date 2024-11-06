const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const permisos = await models.permisoAcceso.findAll();
        const usuarios = await models.usuario.findAll();
        const espacios = await models.espacio.findAll();

        const permisosConDatos = permisos.map(permiso => {
            const usuario = usuarios.find(u => u.id === permiso.usuarioId);
            const espacio = espacios.find(e => e.id === permiso.espacioId);

            return {
                permisos,
                usuarios,
                espacios
            };
        });

        res.status(200).json(permisosConDatos);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).send('Error fetching permissions');
    }
}


async function getById(req, res) {
    const id = getIdParam(req);
    try {
        const permisos = await models.permisoAcceso.findByPk(id);
        if (permisos) {
            res.status(200).json(permisos);
        } else {
            res.status(404).send('404 - Not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error fetching user');
    }
}

async function create(req, res) {
    if (req.body.id) {
        res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`);
    } else {
        try {
            const nuevoPermiso = await models.permisoAcceso.create(req.body);
            res.status(201).json(nuevoPermiso);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Error creating user');
        }
    }
}

module.exports = {
    getAll,
    getById,
    create,
};
