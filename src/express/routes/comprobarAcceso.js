const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const { Op } = require('sequelize'); 

async function checkAccess(req, res) {
    const { espId, uid } = req.body; 
    console.log('Parámetros recibidos:', req.body);

    if (!espId || !uid) {
        return res.status(400).json({ message: 'Faltan parámetros en la solicitud' });
    }

    try {
        const espacio = await models.espacio.findOne({
            where: { id_esp8266: espId } 
        });

        if (!espacio) {
            return res.status(404).json({ message: 'Espacio no encontrado' });
        }

        const usuario = await models.usuario.findOne({
            where: { uid: uid } 
        });

        if (!usuario) {
            return res.status(404).json({ access: false, message: 'Usuario no encontrado' });
        }
        
        const ahora = new Date();

        const permiso = await models.permisoAcceso.findOne({
            where: {
                espacioId: espacio.id,
                usuarioId: usuario.id,
                fecha_inicio: { [Op.lte]: ahora }, 
                [Op.or]: [
                    { fecha_fin: { [Op.gte]: ahora } },
                    { fecha_fin: null }
                ]
            }
        });

        if (permiso) {
            const registroAbierto = await models.historialAcceso.findOne({
                where: {
                    usuarioId: usuario.id,
                    espacioId: espacio.id,
                    salida: null
                }
            });

            if (registroAbierto) {
                registroAbierto.salida = ahora;
                await registroAbierto.save();
                console.log(`Salida registrada para el usuario ${uid} en espacio ${espId} a las ${ahora}`);
            } else {
                await models.historialAcceso.create({
                    usuarioId: usuario.id,
                    espacioId: espacio.id,
                    entrada: ahora,
                    salida: null
                });
                console.log(`Entrada registrada para el usuario ${uid} en espacio ${espId} a las ${ahora}`);
            }

            return res.status(200).json({ access: true });
        } else {
            return res.status(403).json({ access: false, message: 'Acceso denegado: permiso vencido o no existente' });
        }
    } catch (error) {
        console.error('Error al verificar el acceso:', error);
        return res.status(500).send('Error al verificar el acceso');
    }
}

module.exports = {
    checkAccess,
};
