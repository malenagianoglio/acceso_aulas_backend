const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const usuarios = await models.usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
}

async function getById(req, res) {
    const id = getIdParam(req);
    try {
        const usuarios = await models.usuario.findByPk(id);
        if (usuarios) {
            res.status(200).json(usuarios);
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
            const nuevoUsuario = await models.usuario.create(req.body);
            res.status(201).json(nuevoUsuario);
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
            await models.usuario.update(req.body, {
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
        const deletedCount = await models.usuario.destroy({
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
