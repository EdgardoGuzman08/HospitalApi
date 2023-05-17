const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Medicos = db.define(
    'Medicos',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate:{
                len: [3, 50],
                is:/^[a-zA-Z_ ]*$/,
            },
        },
        /*telefono: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate:{
                is: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/,
            },
        },*/
        fechaNacimiento:{
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        direccion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        genero:{
            type: DataTypes.ENUM('M', 'F'),
            allowNull: false,
        },
        edad:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                isNumeric: true,
            }
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        imagen: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
    },
    {
        tableName: 'Medicos',
        createdAt: false,
        updatedAt: false,
    },
);
module.exports = Medicos;