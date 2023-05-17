const { Router } = require('express');
const controladorHorarios = require('../controladores/controladorHorarios');
const { body, query } = require('express-validator');
const { ValidarAutendicado } = require('../configuraciones/passport');
const rutas = Router();
var currentTime = new Date();
var year = currentTime.getFullYear();

rutas.get('/', controladorHorarios.Inicio);
rutas.get('/listar', controladorHorarios.Listar);

rutas.get('/buscarid', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorHorarios.BuscarId);

rutas.get('/buscarhora', 
query('fechaAtencion').notEmpty().withMessage('no puede quedar vacio').isDate().withMessage('la fecha tiene que ser un formate tipo date'),
controladorHorarios.BuscarNombre);

rutas.post('/guardar',
body('fechaAtencion').isDate("yyyy/mm/dd").withMessage('formato de fecha incorrecto'),
controladorHorarios.Guardar);

rutas.put('/editar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
body('fechaAtencion').isDate("yyyy/mm/dd").withMessage('formato de fecha incorrecto'),
controladorHorarios.Editar);

rutas.delete('/eliminar',
query('id').isInt().withMessage('Solo se permiten valores enteros'), 
controladorHorarios.Eliminar);

module.exports= rutas;