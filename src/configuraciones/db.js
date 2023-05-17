const sequelize = require('sequelize');
const db = new sequelize(
    process.env.BASE_NOMBRE,
    process.env.BASE_USUARIO,
    process.env.BASE_CONTRASENA,
    {
        host:process.env.BASE_SERVIDOR,
        dialect:'mysql',
        port: process.env.BASE_PUERTO,
    }
);
module.exports = db;