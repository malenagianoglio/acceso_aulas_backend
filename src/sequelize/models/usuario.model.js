const { DataTypes, Sequelize } = require('sequelize');

module.exports = (Sequelize) => {
    Sequelize.define('usuario', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dni: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        rol: {
            type: DataTypes.ENUM('alumno', 'docente', 'no docente', 'otro'),
            allowNull: false,
        },
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Asegurarse de que el UID sea único
        },
    });
}