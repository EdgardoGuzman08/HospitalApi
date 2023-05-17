const { Router } = require('express');
const path = require('path');
const multer = require('multer')
const controladorPacientes = require('../controladores/controladorPacientes');
const { ValidarAutendicado } = require('../configuraciones/passport');
const { body, query, validationResult } = require('express-validator');

const sotragePacientes = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/img/pacientes'));
    },
    filename: function(req, file, cb){
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + nombreUnico + '-' + file.mimetype.replace('/','.'));
    } 
});
const uploadPacientes = multer({storage: sotragePacientes});
const rutas = Router();

rutas.get('/', controladorPacientes.Inicio);
rutas.get('/listar', controladorPacientes.Listar);
rutas.get('/buscarid', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorPacientes.BuscarId);

rutas.get('/buscarnombre', 
query('nombre').isLength({min:3, max: 50}).withMessage('El nombre del paciente debe tener mas de 3 caracteres'),
controladorPacientes.BuscarNombre);

rutas.post('/guardar',
body('nombre').isLength({min:3, max: 50}).withMessage('El nombre del paciente debe tener mas de 3 caracteres'),
controladorPacientes.Guardar);

rutas.put('/editar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
body('nombre').isLength({min:3, max: 50}).withMessage('El nombre del paciente debe tener mas de 3 caracteres'),
controladorPacientes.Editar);

rutas.delete('/eliminar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorPacientes.Eliminar);

rutas.post('/imagen',
uploadPacientes.single('img'), 
controladorPacientes.RecibirImagen);

module.exports= rutas;