const Horarios = require('../modelos/Horarios');
const { validationResult } = require('express-validator');
const MSJ = require('../componentes/mensaje');
const { Op } = require('sequelize');

exports.Inicio = (req, res) => {
    const moduloHorarios = {
        modulo: 'horarios',
        descripcion: 'Contiene la informacion de los horarios de los medicos',
        rutas: [
            {
                ruta: '/api/horarios/listar',
                descripcion: 'Lista los horarios',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/horarios/guardar',
                descripcion: 'Guarda los horarios',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/horarios/editar',
                descripcion: 'Modifica los horarios',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/horarios/eliminar',
                descripcion: 'Elimina los horarios',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/horarios/buscarid/',
                descripcion: 'busqueda por id horario',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/horarios/buscarhora/',
                descripcion: 'busqueda por horario',
                metodo: 'GET',
                parametros: 'ninguno'
            },
        ]
    }
    MSJ('Peticion ejecutada correctamente', 200, moduloHorarios, [], res);
}

exports.Listar = async (req, res) => {
    const listaHorarios = await Horarios.findAll();
    console.log(listaHorarios);
    MSJ('Peticion ejecutada correctamente', 200, listaHorarios, [], res);
}

exports.BuscarId= async (req, res) =>{

    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const listaHorarios = await Horarios.findOne(
            {   
                attributes: ['fechaAtencion', 'inicioAtencion', 'finAtencion', 'MedicoId', 'activo'],
                where:{
                    id:id
                }
            }
        );
        if(!listaHorarios){
            const er = {
                msj: 'el id no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar salas ejecutada correctamente',  200, listaHorarios, [], res);
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
        const { fechaAtencion } = req.query;
        const listaHorarios = await Horarios.findAll(
            {   
                attributes: ['fechaAtencion', 'inicioAtencion', 'finAtencion', 'MedicoId', 'activo'],
                where:{
                    [Op.or]: {
                        fechaAtencion:{
                            [Op.like]: fechaAtencion
                        },
                        activo: true,
                    }
                }
            }
        );
        if(listaHorarios.length == 0){
            const er = {
                msj: 'el horario no existe',
                parametro: 'fechaAtencion'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar salas ejecutada correctamente',  200, listaHorarios, [], res);
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
        const { fechaAtencion, inicioAtencion, finAtencion, MedicoId } = req.body;
        if(!fechaAtencion || !inicioAtencion || !finAtencion ||!MedicoId){
            const er = {
                msj: 'Debe escribir el horario del medico',
                parametro: 'fechaAtencion, inicioAtencion, finAtencion, MedicoId'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Horarios.create({
                fechaAtencion:fechaAtencion, 
                inicioAtencion: inicioAtencion, 
                finAtencion: finAtencion, 
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
        const { fechaAtencion, inicioAtencion, finAtencion, activo, MedicoId } = req.body;

        if(!id){
            const er = {
                msj: 'Debe escribir el id del horario',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            if(!fechaAtencion || !inicioAtencion || !finAtencion ||!MedicoId){
                const er = {
                    msj: 'Debe escribir los datos del horario',
                    parametro: 'fechaAtencion, inicioAtencion, finAtencion, MedicoId'
                }
                MSJ('Peticion ejecutada correctamente',  200, [], er, res);         
            }
            else{
                var buscarHorarios = await Horarios.findOne({
                    where:{
                        id: id
                    }
                });
                if (!buscarHorarios) {
                    const er = {
                        msj: 'el id del horario no existe',
                        parametro: 'id'
                    }
                    MSJ('Peticion ejecutada correctamente',  200, [], er, res);
                }
                else{
                    buscarHorarios.fechaAtencion= fechaAtencion,
                    buscarHorarios.inicioAtencion= inicioAtencion,
                    buscarHorarios.finAtencion= finAtencion,
                    buscarHorarios.activo= activo,
                    buscarHorarios.MedicoId= MedicoId
                    await buscarHorarios.save()
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
            await Horarios.destroy({where: {id: id}})
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