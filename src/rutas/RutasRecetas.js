const { Router } = require('express');
const controladorRecetas = require('../controladores/controladorRecetas');
const { body, query } = require('express-validator');
const { ValidarAutendicado } = require('../configuraciones/passport');
const rutas = Router();

rutas.get('/', controladorRecetas.Inicio);
rutas.get('/listar', controladorRecetas.Listar);
rutas.get('/buscarid', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorRecetas.BuscarId);

rutas.get('/buscarnombre', 
query('tratamiento').isLength({min:2, max: 100}).withMessage('la receta debe tener mas de 2 caracteres'),
controladorRecetas.BuscarNombre);

rutas.post('/guardar',
body('tratamiento').isLength({min:2, max: 100}).withMessage('la receta debe tener mas de 2 caracteres'),
controladorRecetas.Guardar);

rutas.put('/editar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
body('tratamiento').isLength({min:2, max: 100}).withMessage('la receta debe tener mas de 2 caracteres'),
controladorRecetas.Editar);

rutas.delete('/eliminar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorRecetas.Eliminar);

module.exports= rutas;