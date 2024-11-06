const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function checkAccess(req, res) {
    const { espId, uid } = req.body; 
    console.log('Parámetros recibidos:', req.body);

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
        
        const permiso = await models.permisoAcceso.findOne({
            where: {
                espacioId: espacio.id,
                usuarioId: usuario.id
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
    checkAccess,
};
