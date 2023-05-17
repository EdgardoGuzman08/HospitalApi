const Medicos = require('../modelos/Medicos');
const { validationResult } = require('express-validator');
const MSJ = require('../componentes/mensaje');
const { Op } = require('sequelize');
const fs = require('fs');
const path =require('path');
var errores = [];
var data = [];
var error = {
    msg: '',
    parametros: ''
};

exports.Inicio = (req, res) => {
    const moduloMedicos = {
        modulo: 'especialidad',
        descripcion: 'Contiene la informacion de los medicos en el hospital',
        rutas: [
            {
                ruta: '/api/medicos/listar',
                descripcion: 'Lista los medicos',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/medicos/guardar',
                descripcion: 'Guarda los medicos',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/medicos/editar',
                descripcion: 'Modifica los medicos',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/medicos/eliminar',
                descripcion: 'Elimina los medicos',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/medicos/buscarid/',
                descripcion: 'hace busqueda por id medicos',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/medicos/buscarnombre/',
                descripcion: 'hace busqueda por el nombre de los medicos',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/medicos/imagen/',
                descripcion: 'Guarda imagen de los medicos',
                metodo: 'POST',
                parametros: 'ninguno'
            },
        ]
    }
    MSJ('Peticion ejecutada correctamente', 200, moduloMedicos, [], res);
}

exports.Listar = async (req, res) => {
    const listaMedicos = await Medicos.findAll();
    console.log(listaMedicos);
    MSJ('Peticion listar medico ejecutada correctamente', 200, listaMedicos, [], res);
}

exports.BuscarId= async (req, res) =>{

    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const listaMedicos = await Medicos.findOne(
            {   
                attributes: ['nombre', 'fechaNacimiento','direccion','genero','edad','activo', 'EspecialidadeId', 'SalaId'],
                where:{
                    id:id
                }
            }
        );
        if(!listaMedicos){
            const er = {
                msj: 'el id no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion ejecutada correctamente',  200, listaMedicos, [], res);
        }
    }
}

exports.BuscarNombre = async (req, res) =>{
    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { nombre } = req.query;
        const listaMedicos = await Medicos.findAll(
            {   
                attributes: ['nombre', 'fechaNacimiento','direccion','genero','edad','activo', 'EspecialidadeId', 'SalaId'],
                where:{
                    [Op.or]: {
                        nombre:{
                            [Op.like]: nombre
                        },
                        activo: false,
                    }
                }
            }
        );
        if(listaMedicos.length == 0){
            const er = {
                msj: 'el nombre del medico no existe',
                parametro: 'nombre'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion ejecutada correctamente',  200, listaMedicos, [], res);
        }
    }
}

exports.Guardar = async (req, res) =>{
    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { nombre, fechaNacimiento, direccion, genero, edad, EspecialidadeId, SalaId} = req.body;
        if(!nombre || !genero || !edad || !EspecialidadeId || !SalaId){
            const er = {
                msj: 'Debe escribir los datos de los medicos',
                parametro: 'nombre, genero, edad, EspecialidadeId, SalaId'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Medicos.create({
                nombre: nombre,
                fechaNacimiento: fechaNacimiento,
                direccion: direccion,
                genero: genero,
                edad: edad,
                EspecialidadeId: EspecialidadeId,
                SalaId: SalaId,
            }).then((data)=>{
                console.log(data);
                MSJ('Peticion ejecutada correctamente',  200, data, [], res);
            }).catch((err) =>{
                var er='';
                err.errors.forEach(element => {
                    console.log(element.message);
                    er+=element.message + '. ';
                });
                MSJ('Peticion ejecutada correctamente',  200, [], {msj: er}, res);
            });
        }
    }
}

exports.Editar = async (req, res) =>{
    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const { nombre, fechaNacimiento, direccion, genero, edad, activo, EspecialidadeId, SalaId } = req.body;
        console.log(id);
        if(!id){
            const er = {
                msj: 'Debe escribir el id de los medicos',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            if(!nombre || !genero || !edad || !EspecialidadeId || !SalaId){
                const er = {
                    msj: 'Debe escribir los datos del medico',
                    parametro: 'nombre, genero, edad, EspecialidadeId, SalaId'
                }
                MSJ('Peticion ejecutada correctamente',  200, [], er, res);         
            }
            else{
                var buscarMedico = await Medicos.findOne({
                    where:{
                        id: id
                    }
                });
                if (!buscarMedico) {
                    const er = {
                        msj: 'el id de los medicos no existe',
                        parametro: 'id'
                    }
                    MSJ('Peticion ejecutada correctamente',  200, [], er, res);
                }
                else{
                    buscarMedico.nombre=nombre;
                    buscarMedico.fechaNacimiento=fechaNacimiento;
                    buscarMedico.direccion=direccion;
                    buscarMedico.genero=genero;
                    buscarMedico.edad=edad;
                    buscarMedico.activo=activo;
                    buscarMedico.EspecialidadeId=EspecialidadeId;
                    buscarMedico.SalaId=SalaId;
                    await buscarMedico.save()
                    .then((data)=>{
                        MSJ('Peticion ejecutada correctamente',  200, data, [], res);
                    })
                    .catch((err) => {
                        var er='';
                        err.errors.forEach(element => {
                        console.log(element.message);
                        er+=element.message + '. ';
                    });
                        MSJ('Peticion ejecutada correctamente',  200, [], {msj: er}, res);
                    })
                }
            }
        }
    }
}

exports.Eliminar = async (req, res) =>{
    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        console.log(id);
        if(!id){
            const er = {
                msj: 'el id de la especialidad no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Medicos.destroy({where: {id: id}})
                    .then((data)=>{
                        console.log(data);
                        MSJ('Peticion ejecutada correctamente',  200, data, [], res);
                    })
                    .catch((err) => {
                        var er='';
                        err.errors.forEach(element => {
                        console.log(element.message);
                        er+=element.message + '. ';
                    });
                        MSJ('Peticion ejecutada correctamente',  200, [], {msj: er}, res);
                    })
        }
    }
}

exports.RecibirImagen = async(req,res)=>{
    const { filename } = req.file;
    const { id } =req.body;
    //console.log(req);
    console.log(filename);
    try{
        errores=[];
        data=[];
        var buscarMedico = await Medicos.findOne({where: { id }});
        if(!buscarMedico){
            const buscarImagen = fs.existsSync(path.join(__dirname, '../public/img/medicos/' + filename));
            if(!buscarImagen){
                console.log('La imagen no existe');
            }
            else{
                fs.unlinkSync(path.join(__dirname, '../public/img/medicos' + filename));//unlinksync elimina la imagen
                console.log('Imagen eliminada');
            }
            error.msg='El id del medico no existe, se elimino la imagen enviada';
            error.parametro='id';
            errores.push(error);
            MSJ("Peticion ejecutada correctamente", 200, [], errores, res);
        }
        else{
            const buscarImagen = fs.existsSync(path.join(__dirname, '../public/img/medicos/' + buscarMedico.imagen));
            if(!buscarImagen){
                console.log('No encontró la imagen');
            }
            else{
                fs.unlinkSync(path.join(__dirname, '../public/img/medicos/' +  buscarMedico.imagen));
                console.log('Imagen eliminada');
            }
            buscarMedico.imagen=filename;
            await buscarMedico.save()
            .then((data)=>{
                MSJ('Peticion ejecutada correctamente', 200, data, errores, res);
            })
            .catch((error)=>{
                errores.push(error);
                MSJ('Peticion ejecutada correctamente', 200, [], errores,res);
            });
        } 
    } catch(error){
        errores.push(error);
        console.log(error);
        MSJ('Error a ejecutar la peticion', 500, [], errores, res);
    }
}