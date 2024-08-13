require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
/*const auth = require("./middleware/auth");
const users = require("./api_modules/users");*/
const seguridad = require("./api_modules/seguridad");
const parametros = require("./api_modules/parametros");
const subsidio = require("./api_modules/subsidio");
const reportes = require("./api_modules/reportes");
const consultas = require("./api_modules/consultas");
const alertas = require("./api_modules/alertas");
const eett = require("./api_modules/eett");
const rutas = require("./api_modules/rutas");
const emv = require("./api_modules/emv");
const flota = require("./api_modules/flota");
const paraderos = require("./api_modules/paraderos");
const nEmpresas = require("./api_modules/nEmpresas");
const nRutas = require("./api_modules/nRutas");
const nVehiculos = require("./api_modules/nVehiculos");
const cnEmpresas = require("./api_modules/cnEmpresas");
const cnRutas = require("./api_modules/cnRutas");
const cnVehiculos = require("./api_modules/cnVehiculos");
const hexagonos = require("./api_modules/hexagonos");
const constructora = require("./api_modules/constructora");
const obras = require("./api_modules/obras");
const conductores = require("./api_modules/conductores");
const validacion = require("./api_modules/validacion");
const ciudadano = require("./api_modules/ciudadano");
const lpr = require("./api_modules/lpr");
const registros = require("./api_modules/registros");

// const ciudadanoApp = require("../api-app/api_modules/buscar");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.options('*', cors());

app.get('/', (req, res) => { res.send('REST API para plataforma web') });
app.post('/api/seguridad/iniciar-sesion', seguridad.login);

app.post('/api/recibir', lpr.upload);
app.get('/api/registros', registros.getAll);
app.post('/api/registros', registros.post);
app.put('/api/registros/:registroId', registros.put);
app.get('/api/reportes', /*auth.verifyToken,*/ reportes.getAll);

app.get('/api/reportes/:reporteId/empresas/:inicio/:final', nEmpresas.getAll);
app.get('/api/reportes/:reporteId/empresas/:empresaId/rutas/:inicio/:final', nRutas.getAll);
app.get('/api/reportes/:reporteId/empresas/:empresaId/rutas/:rutaId/vehiculos/:inicio/:final', nVehiculos.getAll);

app.get('/api/consultas', /*auth.verifyToken,*/ consultas.getAll);
app.get('/api/consultas/:consultaId', consultas.get);

app.get('/api/consultas/:consultaId/empresas/:inicio/:final', cnEmpresas.getAll);
app.get('/api/consultas/:consultaId/empresas/:empresaId/rutas/:inicio/:final', cnRutas.getAll);
app.get('/api/consultas/:consultaId/empresas/:empresaId/rutas/:rutaId/vehiculos/:inicio/:final', cnVehiculos.getAll);

app.get('/api/parametros', parametros.getAll);
app.post('/api/parametros/alertas', parametros.getParametro);
app.post('/api/parametros', parametros.post);
app.put('/api/parametros/:parametroId', parametros.put);

app.get('/api/alertas', alertas.getAll);
//app.get('/api/alertas/:alertaId', alertas.get);
app.post('/api/alertas/:alertaId', alertas.get);
app.post('/api/alertas', alertas.post);
app.put('/api/alertas/:alertaId', alertas.put);

app.get('/api/seguridad', seguridad.getAll);
app.get('/api/seguridadRoles', seguridad.getRoles);
app.post('/api/seguridad', seguridad.post);
app.put('/api/seguridad/:personaId', seguridad.put);

app.get('/api/eett', eett.getAll);
app.post('/api/eett', eett.post);
app.post('/api/eettViaje', eett.postViaje);
app.post('/api/generarDiario', eett.generarDiario);
app.post('/api/generaDataDiario', eett.generaDataDiario);
app.put('/api/eett/:ettId', eett.put);
app.put('/api/eettViaje/:id', eett.putViaje);
app.post('/api/envioCorreo', eett.envioCorreo);

app.get('/api/rutas', rutas.getAll);
app.post('/api/rutasHistorico', rutas.getRutasHistorico);
app.post('/api/rutasValidacion/', rutas.getRutasValidacion);
app.post('/api/rutaValida/', rutas.getRutaValida);
app.post('/api/rutasEmpresa/', rutas.getRutasEmpresa);
app.post('/api/rutas', rutas.post);
app.post('/api/upload', rutas.upload);
app.put('/api/rutas/:rutasId', rutas.put);

app.get('/api/emv', emv.getAll);
app.post('/api/emv', emv.post);

app.put('/api/emv/:emvId', emv.put);

app.get('/api/subsidio', subsidio.getAll);

app.get('/api/flota/:flotaId', flota.getAll);
app.post('/api/flota/:flotaId', flota.post);
app.post('/api/flotaValidacion', flota.getVehiculosValidacion);
app.put('/api/flota/:placaId', flota.put);
app.put('/api/flota/:flotaId/:placaId', flota.putRuta);

app.get('/api/paraderos', paraderos.getAll);
app.get('/api/paradas', paraderos.getParadas);
app.post('/api/paraderos', paraderos.post);
app.put('/api/paraderos/:paraderoId', paraderos.put);

app.get('/api/hexagonos', hexagonos.getAll);

app.get('/api/constructoras', constructora.getAll);
app.post('/api/constructoras', constructora.post);
app.put('/api/constructoras/:id', constructora.put);

app.get('/api/obras', obras.getAll);
app.post('/api/obras', obras.post);
app.put('/api/obras/:id', obras.put);

app.get('/api/conductores', conductores.getAll);
app.post('/api/conductores', conductores.post);
app.put('/api/conductores/:conductorId', conductores.put);

app.get('/api/constructora', validacion.getConstructora);
app.get('/api/transportista', validacion.getTransportista);
app.get('/api/obras', validacion.getObras);
app.post('/api/getValidaConstancia/:inicio/:final', validacion.getValidaConstancia);
app.post('/api/generarConstancia', validacion.generarConstancia);
app.post('/api/generaDataConstancia', validacion.generaDataConstancia);

// app.post('/api/getHashValido',ciudadano.getHashValido);
// app.post('/api/getOpciones',ciudadanoApp.getOpciones);

const port = process.env.APP_PORT;

app.listen(port)
console.log('app running on port', port);