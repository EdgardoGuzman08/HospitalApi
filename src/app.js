const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const db = require('./configuraciones/db');
const Modelos = require('./modelos');

//inicializamos el servidor
const app = express();
app.set('port', 2010);
app.use(morgan('combined'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

/*primera parte*/ 
app.use('/api/', require('./rutas/'));
app.use('/api/imagenes/', express.static(path.join(__dirname, 'public/img')));
app.use('/api/especialidades/', require('./rutas/RutasEspecialidades'));
app.use('/api/salas/', require('./rutas/RutasSalas'));
app.use('/api/medicos/', require('./rutas/RutasMedicos'));
app.use('/api/pacientes/', require('./rutas/RutasPacientes'));
app.use('/api/horarios/', require('./rutas/RutasHorarios'));
/*segunda parte*/ 
app.use('/api/expedientes/', require('./rutas/RutasExpedientes'));
app.use('/api/usuarios/', require('./rutas/RutasUsuarios'));
app.use('/api/usuariopacientes/', require('./rutas/RutasUsuarioPaciente'));
app.use('/api/autenticacion/', require('./rutas/Autenticacion'));
app.use('/api/citas/', require('./rutas/RutasCitas'));
app.use('/api/recetas', require('./rutas/RutasRecetas'));
app.use('/api/login/', require('./rutas/AutenticacionPacientes'));
/*Inicio del programa con su puerto*/
app.listen(app.get('port'), ()=>{
    console.log('Bienvenido al servirdor Sistema de Hospital ' + app.get('port'));
    db.authenticate().then(()=>{
        console.log('se ha establecido la conexion a la base de datos hospital');
        Modelos.CrearModelos();
    })
    .catch((err)=>{
        console.log('error al conectar la bd');
    })

});
