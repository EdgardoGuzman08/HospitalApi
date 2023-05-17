const { Router } = require('express');
const controladorUsuarios = require('../controladores/controladorUsuarios');
const { body, query } = require('express-validator');

const rutas = Router();

rutas.get('/', controladorUsuarios.Inicio);
rutas.get('/listar', controladorUsuarios.Listar);

rutas.post('/guardar', 
body('login').isLength({min:3, max: 50}).withMessage('El login del usuario debe tener mas de 3 caracteres'),
body('contrasena').isLength({min:3, max: 50}).withMessage('La contrasena del usuario debe tener mas de 3 caracteres'),
body('correo').isLength({min:3, max: 50}).withMessage('El correo del usuario debe tener mas de 3 caracteres'),
controladorUsuarios.Guardar);

rutas.put('/editar', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
body('login').isLength({min:3, max: 50}).withMessage('El login del usuario debe tener mas de 3 caracteres'),
body('contrasena').isLength({min:3, max: 50}).withMessage('La contrasena del usuario debe tener mas de 3 caracteres'),
body('correo').isLength({min:3, max: 50}).withMessage('El correo del usuario debe tener mas de 3 caracteres'),
controladorUsuarios.Editar);

rutas.delete('/eliminar', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorUsuarios.Eliminar);

module.exports= rutas;