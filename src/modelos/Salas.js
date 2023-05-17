const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Salas = db.define(
    'Salas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        ubicacion: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        
    },
    {
        tableName: 'Salas',
        createdAt: false,
        updatedAt: false,
    },
);
module.exports = Salas;