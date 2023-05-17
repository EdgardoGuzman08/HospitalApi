const { Router } = require('express');
const path = require('path');
const multer = require('multer')
const controladorMedico = require('../controladores/controladorMedicos');
const { ValidarAutendicado } = require('../configuraciones/passport');
const { body, query, validationResult } = require('express-validator');

const storageMedicos = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/img/medicos'));
    },
    filename: function(req, file, cb){
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + nombreUnico + '-' + file.mimetype.replace('/','.'));
    } 
});
const uploadMedicos = multer({storage: storageMedicos});

const rutas = Router();

rutas.get('/', controladorMedico.Inicio);
rutas.get('/listar', controladorMedico.Listar);
rutas.get('/buscarid', 
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorMedico.BuscarId);

rutas.get('/buscarnombre', 
query('nombre').isLength({min:3, max: 50}).withMessage('El nombre de los medicos debe tener mas de 3 caracteres'),
controladorMedico.BuscarNombre);

rutas.post('/guardar', 
body('nombre').isLength({min:3, max: 50}).withMessage('El nombre de los medicos debe tener mas de 3 caracteres'),
controladorMedico.Guardar);

rutas.put('/editar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
body('nombre').isLength({min:3, max: 50}).withMessage('El nombre de los medicos debe tener mas de 3 caracteres'),
controladorMedico.Editar);

rutas.delete('/eliminar',
query('id').isInt().withMessage('Solo se permiten valores enteros'),
controladorMedico.Eliminar);

rutas.post('/imagen',
uploadMedicos.single('img'), 
controladorMedico.RecibirImagen);

module.exports= rutas;