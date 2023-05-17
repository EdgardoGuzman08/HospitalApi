const passport = require('passport');
const UsuarioP = require('../modelos/UsuariosPaciente');
const estrategiaJWT = require('passport-jwt').Strategy;
const extraerJWT = require('passport-jwt').ExtractJwt;
const JWT = require('jsonwebtoken');
const moment = require('moment');
const expiracion = moment.duration(30, "d").asSeconds();
const claveToken = 'MiClaveSegura';
exports.getToken = (data) =>{
    return JWT.sign(data, claveToken, {expiresIn: expiracion});
};
const opciones = {
    jwtFromRequest: extraerJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: claveToken
};
passport.use(new estrategiaJWT(opciones, async (payload, done)=> {
    return await UsuarioP.findOne({
        where:{
            id: payload.id,
            estado: 'AC'
        }
    })
    .then((data)=>{
        return done(null, data.id);
    })
    .catch((error)=>{
        console.log(error);
        return done(null, false);
    });
}));
exports.ValidarAutendicado = 
passport.authenticate('jwt', {
    session: false, failureRedirect: '/api/login/error'
});