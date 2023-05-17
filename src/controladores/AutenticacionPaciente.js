const { validationResult } = require('express-validator');
const UsuariosP = require('../modelos/UsuariosPaciente');
const Paciente = require('../modelos/Pacientes');
const { Op } = require('sequelize');
const msjRes = require('../componentes/mensaje');
const EnviarCorreo = require('../configuraciones/correo');
const gpc = require('generate-pincode');
const pasport = require('../configuraciones/pasport')
const bcrypt = require('bcrypt');
function validacion(req) {
    var errores=[];
    var validaciones = validationResult(req);
    var error = {
        mensaje: '',
        parametro: '',
    };
    if (validaciones.errors.length > 0) {
        validaciones.errors.forEach(element => {
            error.mensaje = element.msg;
            error.parametro = element.param;
            errores.push(error);
        });
    }
    return errores;
};
exports.Inicio = async (req, res) => {
    var errores = validacion(req);
    const listaModulos =
        [
            {
                modulo: "login",
                rutas: [
                    {
                        ruta: "/api/login",
                        metodo: "get",
                        parametros: "",
                        descripcion: "Inicio del módulo de autenticación"
                    },
                    {
                        ruta: "/api/login/pin",
                        metodo: "post",
                        parametros: {
                            correo: "Correo electronico del usuario, al que se le enviara un correo con el pin. Obligatorio."
                        },
                        descripcion: "Envio de pin de recuperación de contraseña al correo electrónico."
                    },
                    {
                        ruta: "/api/login/recuperarcontrasena",
                        metodo: "put",
                        parametros: {
                            usuario: "login o correo del usuario. Obligatorio.",
                            pin: "Pin enviado al correo del usuario. Obligatorio.",
                            contrasena: "Nueva contrasena de usuario. Obligatorio.",
                        },
                        descripcion: "Actualiza la contraseña del usuario"
                    },
                    {
                        ruta: "/api/login/iniciosesion",
                        metodo: "post",
                        parametros:
                        {
                            usuario: "Login o correo de usuario. Obligatorio",
                            contrasena: "Contraseña del usuario. Obligatorio.",
                        },
                        descripcion: "Genera el token para poder acceder a las rutas del usuario"
                    },
                ],
            }
        ];
    const datos = {
        api: "API-HOSPITAL",
        descripcion: "Interfaz de progamación para el sistema administrativo de Hospital",
        propiedad: "Grupo 1",
        desarrollador: "Grupo 1",
        colaboradores: "",
        fecha: "05/11/2022",
        listaModulos
    };
    msjRes("Peticion ejecutada correctamente", 200, datos, errores);
};
exports.Pin = async (req, res) => {
    var errores = validacion(req);
    console.log(errores);
    if (errores.length>0) {
        msjRes("Peticion ejecutada correctamente", 200, [], errores, res);
    }
    else {
        const { correo } = req.body;
        var buscarUsuario = await UsuariosP.findOne({
            where: {
                correo: correo
            }
        });
        if (!buscarUsuario) {
            errores = [
                {
                    mensaje: "El correo no exite o no esta vinculado con ningun usuario",
                    parametro: "correo"
                },
            ];
            msjRes("Peticion ejecutada correctamente", 200, [], errores, res);
        }
        else {
            const pin = gpc(4);
            const data = {
                correo: correo,
                pin: pin
            };
            console.log(pin);
            if ( await EnviarCorreo.EnviarCorreo(data)){
                buscarUsuario.codigo = pin;
                await buscarUsuario.save();
                msjRes("Peticion ejecutada correctamente", 200, {msj: 'Correo Enviado'}, errores, res);
            }
            else{
                errores = [
                    {
                        mensaje: "Error al enviar el correo",
                        parametro: "correo"
                    }
                ];
                msjRes("Peticion ejecutada correctamente", 200, [], errores, res);
            }
           
        }
    }
};
exports.Recuperar = async (req, res) => {
    var msj = validacion(req);
    console.log(msj);
    if (msj.length>0) {
        msjRes("Peticion ejecutada correctamente", 200, [], msj, res);
    }
    else {
        const busuario = req.query.usuario;
        const { pin, contrasena } = req.body;
        var buscarUsuario = await UsuariosP.findOne({
            where: {
                [Op.or]: {
                    correo: busuario,
                    login: busuario
                },
            }
        });
        console.log(buscarUsuario);
        if (!buscarUsuario) {
            var errores = [
                {
                    mensaje: "El correo o login no exite",
                    parametro: "usuario"
                },
            ];
            msjRes("Peticion ejecutada correctamente", 200, [], errores, res);
        }
        else {
            if (pin != buscarUsuario.codigo) {
                var errores = [
                    {
                        mensaje: "El pin es incorrecto o ha expirado",
                        parametro: "pin"
                    },
                ];
                msjRes("Peticion ejecutada correctamente", 200, [], errores, res);
            }
            else {
                //const hash = bcrypt.hashSync(contrasena, 10);
                buscarUsuario.contrasena = contrasena;
                buscarUsuario.estado = 'AC';
                buscarUsuario.fallidos = 0;
                buscarUsuario.codigo = '0000';
                await buscarUsuario.save()
                    .then((data) => {
                        console.log(data);
                        msjRes("Peticion ejecutada correctamente", 200, data, [], res);
                    })
                    .catch((error) => {
                        msjRes("Peticion ejecutada correctamente", 200, [], error, res);
                    });
            }
        }
    }
};

exports.Error = async (req, res) => {
    var errores = [
        {
            mensaje: "Debe enviar las credenciales correctas",
            parametro: "login"
        },
    ];
    msjRes("Peticion ejecutada correctamente", 200, [], errores, res);
};

exports.InicioSesion = async (req, res) => {
    var msj = validacion(req);
    if (msj.length>0) {
        msjRes("Peticion ejecutada correctamente", 200, [], msj, res);
    }
    else {
        try {
            const { usuario, contrasena } = req.body;
            var buscarUsuario = await UsuariosP.findOne({
                include: {
                    model: Paciente,
                    attributes: ['dni', 'nombre', 'direccion', 'fechaNacimiento', 'genero', 'edad', 'tipoSangre', 'activo','imagen' ],
                },
                where: {
                    [Op.or]: {
                        login: usuario,
                        correo: usuario,
                    },
                    estado: 'AC',
                }
            });
            if (!buscarUsuario) {
                var errores = [
                    {
                        mensaje: "El usuario no exite o se encuentra bloqueado",
                        parametro: "usuario"
                    },
                ];
                msjRes("Peticion ejecutada correctamente", 200, [], errores, res);
            }
            else {
                if (buscarUsuario.VerificarContrasena(contrasena, buscarUsuario.contrasena)) {
                    const token = pasport.getToken({ id: buscarUsuario.id });
                    const data = {
                        token: token,
                        usuario: {
                            dni: buscarUsuario.Paciente.dni,
                            nombre: buscarUsuario.Paciente.nombre,
                            correo: buscarUsuario.correo,
                            login: buscarUsuario.login,
                            direccion: buscarUsuario.Paciente.direccion,
                            fechaNacimiento: buscarUsuario.Paciente.fechaNacimiento,
                            genero: buscarUsuario.Paciente.genero,
                            edad: buscarUsuario.Paciente.edad,
                            tipoSangre: buscarUsuario.Paciente.tipoSangre,
                            activo: buscarUsuario.Paciente.activo,
                            imagen: buscarUsuario.Paciente.imagen
                        }
                    };
                    msjRes("Peticion ejecutada correctamente", 200, data, [], res);
                }
                else {
                    var errores = [
                        {
                            mensaje: "El usuario no exite o la contraseña es incorrecta",
                            parametro: "contrasena"
                        },
                    ];
                    buscarUsuario.fallidos = buscarUsuario.fallidos + 1;
                    await buscarUsuario.save()
                    .then((data)=>{
                        console.log(data);
                    }).catch((er)=>{
                        console.log(er);
                        errores=er;
                    });
                    msjRes("Peticion ejecutada correctamente", 200, [], errores, res);
                }
            }
        } catch (error) {
            console.log(error);
            errores = "Error al conectar con la base de datos";
            msjRes("Error al Ejecutar la Peticion", 500, [], errores, res);
        }

    }
};