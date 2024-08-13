require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.options('*', cors());

app.post('/api/recibir', async (req, res) => {
    try {
        form.parse(req, (err, fields, files) => {
            // console.log("archivos",files);
            fs.renameSync(files.image.filepath, `./placas/${files.image.originalFilename.split('/').reverse()[0]}`);
            fs.renameSync(files.event.filepath, `./json/${files.event.originalFilename.split('/').reverse()[0]}`);
            fs.readFile(`./json/${files.event.originalFilename.split('/').reverse()[0]}`, 'utf8', async (err, data) => {
                    if (err) {
                        console.error('Error al leer el archivo', err);
                        return;
                    }
                    const jsonData = JSON.parse(data);
                    console.log("json",jsonData)
            })
            return res.status(200).send({});
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
});

app.listen(2005)
console.log('app running on port', 2005);