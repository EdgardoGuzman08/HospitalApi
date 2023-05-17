const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Recetas = db.define(
    'Recetas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        tratamiento: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        edad:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                isNumeric: true,
            }
        },
        fechaEmitida: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        
    },
    {
        tableName: 'Recetas',
        createdAt: false,
        updatedAt: false,
    },
);
module.exports = Recetas;