const Pacientes = require('../modelos/Pacientes');
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
    const moduloPaciente = {
        modulo: 'pacientes',
        descripcion: 'Contiene la informacion de los pacientes del hospital',
        rutas: [
            {
                ruta: '/api/pacientes/listar',
                descripcion: 'Lista los pacientes',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/pacientes/guardar',
                descripcion: 'Guarda los pacientes',
                metodo: 'POST',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/pacientes/editar',
                descripcion: 'Modifica los pacientes',
                metodo: 'PUT',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/pacientes/eliminar',
                descripcion: 'Elimina los pacientes',
                metodo: 'DELETE',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/pacientes/buscarid/',
                descripcion: 'hace busqueda por id pacientes',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/pacientes/buscarnombre/',
                descripcion: 'hace busqueda por el nombre de los pacientes',
                metodo: 'GET',
                parametros: 'ninguno'
            },
            {
                ruta: '/api/pacientes/imagen/',
                descripcion: 'Guarda imagen de los pacientes',
                metodo: 'POST',
                parametros: 'ninguno'
            },
        ]
    }
    MSJ('Peticion ejecutada correctamente', 200, moduloPaciente, [], res);
}

exports.Listar = async (req, res) => {
    const listaPacientes = await Pacientes.findAll();
    console.log(listaPacientes);
    MSJ('Peticion ejecutada correctamente', 200, listaPacientes, [], res);
}

exports.BuscarId= async (req, res) =>{

    const validacion = validationResult(req);
    if(!validacion.isEmpty()){
        console.log(validacion);
        MSJ('Peticion ejecutada correctamente',  200, [], validacion.errors, res);
    }
    else{
        const { id } = req.query;
        const listaPacientes = await Pacientes.findOne(
            {   
                attributes: ['dni', 'nombre', 'direccion','genero','fechaNacimiento','edad','tipoSangre'],
                where:{
                    id:id
                }
            }
        );
        if(!listaPacientes){
            const er = {
                msj: 'el id no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion ejecutada correctamente',  200, listaPacientes, [], res);
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
        const listaPacientes = await Pacientes.findAll(
            {   
                attributes: ['dni', 'nombre', 'direccion','genero','fechaNacimiento','edad','tipoSangre', 'activo'],
                where:{
                    [Op.or]: {
                        nombre:{
                            [Op.like]: nombre
                        },
                        activo: true,
                    }
                }
            }
        );
        console.log(listaPacientes)
        if(listaPacientes.length == 0){
            const er = {
                msj: 'el nombre de paciente no existe',
                parametro: 'nombre'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            MSJ('Peticion ejecutada correctamente',  200, listaPacientes, [], res);
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
        const { dni, nombre, direccion, genero ,fechaNacimiento,edad,tipoSangre } = req.body;
        if(!dni || !nombre || !genero || !edad  ){
            const er = {
                msj: 'Debe escribir el nombre de la especialidad',
                parametro: 'dni , nombre, genero, edad'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Pacientes.create({
                dni:dni,
                nombre:nombre,
                direccion:direccion,
                genero:genero,
                fechaNacimiento:fechaNacimiento,
                edad:edad,
                tipoSangre:tipoSangre

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
        const { dni, nombre, direccion, genero ,fechaNacimiento, edad, tipoSangre } = req.body;

        console.log(id);
        if(!id){
            const er = {
                msj: 'Debe escribir el id del paciente',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{ 
            if(!nombre){
                const er = {
                    msj: 'Debe escribir el nombre del paciente',
                    parametro: 'nombre'
                }
                MSJ('Peticion ejecutada correctamente',  200, [], er, res);         
            }
            else{
                var buscarPaciente = await Pacientes.findOne({
                    where:{
                        id: id
                    }
                });
                if (!buscarPaciente) {
                    const er = {
                        msj: 'el id del paciente no existe',
                        parametro: 'id'
                    }
                    MSJ('Peticion ejecutada correctamente',  200, [], er, res);
                }
                else{
                    buscarPaciente.dni= dni;
                    buscarPaciente.nombre=nombre
                    buscarPaciente.direccion=direccion;
                    buscarPaciente.genero=genero;
                    buscarPaciente.fechaNacimiento=fechaNacimiento;
                    buscarPaciente.edad=edad;
                    buscarPaciente.tipoSangre=tipoSangre;
                    await buscarPaciente.save()
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
                msj: 'el id del paciente no existe',
                parametro: 'id'
            }
            MSJ('Peticion ejecutada correctamente',  200, [], er, res);
        }
        else{
            await Pacientes.destroy({where: {id: id}})
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
        var buscarPaciente = await Pacientes.findOne({where: { id }});
        if(!buscarPaciente){
            const buscarImagen = fs.existsSync(path.join(__dirname, '../public/img/pacientes/' + filename));
            if(!buscarImagen){
                console.log('La imagen no existe');
            }
            else{
                fs.unlinkSync(path.join(__dirname, '../public/img/pacientes' + filename));//unlinksync elimina la imagen
                console.log('Imagen eliminada');
            }
            error.msg='El id del paciente no existe, se elimino la imagen enviada';
            error.parametro='id';
            errores.push(error);
            MSJ("Peticion ejecutada correctamente", 200, [], errores, res);
        }
        else{
            const buscarImagen = fs.existsSync(path.join(__dirname, '../public/img/pacientes/' + buscarPaciente.imagen));
            if(!buscarImagen){
                console.log('No encontró la imagen');
            }
            else{
                fs.unlinkSync(path.join(__dirname, '../public/img/pacientes/' +  buscarPaciente.imagen));
                console.log('Imagen eliminada');
            }
            buscarPaciente.imagen=filename;
            await buscarPaciente.save()
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