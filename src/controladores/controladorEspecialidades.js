const Especialidades = require('../modelos/Especialidades');
const { validationResult } = require('express-validator');
const MSJ = require('../componentes/mensaje');
const { Op } = require('sequelize');

exports.Inicio = (req, res) => {
    const moduloEspecialidad = {
        modulo: 'especialidad',
        descripcion: 'Contiene la informacion de las especialidades en el hospital',
        rutas: [
            {
                ruta: '/api/especialidades/listar',
                descripcion: 'Lista las especialidades',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/especialidades/guardar',
                descripcion: 'Guarda las especialidades',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/especialidades/editar',
                descripcion: 'Modifica las especialidades',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/especialidades/eliminar',
                descripcion: 'Elimina las especialidades',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/especialidades/buscarid/',
                descripcion: 'hace busqueda por id especialidad',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/especialidades/buscarnombre/',
                descripcion: 'hace busqueda por el nombre de las especialidades',
                metodo: 'GET',
                parametros: 'ninguno'
            },
        ]
    }
    MSJ('Peticion ejecutada correctamente', 200, moduloEspecialidad, [], res);
}

exports.Listar = async (req, res) => {
    const listaEspecialidades = await Especialidades.findAll();
    console.log(listaEspecialidades);
    MSJ('Peticion ejecutada correctamente', 200, listaEspecialidades, [], res);
}

exports.BuscarId= async (req, res) =>{

    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const listaEspecialidades = await Especialidades.findOne(
            {   
                attributes: ['TipoEspecialidad', 'activo'],
                where:{
                    id:id
                }
            }
        );
        if(!listaEspecialidades){
            const er = {
                msj: 'el id no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion ejecutada correctamente',  200, listaEspecialidades, [], res);
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
        const { TipoEspecialidad } = req.query;
        const listaEspecialidades = await Especialidades.findAll(
            {   
                attributes: ['TipoEspecialidad', 'activo'],
                where:{
                    [Op.or]: {
                        TipoEspecialidad:{
                            [Op.like]: TipoEspecialidad
                        },
                        activo: true,
                    }
                }
            }
        );
        if(listaEspecialidades.length == 0){
            const er = {
                msj: 'el tipo de especialidad no existe',
                parametro: 'TipoEspecialidad'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion ejecutada correctamente',  200, listaEspecialidades, [], res);
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
        const { TipoEspecialidad } = req.body;
        if(!TipoEspecialidad){
            const er = {
                msj: 'Debe escribir el nombre de la especialidad',
                parametro: 'TipoEspecialidad'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Especialidades.create({
                TipoEspecialidad: TipoEspecialidad
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
        const { TipoEspecialidad, activo } = req.body;
        console.log(id);
        console.log(TipoEspecialidad);
        console.log(activo);
        if(!id){
            const er = {
                msj: 'Debe escribir el id de la especialidad',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            if(!TipoEspecialidad){
                const er = {
                    msj: 'Debe escribir el nombre de la especialidad',
                    parametro: 'TipoEspecialidad'
                }
                MSJ('Peticion ejecutada correctamente',  200, [], er, res);         
            }
            else{
                var buscarEspecialidad = await Especialidades.findOne({
                    where:{
                        id: id
                    }
                });
                if (!buscarEspecialidad) {
                    const er = {
                        msj: 'el id de la especialidad no existe',
                        parametro: 'id'
                    }
                    MSJ('Peticion ejecutada correctamente',  200, [], er, res);
                }
                else{
                    buscarEspecialidad.TipoEspecialidad=TipoEspecialidad;
                    buscarEspecialidad.activo= activo;
                    await buscarEspecialidad.save()
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
            await Especialidades.destroy({where: {id: id}})
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