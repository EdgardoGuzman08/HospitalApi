const UsuariosPacientes = require('../modelos/UsuariosPaciente')
const { validationResult } = require('express-validator');
const MSJ = require('../componentes/mensaje');

exports.Inicio = (req, res)=>{
    const moduloUsuariosPacientes ={
        modulo: 'usuariopacientes',
        descripcion: 'Contiene la informacion de los UsuariosPacientes',
        rutas:[
            {
                ruta: '/api/usuariopacientes/listar',
                descripcion: 'Lista los usuariospacientes',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuariopacientes/guardar',
                descripcion: 'Guarda los usuariospacientes',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuariopacientes/editar',
                descripcion: 'Modifica los usuariospacientes',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuariopacientes/eliminar',
                descripcion: 'Eliminar los usuariospacientes',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuariopacientes/buscarid/',
                descripcion: 'hace busqueda por id usuariopaciente',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuariopacientes/buscarnombre/',
                descripcion: 'hace busqueda por login del usuario paciente',
                metodo: 'GET',
                parametros: 'ninguno'
            },
        ]
    } 
    MSJ('Peticion Usuario ejecutada correctamente',  200, moduloUsuariosPacientes, [], res);
}

exports.Listar = async (req, res) =>{
    const listaUsuariosPacientes = await UsuariosPacientes.findAll();
    console.log(listaUsuariosPacientes);
    MSJ('Peticion Usuario Listar ejecutada correctamente',  200, listaUsuariosPacientes, [], res);
}

exports.Guardar = async (req, res) =>{
    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { login, contrasena, correo, PacienteId } = req.body;
        if(!login || !contrasena || !correo || !PacienteId){
            const er = {
                msj: 'Debe escribir los datos del UsuariosPacientes correctamente',
                parametro: 'login, contrasena, correo, PacienteId'
            }
            MSJ('Peticion Guardar UsuariosPacientes ejecutada correctamente',  200, [], er, res);
        }
        else{
            await UsuariosPacientes.create({
                login: login,
                contrasena: contrasena,
                correo: correo,
                PacienteId: PacienteId
            }).then((data)=>{
                console.log(data);
                MSJ('Peticion Guardar UsuariosPacientes ejecutada correctamente',  200, data, [], res);
            }).catch((err) =>{
                var er='';
                err.errors.forEach(element => {
                    console.log(element.message);
                    er+=element.message + '. ';
                });
                MSJ('Peticion Guardar UsuariosPacientes ejecutada correctamente',  200, [], {msj: er}, res);
            });
        }
    }
}

exports.Editar = async (req, res) =>{
    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion Editar usuariospacientes ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const { login,  contrasena, correo, PacienteId} = req.body;
        if(!id || !login || !contrasena || !correo || !PacienteId){
            const er = {
                msj: 'Debe escribir el id del usuario',
                parametro: 'id'
            }
            MSJ('Peticion Editar usuariopacientes ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            var buscarUsuario = await UsuariosPacientes.findOne({
                where:{
                    id: id
                }
            });
            if (!buscarUsuario) {
                const er = {
                    msj: 'el id del usuario no existe',
                    parametro: 'id'
                }
                MSJ('Peticion buscar Usuario ejecutada correctamente',  200, [], er, res);
            }
            else{
                buscarUsuario.contrasena= contrasena;
                buscarUsuario.login= login;
                buscarUsuario.correo= correo;
                buscarUsuario.PacienteId= PacienteId;
                await buscarUsuario.save()
                .then((data)=>{
                    console.log(data);
                    MSJ('Peticion Editar usuariospacientes ejecutada correctamente',  200, data, [], res);
                })
                .catch((err) => {
                    var er='';
                    err.errors.forEach(element => {
                    console.log(element.message);
                    er+=element.message + '. ';
                    });
                    MSJ('Peticion Editar UsuariosPacientes ejecutada correctamente',  200, [], {msj: er}, res);
                })
            }
        }
    }
}

exports.Eliminar = async (req, res) =>{const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion Eliminar UsuariosPacientes ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        console.log(id);
        if(!id){
            const er = {
                msj: 'el id del UsuariosPacientes no existe',
                parametro: 'id'
            }
            MSJ('Peticion Eliminar Usuario ejecutada correctamente',  200, [], er, res);
        }
        else{
            await UsuariosPacientes.destroy({where: {id: id}})
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