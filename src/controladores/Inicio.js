
exports.Inicio = (req, res) => {
    const hospital={
        api: 'Interfaz de programacion del sistema Hospital',
        hospital: 'Sistema de gestion de hospital',
        desarrolladores: 'grupo 1',
        modulos:[
            {nombre: 'medicos', ruta: '/api/medicos'},
            {nombre: 'especialidades', ruta: '/api/especialidades'},
            {nombre: 'salas', ruta: '/api/salas'},
            {nombre: 'horarios', ruta: '/api/horarios'},
            {nombre: 'enfermeras', ruta: '/api/enfermeras'},
            {nombre: 'usuarios', ruta: '/api/usuarios'},
            {nombre: 'secretarias', ruta: '/api/secretarias'},
            {nombre: 'expedientes', ruta: '/api/expedientes'},
            {nombre: 'recetas', ruta: '/api/recetas'},
            {nombre: 'citas', ruta: '/api/citas'},
            {nombre: 'usuariopacientes', ruta: '/api/usuariopacientes'},
            {nombre: 'pacientes', ruta: '/api/pacientes'},
            {nombre: 'autenticacion', ruta: '/api/autenticacion'},
        ]
    }
    res.json(hospital);
};


exports.Medicos = (req, res) => {

    res.send('Esta es la ruta de Medicos');
};

exports.Especialidades = (req, res) => {

    res.send('Esta es la ruta de Especialidades');
};

exports.Salas = (req, res) => {

    res.send('Esta es la ruta de Salas');
};

exports.Enfermeras = (req, res) => {

    res.send('Esta es la ruta de Enfermeras');
};

exports.Usuarios = (req, res) => {

    res.send('Esta es la ruta de Usuarios');
};

exports.Secretarias = (req, res) => {

    res.send('Esta es la ruta de Secretarias');
};

exports.Expedientes = (req, res) => {

    res.send('Esta es la ruta de Expedientes');
};

exports.Recetas = (req, res) => {

    res.send('Esta es la ruta de Recetas');
};

exports.Citas = (req, res) => {

    res.send('Esta es la ruta de Citas');
};

exports.UsuarioPacientes = (req, res) => {

    res.send('Esta es la ruta de UsuarioPacientes');
};

exports.Pacientes = (req, res) => {

    res.send('Esta es la ruta de Pacientes');
};