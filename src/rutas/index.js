const { Router } = require('express');
const controladorInicio = require('../controladores/Inicio');
const rutas = Router();

rutas.get('/', controladorInicio.Inicio);

module.exports= rutas;