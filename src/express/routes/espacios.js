const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const espacios = await models.espacio.findAll();
        res.status(200).json(espacios);
    } catch (error) {
        console.error('Error fetching spaces:', error);
        res.status(500).send('Error fetching spaces');
    }
}

async function getById(req, res) {
    const id = getIdParam(req);
    try {
        const espacio = await models.espacio.findByPk(id);
        if (espacio) {
            res.status(200).json(espacio);
        } else {
            res.status(404).send('404 - Space not found');
        }
    } catch (error) {
        console.error('Error fetching space:', error);
        res.status(500).send('Error fetching space');
    }
}

async function create(req, res) {
    if (req.body.id) {
        res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`);
    } else {
        try {
            const nuevoEspacio = await models.espacio.create(req.body);
            res.status(201).json(nuevoEspacio);
        } catch (error) {
            console.error('Error creating space:', error);
            res.status(500).send('Error creating space');
        }
    }
}

async function update(req, res) {
    const id = getIdParam(req);
    try {
        if (req.body.id === id) {
            await models.espacio.update(req.body, {
                where: {
                    id: id
                }
            });
            res.status(200).end();
        } else {
            res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
        }
    } catch (error) {
        console.error('Error updating space:', error);
        res.status(500).send('Error updating space');
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    try {
        const deletedCount = await models.espacio.destroy({
            where: {
                id: id
            }
        });
        if (deletedCount) {
            res.status(200).end();
        } else {
            res.status(404).send('404 - Space not found');
        }
    } catch (error) {
        console.error('Error deleting space:', error);
        res.status(500).send('Error deleting space');
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};
