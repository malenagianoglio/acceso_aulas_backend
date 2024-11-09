function applyExtraSetup(sequelize) {
	const { usuario, espacio, permisoAcceso, historialAcceso } = sequelize.models;

    usuario.belongsToMany(espacio, { through: 'permisoAcceso' });
    espacio.belongsToMany(usuario, { through: 'permisoAcceso' });
    usuario.hasMany(historialAcceso, { foreignKey: 'usuarioId' });
    historialAcceso.belongsTo(usuario, { foreignKey: 'usuarioId' });
    espacio.hasMany(historialAcceso, { foreignKey: 'espacioId' });
    historialAcceso.belongsTo(espacio, { foreignKey: 'espacioId' });
}

module.exports = { applyExtraSetup };