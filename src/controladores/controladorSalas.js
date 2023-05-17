const Salas = require('../modelos/Salas');
const { validationResult } = require('express-validator');
const MSJ = require('../componentes/mensaje');
const { Op } = require('sequelize');

exports.Inicio = (req, res) => {
    const moduloSalas = {
        modulo: 'salas',
        descripcion: 'Contiene la informacion de las salas del hospital',
        rutas: [
            {
                ruta: '/api/salas/listar',
                descripcion: 'Lista las salas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/salas/guardar',
                descripcion: 'Guarda las salas',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/salas/editar',
                descripcion: 'Modifica las salas',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/salas/eliminar',
                descripcion: 'Elimina las salas',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/salas/buscarid/',
                descripcion: 'hace busqueda por id salas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/salas/buscarnombre/',
                descripcion: 'hace busqueda por la ubicacion de las salas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
        ]
    }
    MSJ('Peticion menu salas ejecutada correctamente', 200, moduloSalas, [], res);
}

exports.Listar = async (req, res) => {
    const listaSalas = await Salas.findAll();
    console.log(listaSalas);
    MSJ('Peticion listar salas ejecutada correctamente', 200, listaSalas, [], res);
}

exports.BuscarId= async (req, res) =>{

    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const listaSalas = await Salas.findOne(
            {   
                attributes: ['ubicacion', 'descripcion'],
                where:{
                    id:id
                }
            }
        );
        if(!listaSalas){
            const er = {
                msj: 'el id no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar salas ejecutada correctamente',  200, listaSalas, [], res);
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
        const { ubicacion } = req.query;
        const listaSalas = await Salas.findAll(
            {   
                attributes: ['ubicacion', 'descripcion'],
                where:{
                    [Op.or]: {
                        ubicacion:{
                            [Op.like]: ubicacion
                        },
                    }
                }
            }
        );
        if(listaSalas.length == 0){
            const er = {
                msj: 'la ubicacion no existe',
                parametro: 'ubicacion'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar salas ejecutada correctamente',  200, listaSalas, [], res);
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
        const { ubicacion, descripcion } = req.body;
        if(!ubicacion){
            const er = {
                msj: 'Debe escribir la ubicacion de la sala',
                parametro: 'ubicacion'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Salas.create({
                ubicacion: ubicacion,
                descripcion: descripcion
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
        const { ubicacion, descripcion } = req.body;
        console.log(id);
        console.log(ubicacion);
        console.log(descripcion);
        if(!id){
            const er = {
                msj: 'Debe escribir el id de la sala',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            if(!ubicacion){
                const er = {
                    msj: 'Debe escribir la ubicacion de la sala',
                    parametro: 'ubicacion'
                }
                MSJ('Peticion ejecutada correctamente',  200, [], er, res);         
            }
            else{
                var buscarSala = await Salas.findOne({
                    where:{
                        id: id
                    }
                });
                if (!buscarSala) {
                    const er = {
                        msj: 'el id de la sala no existe',
                        parametro: 'id'
                    }
                    MSJ('Peticion ejecutada correctamente',  200, [], er, res);
                }
                else{
                    buscarSala.ubicacion=ubicacion;
                    buscarSala.descripcion=descripcion;
                    await buscarSala.save()
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
                msj: 'el id de la sala no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Salas.destroy({where: {id: id}})
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