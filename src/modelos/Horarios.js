const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Horarios = db.define(
    'Horarios',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        fechaAtencion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        inicioAtencion: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        finAtencion: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        
    },
    {
        tableName: 'Horarios',
        createdAt: false,
        updatedAt: false,
    },
);
module.exports = Horarios;