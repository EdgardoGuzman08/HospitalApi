const Expedientes = require('../modelos/Expedientes');
const { validationResult } = require('express-validator');
const MSJ = require('../componentes/mensaje');
const { Op } = require('sequelize');

exports.Inicio = (req, res) => {
    const moduloExpediente = {
        modulo: 'expedientes',
        descripcion: 'Contiene la informacion de los expedientes del paciente',
        rutas: [
            {
                ruta: '/api/expedientes/listar',
                descripcion: 'Lista los expedientes',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/expedientes/guardar',
                descripcion: 'Guarda los expedientes',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/expedientes/editar',
                descripcion: 'Modifica los expedientes',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/expedientes/eliminar',
                descripcion: 'Elimina los expedientes',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/expedientes/buscarid/',
                descripcion: 'hace busqueda por id expedientes',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/expedientes/buscarnombre/',
                descripcion: 'hace busqueda por los diagnosticos de los expedientes',
                metodo: 'GET',
                parametros: 'ninguno'
            },
        ]
    }
    MSJ('Peticion menu expedientes ejecutada correctamente', 200, moduloExpediente, [], res);
}

exports.Listar = async (req, res) => {
    const listaExpedientes = await Expedientes.findAll();
    console.log(listaExpedientes);
    MSJ('Peticion listar salas ejecutada correctamente', 200, listaExpedientes, [], res);
}

exports.BuscarId= async (req, res) =>{

    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const listaExpedientes = await Expedientes.findOne(
            {   
                attributes: ['diagnostico', 'tratamiento', 'UsuariosPacienteId', 'MedicoId'],
                where:{
                    id:id
                }
            }
        );
        if(!listaExpedientes){
            const er = {
                msj: 'el id no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar salas ejecutada correctamente',  200, listaExpedientes, [], res);
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
        const { diagnostico } = req.query;
        const listaExpedientes = await Expedientes.findAll(
            {   
                attributes: ['diagnostico', 'tratamiento', 'UsuariosPacienteId', 'MedicoId'],
                where:{
                    [Op.or]: {
                        diagnostico:{
                            [Op.like]: diagnostico
                        },
                    }
                }
            }
        );
        if(listaExpedientes.length == 0){
            const er = {
                msj: 'el diagnostico no existe',
                parametro: 'diagnostico'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion buscar salas ejecutada correctamente',  200, listaExpedientes, [], res);
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
        const { diagnostico, tratamiento,  UsuariosPacienteId, MedicoId } = req.body;
        if(!diagnostico || !tratamiento || !UsuariosPacienteId || !MedicoId){
            const er = {
                msj: 'Debe escribir la informacion de su diagnostico',
                parametro: 'diagnostico, tratatimento'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Expedientes.create({
                diagnostico: diagnostico,
                tratamiento: tratamiento,
                UsuariosPacienteId: UsuariosPacienteId,
                MedicoId: MedicoId
            }).then((data)=>{
                console.log(data);
                MSJ('Peticion ejecutada correctamente',  200, data, [], res);
            }).catch((err) =>{
                console.log(err)
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
        const { diagnostico, tratamiento, UsuariosPacienteId, MedicoId } = req.body;
        if(!id){
            const er = {
                msj: 'Debe escribir el id de la sala',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            if(!diagnostico || !tratamiento || !UsuariosPacienteId || !MedicoId){
                const er = {
                    msj: 'Debe escribir la informacion de su diagnostico',
                    parametro: 'diagnostico, tratatimento'
                }
                MSJ('Peticion ejecutada correctamente',  200, [], er, res);         
            }
            else{
                var buscarExpediente = await Expedientes.findOne({
                    where:{
                        id: id
                    }
                });
                if (!buscarExpediente) {
                    const er = {
                        msj: 'el id del expediente no existe',
                        parametro: 'id'
                    }
                    MSJ('Peticion ejecutada correctamente',  200, [], er, res);
                }
                else{
                    buscarExpediente.diagnostico=diagnostico;
                    buscarExpediente.tratamiento=tratamiento;
                    buscarExpediente.UsuariosPacienteId=UsuariosPacienteId;
                    buscarExpediente.MedicoId=MedicoId;
                    await buscarExpediente.save()
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
            await Expedientes.destroy({where: {id: id}})
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