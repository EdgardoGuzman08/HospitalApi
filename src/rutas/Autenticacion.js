const { Router } = require('express');
const { body, query } = require('express-validator');
const controladorAutenticacion = require('../controladores/Autenticacion');
const rutas = Router();
rutas.get('/inicio', controladorAutenticacion.Inicio);

rutas.post('/pin', 
body('correo')
.notEmpty().withMessage('Debe escribir el correo del usuario')
.isEmail().withMessage('Debe escribir una dirección de correo válida'),
controladorAutenticacion.Pin);

rutas.put('/recuperarcontrasena', 
query('usuario')
.notEmpty().withMessage('Debe escribir el correo o nombre de usuario')
.isLength({min: 3}).withMessage('Debe escribir un correo o nombre de usuario de 3 caracteres como mínimo'),
body('pin')
.notEmpty().withMessage('Debe escribir el correo o nombre de usuario')
.isLength({min: 4, max: 4}).withMessage('Debe escribir un pin de 4 caracteres'),
body('contrasena')
.notEmpty().withMessage('Debe escribir la contraseña de usuario')
.isLength({min: 6, max: 12}).withMessage('Debe escribir una contraseña de 6 - 12 caracteres'),
controladorAutenticacion.Recuperar);

rutas.post('/iniciosesion', 
body('usuario')
.notEmpty().withMessage('Debe escribir el usuario'),
body('contrasena')
.notEmpty().withMessage('Debe escribir la contraseña'),
controladorAutenticacion.InicioSesion);

rutas.get('/error', controladorAutenticacion.Error);

module.exports = rutas;