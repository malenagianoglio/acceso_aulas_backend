const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const historial = await models.historialAcceso.findAll();
        const usuarios = await models.usuario.findAll();
        const espacios = await models.espacio.findAll();

        const historialDatos = historial.map(historial => {
            const usuario = usuarios.find(u => u.id === historial.usuarioId);
            const espacio = espacios.find(e => e.id === historial.espacioId);

            return {
                historial,
                usuario, 
                espacio  
            };
        });

        res.status(200).json(historialDatos);
    } catch (error) {
        console.error('Error fetching historial:', error);
        res.status(500).send('Error fetching historial');
    }
}


async function getById(req, res) {
    const id = getIdParam(req);
    try {
        const historial = await models.historialAcceso.findByPk(id);
        if (historial) {
            res.status(200).json(historial);
        } else {
            res.status(404).send('404 - Historial no encontrado');
        }
    } catch (error) {
        console.error('Error fetching historial:', error);
        res.status(500).send('Error fetching historial');
    }
}

async function create(req, res) {
    if (req.body.id) {
        res.status(400).send(`Bad request: ID no debe ser proporcionado, ya que se determina automáticamente por la base de datos.`);
    } else {
        try {
            const nuevoRegistro = await models.historialAcceso.create(req.body);
            res.status(201).json(nuevoRegistro);
        } catch (error) {
            console.error('Error creating historial:', error);
            res.status(500).send('Error creating historial');
        }
    }
}

async function update(req, res) {
    const id = getIdParam(req);
    try {
        if (req.body.id === id) {
            await models.historialAcceso.update(req.body, {
                where: {
                    id: id
                }
            });
            res.status(200).end();
        } else {
            res.status(400).send(`Bad request: el ID del parámetro (${id}) no coincide con el ID del cuerpo (${req.body.id}).`);
        }
    } catch (error) {
        console.error('Error updating historial:', error);
        res.status(500).send('Error updating historial');
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    try {
        const deletedCount = await models.historialAcceso.destroy({
            where: {
                id: id
            }
        });
        if (deletedCount) {
            res.status(200).end();
        } else {
            res.status(404).send('404 - Historial no encontrado');
        }
    } catch (error) {
        console.error('Error deleting historial:', error);
        res.status(500).send('Error deleting historial');
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};
