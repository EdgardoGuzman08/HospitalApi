const { Router } = require('express');
const controladorExpediente = require('../controladores/controladorExpedientes');
const { body, query } = require('express-validator');
const { ValidarAutendicado } = require('../configuraciones/passport');
const rutas = Router();

rutas.get('/', controladorExpediente.Inicio);
rutas.get('/listar', controladorExpediente.Listar);

rutas.get('/buscarid', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorExpediente.BuscarId);

rutas.get('/buscarnombre', 
query('diagnostico').isLength({min:3, max: 50}).withMessage('El nombre del expediente debe tener mas de 3 caracteres'),
controladorExpediente.BuscarNombre);

rutas.post('/guardar',
body('diagnostico').isLength({min:3, max: 100}).withMessage('El nombre del expediente debe tener mas de 3 caracteres'),
body('tratamiento').isLength({min:3, max: 50}).withMessage('El nombre del expediente debe tener mas de 3 caracteres'),
controladorExpediente.Guardar);

rutas.put('/editar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
body('diagnostico').isLength({min:3, max: 100}).withMessage('El nombre del expediente debe tener mas de 3 caracteres'),
body('tratamiento').isLength({min:3, max: 50}).withMessage('El nombre del expediente debe tener mas de 3 caracteres'),
controladorExpediente.Editar);

rutas.delete('/eliminar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorExpediente.Eliminar);

module.exports= rutas;