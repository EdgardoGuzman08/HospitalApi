const mensaje = (msj, estado, data, errores, res) =>{
    var mensajes = {
        msj: msj,
        data: data,
        errores: errores
    };
    res.setHeader('Content-Type', 'application/json');
    res.statusCode=estado;
    res.json(mensajes);
}
module.exports = mensaje;