const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const permisos = await models.permisoAcceso.findAll();
        res.status(200).json(permisos);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
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

async function checkAccess(req, res) {
    const { espID, uid } = req.body; 

    try {
        const espacio = await models.espacios.findOne({
            where: { id_esp8266: espID } 
        });

        if (!espacio) {
            return res.status(404).json({ message: 'Espacio no encontrado' });
        }

        const usuario = await models.usuarios.findOne({
            where: { uid: uid } 
        });

        if (!usuario) {
            return res.status(404).json({ access: false, message: 'Usuario no encontrado' });
        }

        const permiso = await models.permisoAcceso.findOne({
            where: {
                espacio_id: espacio.id,
                usuario_id: usuario.id
            }
        });

        if (permiso) {
            return res.status(200).json({ access: true });
        } else {
            return res.status(403).json({ access: false, message: 'Acceso denegado' });
        }
    } catch (error) {
        console.error('Error al verificar el acceso:', error);
        return res.status(500).send('Error al verificar el acceso');
    }
}


module.exports = {
    getAll,
    getById,
    create,
    checkAccess,
};
