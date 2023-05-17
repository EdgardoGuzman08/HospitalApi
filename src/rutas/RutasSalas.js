const { Router } = require('express');
const controladorSalas = require('../controladores/controladorSalas');
const { body, query } = require('express-validator');
const { ValidarAutendicado } = require('../configuraciones/passport');
const rutas = Router();

rutas.get('/', controladorSalas.Inicio);
rutas.get('/listar', controladorSalas.Listar);
rutas.get('/buscarid', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorSalas.BuscarId);

rutas.get('/buscarnombre', 
query('ubicacion').isLength({min:2, max: 50}).withMessage('la ubicacion de la sala debe tener mas de 2 caracteres'),
controladorSalas.BuscarNombre);

rutas.post('/guardar',
body('ubicacion').isLength({min:2, max: 50}).withMessage('la ubicacion de la sala debe tener mas de 2 caracteres'),
controladorSalas.Guardar);

rutas.put('/editar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
body('ubicacion').isLength({min:2, max: 50}).withMessage('la ubicacion de la sala debe tener mas de 2 caracteres'),
controladorSalas.Editar);

rutas.delete('/eliminar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorSalas.Eliminar);

module.exports= rutas;