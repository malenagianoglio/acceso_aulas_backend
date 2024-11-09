const { DataTypes, Sequelize } = require('sequelize');

module.exports = (Sequelize) => {
    Sequelize.define('historialAcceso', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario', 
                key: 'id',
            },
        },
        espacioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'espacio', 
                key: 'id',
            },
        },
        entrada: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        salida: {
            type: DataTypes.DATE,
            allowNull: null,
        }
    });
}
