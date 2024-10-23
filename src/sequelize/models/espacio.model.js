const { DataTypes, Sequelize } = require('sequelize');

module.exports = (Sequelize) => {
    Sequelize.define('espacio', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        piso: {
            type: DataTypes.ENUM('primer nivel', 'segundo nivel', 'tercer nivel', 'cuarto nivel', 'laboratorio', 'biblioteca', 'cantina'),
            allowNull: false,
        }
    });
}