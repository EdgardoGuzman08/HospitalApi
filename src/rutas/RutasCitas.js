const { Router } = require('express');
const controladorCitas = require('../controladores/controladorCitas');
const { body, query } = require('express-validator');
const { ValidarAutendicado } = require('../configuraciones/passport');
const rutas = Router();

rutas.get('/', controladorCitas.Inicio);
rutas.get('/listar', controladorCitas.Listar);
rutas.get('/buscarid', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorCitas.BuscarId);

rutas.get('/buscarfecha', 
query('fechaAtencion').notEmpty().withMessage('El id no puede quedar vacio').isDate().withMessage('la fecha tiene que ser un formate tipo date'),
controladorCitas.BuscarFechaAtencion);

rutas.post('/guardar',
body('fechaAtencion').notEmpty().withMessage('El id no puede quedar vacio').isDate().withMessage('la fecha tiene que ser un formate tipo date'),
body('inicioAtencion').notEmpty().withMessage('Fecha Atencion no puede quedar vacion').withMessage('Inicio fecha Atencion no puede quedar vacio').matches('^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$').withMessage('la fecha tiene que ser un formate tipo time'),
body('finAtencion').notEmpty().withMessage('Fin Fecha Atencion no puede quedar vacio').matches('^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$').withMessage('la fecha tiene que ser un formate tipo time'),
body('UsuariosPacienteId').notEmpty().withMessage('UsarioPacienteId no puede quedar vacio').isInt().withMessage('El id tiene que ser una valor entero'),
body('MedicoId').notEmpty().withMessage('MedicoId no puede quedar vacio').isInt().withMessage('El id tiene que ser una valor entero'),
body('HorarioId').notEmpty().withMessage('Horario Id no puede quedar vacio').isInt().withMessage('El id tiene que ser una valor entero'),
controladorCitas.Guardar);

rutas.put('/editar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
body('fechaAtencion').notEmpty().withMessage('Fecha Atencion no puede quedar vacion').isDate().withMessage('la fecha tiene que ser un formate tipo date'),
body('inicioAtencion').notEmpty().withMessage('Inicio fecha Atencion no puede quedar vacio').matches('^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$').withMessage('la hora tiene que ser un formate tipo time'),
body('finAtencion').notEmpty().withMessage('Fin Fecha Atencion no puede quedar vacio').matches('^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$').withMessage('la hora tiene que ser un formate tipo time'),
body('UsuariosPacienteId').notEmpty().withMessage('UsarioPacienteId no puede quedar vacio').isInt().notEmpty().withMessage('El id tiene que ser una valor entero'),
body('MedicoId').notEmpty().withMessage('MedicoId no puede quedar vacio').isInt().notEmpty().withMessage('El id tiene que ser una valor entero'),
body('HorarioId').notEmpty().withMessage('Horario Id no puede quedar vacio').isInt().withMessage('El id tiene que ser una valor entero'),
controladorCitas.Editar);

rutas.delete('/eliminar',
query('id').notEmpty().withMessage('El id no puede quedar vacio').isInt().withMessage('Solo se permiten valores enteros'),
controladorCitas.Eliminar);

module.exports= rutas;