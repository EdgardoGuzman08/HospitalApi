const Citas = require('./Citas');
const Especialidades = require('./Especialidades');
const Expedientes = require('./Expedientes');
const Horarios = require('./Horarios');
const Medicos = require('./Medicos');
const Pacientes = require('./Pacientes');
const Recetas = require('./Recetas');
const Salas = require('./Salas');
const Usuarios = require('./Usuarios');
const UsuariosPaciente = require('./UsuariosPaciente');

exports.CrearModelos = async () =>{
    
    Pacientes.hasMany(UsuariosPaciente);
    UsuariosPaciente.belongsTo(Pacientes);

    UsuariosPaciente.hasMany(Recetas);
    Recetas.belongsTo(UsuariosPaciente);

    UsuariosPaciente.hasMany(Citas);
    Citas.belongsTo(UsuariosPaciente);

    UsuariosPaciente.hasMany(Expedientes);
    Expedientes.belongsTo(UsuariosPaciente);

    Medicos.hasMany(Citas);
    Citas.belongsTo(Medicos);

    Horarios.hasMany(Citas);
    Citas.belongsTo(Horarios);

    Especialidades.hasMany(Medicos);
    Medicos.belongsTo(Especialidades);

    Salas.hasMany(Medicos);
    Medicos.belongsTo(Salas);

    Medicos.hasMany(Horarios);
    Horarios.belongsTo(Medicos);

    Medicos.hasMany(Citas);
    Citas.belongsTo(Medicos);

    Medicos.hasMany(Expedientes);
    Expedientes.belongsTo(Medicos);

    Medicos.hasMany(Recetas);
    Recetas.belongsTo(Medicos);

    Medicos.hasMany(Usuarios);
    Usuarios.belongsTo(Medicos);

    await Pacientes.sync().then(()=>{
        console.log('Modelo Pacientes Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Pacientes');
    })

    await UsuariosPaciente.sync().then(()=>{
        console.log('Modelo Usuarios Pacientes Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Usuarios Pacientes');
    })

    await Especialidades.sync().then(()=>{
        console.log('Modelo Especialidades Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Especialidades');
    })

    await Salas.sync().then(()=>{
        console.log('Modelo Salas Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Salas');
    })

    await Medicos.sync().then(()=>{
        console.log('Modelo Medicos Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Medicos');
    })

    await Horarios.sync().then(()=>{
        console.log('Modelo Horarios Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Horarios');
    })

    await Citas.sync().then(()=>{
        console.log('Modelo Citas Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Citas');
    })

    await Recetas.sync().then(()=>{
        console.log('Modelo Recetas Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Recetas');
    })

    await Expedientes.sync().then(()=>{
        console.log('Modelo Expedientes Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Expedientes');
    })

    await Usuarios.sync().then(()=>{
        console.log('Modelo Usuarios Creado correctamente');
    })
    .catch((err) =>{
        console.log('Error al crear el modelo Usuarios');
    })
};