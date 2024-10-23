function applyExtraSetup(sequelize) {
	const { usuario, espacio, permisoAcceso, eventoEspacio } = sequelize.models;

    usuario.belongsToMany(espacio, { through: 'permisoAcceso' });
    espacio.belongsToMany(usuario, { through: 'permisoAcceso' });
    espacio.hasMany(eventoEspacio);
    eventoEspacio.belongsTo(espacio);
    usuario.hasMany(eventoEspacio);
    eventoEspacio.belongsTo(usuario);
}

module.exports = { applyExtraSetup };