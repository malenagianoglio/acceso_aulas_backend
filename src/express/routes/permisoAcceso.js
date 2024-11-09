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
        const permiso = await models.permisoAcceso.findByPk(id);
        
        if (!permiso) {
            return res.status(404).send('404 - Not found');
        }

        const usuario = await models.usuario.findByPk(permiso.usuarioId);

        const espacio = await models.espacio.findByPk(permiso.espacioId);

        const permisoConDetalles = {
            ...permiso.toJSON(),
            usuario: usuario ? usuario.toJSON() : null,
            espacio: espacio ? espacio.toJSON() : null,
        };

        res.status(200).json(permisoConDetalles);
    } catch (error) {
        console.error('Error fetching permiso with user and space:', error);
        res.status(500).send('Error fetching permiso');
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

async function update(req, res) {
    const id = getIdParam(req);
    try {
        if (req.body.id === id) {
            await models.permisoAcceso.update(req.body, {
                where: {
                    id: id
                }
            });
            res.status(200).end();
        } else {
            res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    try {
        const deletedCount = await models.permisoAcceso.destroy({
            where: {
                id: id
            }
        });
        if (deletedCount) {
            res.status(200).end();
        } else {
            res.status(404).send('404 - User not found');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};
