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
                        console.error('Solicitud abortada', err);
                    }
                    exec(`cd c:\Apache24\htdocs\smlpr\backend\api-web; pm2 restart handler; `, (error, stdout, stderr) => { });

                    console.error("err", err);

                } else {
                    fs.renameSync(files.image.filepath, `./placas/${files.image.originalFilename.split('/').reverse()[0]}`);
                    fs.renameSync(files.event.filepath, `./json/${files.event.originalFilename.split('/').reverse()[0]}`);
                    fs.readFile(`./json/${files.event.originalFilename.split('/').reverse()[0]}`, 'utf8', async (err, data) => {
                        try {
                            if (err) {
                                console.error('Error al leer el archivo', err);
                                return;
                            }
                            const jsonData = JSON.parse(data);
                            Jimp.read(`../placas/${files.image.originalFilename.split('/').reverse()[0]}`, (err, lenna) => {
                                if (err) throw err;
                                    lenna
                                    .crop(jsonData.plateCoordinates[0] / 2, jsonData.plateCoordinates[1] / 2, jsonData.plateCoordinates[2] / 2, jsonData.plateCoordinates[3] / 2)
                                    .quality(60)
                                    .greyscale()
                                    .write(`./placas/crop_${files.image.originalFilename.split('/').reverse()[0]}`); // save
                            });
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