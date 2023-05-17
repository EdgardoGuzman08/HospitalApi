const nodemailer = require('nodemailer');
exports.EnviarCorreo = async (data) =>{
    const configurarCorreo = {
        from: process.env.APP_CORREO,
        to: data.correo,
        subject: 'Recuperación de contraseña SIGMER',
        text: 'Pin temporal: ' + data.pin,
    };
    const transporte = nodemailer.createTransport({
        host: process.env.CORREO_SERVICIO,
        port: process.env.CORREO_PORT,
        secure: true,
        auth:{
            user: process.env.APP_CORREO,
            pass: process.env.CORREO_CONTRASENA,
        },
    });
    await transporte.verify(function(error, success){
        if(error){
            console.log(error);
            return false;
        }
        else{
            console.log('El servidor puede enviar correos');
        }
    });
    await transporte.sendMail(configurarCorreo)
    .then((data)=>{
        console.log(data);
    })
    .catch((er)=>{
        console.log(er);
        return false;
    });
    
    return true;
};
