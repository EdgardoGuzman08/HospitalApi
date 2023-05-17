const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Expedientes = db.define(
    'Expedientes',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        diagnostico: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        tratamiento: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: 'Expedientes',
        createdAt: false,
        updatedAt: false,
    },
);
module.exports = Expedientes;