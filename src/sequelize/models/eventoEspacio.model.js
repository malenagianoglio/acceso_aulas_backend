const { DataTypes, Sequelize } = require('sequelize');

module.exports = (Sequelize) => {
    Sequelize.define('eventoEspacio', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        tipo_evento: {
            type: DataTypes.ENUM('acceso', 'cierre'),
            allowNull: false,
        }
    });
}