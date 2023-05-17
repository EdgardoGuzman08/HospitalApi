const Recetas = require('../modelos/Recetas');
const { validationResult } = require('express-validator');
const MSJ = require('../componentes/mensaje');
const { Op } = require('sequelize');

exports.Inicio = (req, res) => {
    const moduloRecetas = {
        modulo: 'recetas',
        descripcion: 'Contiene la informacion de las recetas del hospital',
        rutas: [
            {
                ruta: '/api/recetas/listar',
                descripcion: 'Lista las recetas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/recetas/guardar',
                descripcion: 'Guarda las recetas',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/recetas/editar',
                descripcion: 'Modifica las recetas',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/recetas/eliminar',
                descripcion: 'Elimina las recetas',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/recetas/buscarid/',
                descripcion: 'hace busqueda por id recetas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/recetas/buscarnombre/',
                descripcion: 'hace busqueda por recetas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
        ]
    }
    MSJ('Peticion menu salas ejecutada correctamente', 200, moduloRecetas, [], res);
}

exports.Listar = async (req, res) => {
    const listaRecetas = await Recetas.findAll();
    console.log(listaRecetas);
    MSJ('Peticion listar salas ejecutada correctamente', 200, listaRecetas, [], res);
}

exports.BuscarId= async (req, res) =>{

    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const listaRecetas = await Recetas.findOne(
            {   
                attributes: ['tratamiento', 'edad', 'fechaEmitida', 'UsuariosPacienteId', 'MedicoId'],
                where:{
                    id:id
                }
            }
        );
        if(!listaRecetas){
            const er = {
                msj: 'el id no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar salas ejecutada correctamente',  200, listaRecetas, [], res);
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
        const { tratamiento } = req.query;
        const listaRecetas = await Recetas.findAll(
            {   
                attributes: ['tratamiento', 'edad', 'fechaEmitida', 'UsuariosPacienteId', 'MedicoId'],
                where:{
                    [Op.or]: {
                        tratamiento:{
                            [Op.like]: tratamiento
                        },
                    }
                }
            }
        );
        if(listaRecetas.length == 0){
            const er = {
                msj: 'el tratamiento no existe',
                parametro: 'tratamiento'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar salas ejecutada correctamente',  200, listaRecetas, [], res);
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
        const { tratamiento, edad, fechaEmitida, UsuariosPacienteId, MedicoId } = req.body;
        if(!tratamiento){
            const er = {
                msj: 'Debe escribir los datos de la recetas',
                parametro: 'tratamiento'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Recetas.create({
                tratamiento: tratamiento,
                edad: edad,
                fechaEmitida: fechaEmitida,
                UsuariosPacienteId: UsuariosPacienteId,
                MedicoId: MedicoId
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
        const { tratamiento, edad, fechaEmitida, UsuariosPacienteId, MedicoId } = req.body;
        if(!id){
            const er = {
                msj: 'Debe escribir el id de la recetas',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            if(!tratamiento || !edad || !fechaEmitida || !UsuariosPacienteId || !MedicoId){
                const er = {
                    msj: 'Debe escribir los datos de la recetas',
                    parametro: 'tratamiento, edad, fechaEmitida, UsuariosPacienteId, MedicoId'
                }
                MSJ('Peticion ejecutada correctamente',  200, [], er, res);         
            }
            else{
                var buscarRecetas = await Recetas.findOne({
                    where:{
                        id: id
                    }
                });
                if (!buscarRecetas) {
                    const er = {
                        msj: 'el id de la receta no existe',
                        parametro: 'id'
                    }
                    MSJ('Peticion ejecutada correctamente',  200, [], er, res);
                }
                else{
                    buscarRecetas.tratamiento=tratamiento;
                    buscarRecetas.edad=edad;
                    buscarRecetas.fechaEmitida=fechaEmitida;
                    buscarRecetas.UsuariosPacienteId=UsuariosPacienteId;
                    buscarRecetas.MedicoId=MedicoId;
                    await buscarRecetas.save()
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
                msj: 'el id de la receta no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Recetas.destroy({where: {id: id}})
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