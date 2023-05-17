const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Pacientes = db.define(
    'Pacientes',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        dni: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate:{
                isNumeric: true, 
            },
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
                is: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
            },
        },*/
        direccion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        genero:{
            type: DataTypes.ENUM('M', 'F'),
            allowNull: false,
        },
        fechaNacimiento:{
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        edad:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                isNumeric: true,
            }
        },
        tipoSangre: {
            type: DataTypes.STRING(50),
            allowNull: false,
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
        tableName: 'Pacientes',
        createdAt: false,
        updatedAt: false,
    },
);
module.exports = Pacientes;