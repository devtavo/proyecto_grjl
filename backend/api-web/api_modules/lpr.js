const pg = require('../services/pg');
const pgFormat = require('pg-format');
const camelcaseKeys = require('camelcase-keys');
const fs = require("fs");
const formidable = require('formidable');
const form = formidable({ multiples: true });
var Jimp = require('jimp');
form.setMaxListeners(50);
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.setMaxListeners(100);
const { exec } = require('child_process');

var io = require('socket.io-client');
var socket = io.connect('http://78.46.16.8:2006', { reconnect: true });
socket.on('connect', function (socket) {
    console.log('Connected!');
});
/**
 * Inserta archivos LPR
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.upload = async (req, res) => {
    try {
        form.parse(req, (err, fields, files) => {
            // console.log("archivos",files);
            // console.log("fields",fields);

            try {
                if (err) {
                    console.log("entro aqui")
                    if (err.code === 'ECONNABORTED') {
                        // La solicitud ha sido abortada
                        // Realiza las acciones necesarias, como limpiar los archivos parcialmente cargados
                        cleanUpFiles(files);
                        // return res.status(500).send({ message: err });

                        console.error('Solicitud abortada', err);
                    }
                    exec(`cd c:\Apache24\htdocs\smlpr\backend\api-web; pm2 restart handler; `, (error, stdout, stderr) => {});

                    // Manejar el error
                    console.error("err", err);
                    // res.statusCode = 500;

                    // res.end('Error en el análisis del formulario');
                    // return res.status(500).send({ message: err });
                } else {
                    console.log("entro aqui2")


                    fs.renameSync(files.image.filepath, `./placas/${files.image.originalFilename.split('/').reverse()[0]}`);
                    fs.renameSync(files.event.filepath, `./json/${files.event.originalFilename.split('/').reverse()[0]}`);
                    // console.log(`${files.image.originalFilename.split('/').reverse()[0]}`);
                    fs.readFile(`./json/${files.event.originalFilename.split('/').reverse()[0]}`, 'utf8', async (err, data) => {

                        try {
                            if (err) {

                                console.error('Error al leer el archivo', err);
                                return;
                            }
                            const jsonData = JSON.parse(data);
                            Jimp.read(`http://78.46.16.8/smlpr/backend/api-web/placas/${files.image.originalFilename.split('/').reverse()[0]}`, (err, lenna) => {
                                if (err) throw err;
                                lenna
                                    .crop(jsonData.plateCoordinates[0]/2, jsonData.plateCoordinates[1]/2, jsonData.plateCoordinates[2]/2, jsonData.plateCoordinates[3]/2) // resize
                                    .quality(60) // set JPEG quality
                                    .greyscale() // set greyscale
                                    .write(`./placas/crop_${files.image.originalFilename.split('/').reverse()[0]}`); // save
                            });
                            // Hacer algo con los datos JSON
                            const autorizado = await pg.query(`select * from smlpr.sm_vehiculo where placa_vehiculo=$1`, [jsonData.plateASCII.toUpperCase()]);
                            let _vautorizado = autorizado.length > 0 ? 'SI' : 'NO';

                            const empresa = await pg.query(`select se.* from smlpr.sm_empresas se inner join smlpr.sm_vehiculo sv on se.id= sv.id_ett where sv.placa_vehiculo =$1 and  se.id_estado_ett='1'`, [jsonData.plateASCII.toUpperCase()]);
                            let _vempresa = empresa.length > 0 ? empresa[0].razon_social_Empresa : '';

                            // console.log("empresa", empresa);
                            // console.log("autorizado", jsonData.plateConfidence);
                            if (Number(jsonData.plateConfidence) > 0.58) {

                                if (jsonData.sensorProviderID == 'LPR_ALTO') {

                                    const registro = await pg.query(`
                                        insert into smlpr.sm_registros(placa, id_razon_social, tipo, foto, autorizado ,estado,tipo_color,foto_contexto,origen)
                                        values(
                                            $1
                                            ,$8
                                            ,$3
                                            ,$2
                                            ,$6
                                            ,'I'
                                            ,$4 ||' / '|| $5
                                            ,$7
                                            ,'L'
                                            ) RETURNING *`,
                                        [jsonData.plateASCII.toUpperCase()
                                            , `http://78.46.16.8/smlpr/backend/api-web/placas/crop_${files.image.originalFilename.split('/').reverse()[0]}`
                                            , autorizado[0]?.tipo_proceso
                                            , jsonData.vehicle_info.type = 'UNDEFINED' ? '-' : jsonData.vehicle_info.type
                                            , jsonData.vehicle_info.color = 'UNDEFINED' ? '-' : jsonData.vehicle_info.color
                                            , _vautorizado
                                            , `http://78.46.16.8/smlpr/backend/api-web/placas/${files.image.originalFilename.split('/').reverse()[0]}`
                                            , _vempresa
                                        ]);
                                    // console.log("registro",registro);

                                    socket.emit('recibir_app', {
                                        'fechaRegistro': registro[0].fecha_registro,
                                        'id': registro[0].id,
                                        'placa': jsonData.plateASCII.toUpperCase(),
                                        'tipo': registro[0].tipo,
                                        'autorizado': registro[0].autorizado,
                                        'estado': registro[0].estado,
                                        'tipoColor': jsonData.vehicle_info.type + ' - ' + jsonData.vehicle_info.color,
                                        'foto': `http://78.46.16.8/smlpr/backend/api-web/placas/crop_${files.image.originalFilename.split('/').reverse()[0]}`,
                                        'fotoContexto': `http://78.46.16.8/smlpr/backend/api-web/placas/${files.image.originalFilename.split('/').reverse()[0]}`,
                                        'origen': registro[0].origen,
                                        'razonSocialEmpresa': registro[0].razonSocialEmpresa
                                    });
                                    emitter.emit('procesamientoCompletado', registro[0]);

                                } else {

                                    const validaRegistro = await pg.query(`select * from smlpr.sm_registros where placa= $1 order by id desc limit 1`, [jsonData.plateASCII]);

                                    const updateRegistro = await pg.query(`
                                    update smlpr.sm_registros set estado='S' where placa= $1 and id= $2 RETURNING *`, [jsonData.plateASCII, validaRegistro[0].id]);
                                    
                                    const updateViaje = await pg.query(`update smlpr.sm_empresas a set viajes= a.viajes-1 
                                        from (select a.* from smlpr.sm_empresas a 
                                            inner join smlpr.sm_vehiculo b on  a.id = b.id_ett 
                                            where b.placa_vehiculo ='abc-123') b where a.id=b.id
                                        `,[]);


                                    socket.emit('actualizar_app', {
                                        'fechaRegistro': updateRegistro[0].fecha_registro,
                                        'id': updateRegistro[0].id,
                                        'placa': updateRegistro[0].placa,
                                        'tipo': updateRegistro[0].tipo,
                                        'autorizado': updateRegistro[0].autorizado,
                                        'estado': updateRegistro[0].estado,
                                        'tipoColor': jsonData.vehicle_info.type + ' - ' + jsonData.vehicle_info.color,
                                        'foto': `http://78.46.16.8/smlpr/backend/api-web/placas/crop_${files.image.originalFilename.split('/').reverse()[0]}`,
                                        'fotoContexto': `http://78.46.16.8/smlpr/backend/api-web/placas/${files.image.originalFilename.split('/').reverse()[0]}`,
                                        'origen': updateRegistro[0].origen,
                                        'razonSocialEmpresa': updateRegistro[0].razonSocialEmpresa
                                    });

                                }
                            }

                        } catch (error) {
                            console.error('Error al analizar el archivo JSON', error);
                        }
                    })
                    return res.status(200).send({});
                }
            } catch (err) {
                console.log("Error copying file", err);
                return res.status(500).send({});

            }



        });

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
function cleanUpFiles(files) {
    for (const key in files) {
        if (Object.hasOwnProperty.call(files, key)) {
            const file = files[key];
            if (Array.isArray(file)) {
                // Si el campo es un arreglo de archivos
                file.forEach((f) => {
                    deleteFile(f.path);
                });
            } else {
                // Si el campo es un solo archivo
                deleteFile(file.path);
            }
        }
    }
}

function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error al eliminar el archivo:', filePath, err);
        } else {
            console.log('Archivo eliminado:', filePath);
        }
    });
}
emitter.on('procesamientoCompletado', (registro) => {
    console.log('Procesamiento completado:', registro);
    // Aquí puedes realizar acciones adicionales después de que se complete el procesamiento
});