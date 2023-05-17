const Usuarios = require('../modelos/Usuarios')
const { validationResult } = require('express-validator');
const MSJ = require('../componentes/mensaje');

exports.Inicio = (req, res)=>{
    const moduloUsuarios ={
        modulo: 'usuarios',
        descripcion: 'Contiene la informacion de los Usuarios',
        rutas:[
            {
                ruta: '/api/usuarios/listar',
                descripcion: 'Lista los usuarios',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuarios/guardar',
                descripcion: 'Guarda los usuarios',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuarios/editar',
                descripcion: 'Modifica los usuarios',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuarios/eliminar',
                descripcion: 'Eliminar los usuarios',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuarios/buscarid/',
                descripcion: 'hace busqueda por id usuarios',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/usuarios/buscarnombre/',
                descripcion: 'hace busqueda por login del usuario',
                metodo: 'GET',
                parametros: 'ninguno'
            },
        ]
    } 
    MSJ('Peticion Usuario ejecutada correctamente',  200, moduloUsuarios, [], res);
}

exports.Listar = async (req, res) =>{
    const listaUsuario = await Usuarios.findAll();
    console.log(listaUsuario);
    MSJ('Peticion Usuario Listar ejecutada correctamente',  200, listaUsuario, [], res);
}

exports.Guardar = async (req, res) =>{
    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { login, contrasena, correo, MedicoId } = req.body;
        if(!login || !contrasena || !correo || !MedicoId){
            const er = {
                msj: 'Debe escribir los datos del Usuarios correctamente',
                parametro: 'login, contrasena, correo, MedicoId'
            }
            MSJ('Peticion Guardar Usuarios ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Usuarios.create({
                login: login,
                contrasena: contrasena,
                correo: correo,
                MedicoId: MedicoId
            }).then((data)=>{
                console.log(data);
                MSJ('Peticion Guardar Usuarios ejecutada correctamente',  200, data, [], res);
            }).catch((err) =>{
                var er='';
                err.errors.forEach(element => {
                    console.log(element.message);
                    er+=element.message + '. ';
                });
                MSJ('Peticion Guardar Usuarios ejecutada correctamente',  200, [], {msj: er}, res);
            });
        }
    }
}

exports.Editar = async (req, res) =>{
    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion Editar usuarios ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const { login,  contrasena, correo, MedicoId} = req.body;
        if(!id || !login || !contrasena || !correo || !MedicoId){
            const er = {
                msj: 'Debe escribir el id del usuario',
                parametro: 'id'
            }
            MSJ('Peticion Editar usuariopacientes ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            var buscarUsuario = await Usuarios.findOne({
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
                buscarUsuario.MedicoId= MedicoId;
                await buscarUsuario.save()
                .then((data)=>{
                    console.log(data);
                    MSJ('Peticion Editar usuarios ejecutada correctamente',  200, data, [], res);
                })
                .catch((err) => {
                    var er='';
                    err.errors.forEach(element => {
                    console.log(element.message);
                    er+=element.message + '. ';
                    });
                    MSJ('Peticion Editar Usuarios ejecutada correctamente',  200, [], {msj: er}, res);
                })
            }
        }
    }
}

exports.Eliminar = async (req, res) =>{const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion Eliminar Usuarios ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        console.log(id);
        if(!id){
            const er = {
                msj: 'el id del Usuarios no existe',
                parametro: 'id'
            }
            MSJ('Peticion Eliminar Usuario ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Usuarios.destroy({where: {id: id}})
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