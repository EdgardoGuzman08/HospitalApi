const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Especialidades = db.define(
    'Especialidades',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        TipoEspecialidad: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate:{
                len: [3,50],
                isAlpha: true,
            }
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        
    },
    {
        tableName: 'Especialidades',
        createdAt: false,
        updatedAt: false,
    },
);
module.exports = Especialidades;