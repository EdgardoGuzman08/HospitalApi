const { Router } = require('express');
const controladorEspecialidad = require('../controladores/controladorEspecialidades');
const { body, query } = require('express-validator');
const { ValidarAutendicado } = require('../configuraciones/passport');
const rutas = Router();

rutas.get('/', controladorEspecialidad.Inicio);
rutas.get('/listar', controladorEspecialidad.Listar);
rutas.get('/buscarid', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorEspecialidad.BuscarId);

rutas.get('/buscarnombre', 
query('TipoEspecialidad').isLength({min:3, max: 50}).withMessage('El nombre de la especialidad debe tener mas de 3 caracteres'),
controladorEspecialidad.BuscarNombre);

rutas.post('/guardar',
body('TipoEspecialidad').isLength({min:3, max: 50}).withMessage('El nombre de la especialidad debe tener mas de 3 caracteres'),
controladorEspecialidad.Guardar);

rutas.put('/editar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
body('TipoEspecialidad').isLength({min:3, max: 50}).withMessage('El nombre de la especialidad debe tener mas de 3 caracteres'),
controladorEspecialidad.Editar);

rutas.delete('/eliminar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorEspecialidad.Eliminar);

module.exports= rutas;