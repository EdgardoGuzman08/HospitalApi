const Citas = require('../modelos/Citas');
const { validationResult } = require('express-validator');
const MSJ = require('../componentes/mensaje');
const { Op } = require('sequelize');

exports.Inicio = (req, res) => {
    const moduloCitas = {
        modulo: 'citas',
        descripcion: 'Contiene la informacion de las citas del hospital',
        rutas: [
            {
                ruta: '/api/citas/listar',
                descripcion: 'Lista las citas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/citas/guardar',
                descripcion: 'Guarda las citas',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/citas/editar',
                descripcion: 'Modifica las citas',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/citas/eliminar',
                descripcion: 'Elimina las citas',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/citas/buscarid/',
                descripcion: 'hace busqueda por id citas',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/citas/buscarnombre/',
                descripcion: 'hace busqueda por fechaAtencion',
                metodo: 'GET',
                parametros: 'ninguno'
            },
        ]
    }
    MSJ('Peticion menu citas ejecutada correctamente', 200, moduloCitas, [], res);
}

exports.Listar = async (req, res) => {
    const listaCitas = await Citas.findAll();
    console.log(listaCitas);
    MSJ('Peticion listar citas ejecutada correctamente', 200, listaCitas, [], res);
}

exports.BuscarId= async (req, res) =>{

    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const listaCitas = await Citas.findOne(
            {   
                attributes: ['fechaAtencion', 'inicioAtencion','finAtencion','activo','UsuariosPacienteId','MedicoId','HorarioId'],
                where:{
                    id:id
                }
            }
        );
        if(!listaCitas){
            const er = {
                msj: 'el id no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar citas ejecutada correctamente',  200, listaCitas, [], res);
        }
    }
}

exports.BuscarFechaAtencion = async (req, res) =>{
    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { fechaAtencion } = req.query;
        const listaCitas = await Citas.findAll(
            {   
                attributes: ['fechaAtencion', 'inicioAtencion','finAtencion','activo','UsuariosPacienteId','MedicoId','HorarioId'],
                where:{
                    [Op.or]: {
                        fechaAtencion:{
                            [Op.like]: fechaAtencion
                        },
                    }
                }
            }
        );
        if(listaCitas.length == 0){
            const er = {
                msj: 'la fecha no existe',
                parametro: 'fechaAtencion'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar citas ejecutada correctamente',  200, listaCitas, [], res);
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
        const { fechaAtencion, inicioAtencion,finAtencion,UsuariosPacienteId,MedicoId,HorarioId} = req.body;

        if(!fechaAtencion || !inicioAtencion || !finAtencion || !UsuariosPacienteId || !MedicoId || !HorarioId ){
            const er = {
                msj: 'Debe escribir los datos correctamente',
                parametro: 'fechaAtencion, inicioAtencion, finAtencion, UsuariosPacienteId, MedicoId, HorarioId'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Citas.create({
                fechaAtencion: fechaAtencion,
                inicioAtencion: inicioAtencion,
                finAtencion: finAtencion,
                UsuariosPacienteId: UsuariosPacienteId,
                MedicoId: MedicoId,
                HorarioId: HorarioId
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
        //console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const { fechaAtencion, inicioAtencion, finAtencion, activo, UsuariosPacienteId, MedicoId, HorarioId } = req.body;
       // console.log(id);
       console.log(fechaAtencion, inicioAtencion, finAtencion, activo, UsuariosPacienteId, MedicoId, HorarioId)
    
        if(!id){
            const er = {
                msj: 'Debe escribir el id de la cita',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            if(!fechaAtencion || !inicioAtencion || !finAtencion || !UsuariosPacienteId || !MedicoId || !HorarioId || activo==null){
                const er = {
                    msj: 'Debe escribir los datos correctamente para actualizar',
                    parametro: 'fechaAtencion, inicioAtencion, finAtencion, activo, UsuariosPacienteId, MedicoId, HorarioId'
                }
                MSJ('Peticion ejecutada correctamente',  200, [], er, res);         
            }
            else{
                var buscarCita = await Citas.findOne({
                    where:{
                        id: id
                    }
                });
                if (!buscarCita) {
                    const er = {
                        msj: 'el id de la cita no existe',
                        parametro: 'id'
                    }
                    MSJ('Peticion ejecutada correctamente',  200, [], er, res);
                }
                else{
                    buscarCita.fechaAtencion=fechaAtencion;
                    buscarCita.inicioAtencion=inicioAtencion;
                    buscarCita.finAtencion=finAtencion;
                    buscarCita.activo=activo;
                    buscarCita.UsuariosPacienteId=UsuariosPacienteId;
                    buscarCita.MedicoId=MedicoId;
                    buscarCita.HorarioId=HorarioId;

                    await buscarCita.save()

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
                msj: 'el id de la cita no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Citas.destroy({where: {id: id}})
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