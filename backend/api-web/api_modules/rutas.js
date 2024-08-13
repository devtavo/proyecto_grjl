const pg = require('../services/pg');
const pgFormat = require('pg-format');
const camelcaseKeys = require('camelcase-keys');
const multer = require("multer");
const lineByLine = require("n-readlines");

/**
 * Retorna la lista de rutas con Objetos
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const rutas = await pg.query(`
        select
            id_municipalidad,
            id_ruta,
            id_patio,
            codigo_ruta,
            nombre_ruta,
            glosa_ruta,
            detalle_ruta,
            sentido,
            ST_AsGeoJSON(geom12)::json as geom12,
            ST_AsGeoJSON(geom21)::json as geom21,
            estado,
            case when estado ='1' then 'Activo' 
                 when estado ='2' then 'Inactivo'
            end n_estado
        from giz.giz_ruta
        order by 4
        `, []);

        return res.status(200).send(camelcaseKeys(rutas));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Retorna la lista de historico de cambios en las rutas
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getRutasHistorico = async (req, res) => {
    try {
        const rutas = await pg.query(`
       select row_number() over(order by 1) id,* from giz.giz_ruta_historico where id_ruta=$1
        `, [req.body.idRuta]);

        return res.status(200).send(camelcaseKeys(rutas));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Retorna la lista de rutas con Objetos
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getRutaValida = async (req, res) => {
    try {
        const rutas = await pg.query(`
        select
            id_municipalidad,
            id_ruta,
            id_patio,
            codigo_ruta,
            nombre_ruta,
            glosa_ruta,
            detalle_ruta,
            sentido,
            ST_AsGeoJSON(geom12)::json as geom12,
            ST_AsGeoJSON(geom21)::json as geom21,
            estado
        from giz.giz_ruta
        where id_ruta=$1
        and estado='1'
        order by 4
        `, [req.body.idRuta]);

        return res.status(200).send(camelcaseKeys(rutas));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Retorna la lista de rutas con una condicion de empresa
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getRutasValidacion = async (req, res) => {
    try {
        const rutas = await pg.query(`
        select 
            gr.id_ruta,
            gr.nombre_ruta,
            ST_AsGeoJSON(gr.geom12)::json as geom12,
            ST_AsGeoJSON(gr.geom21)::json as geom21 
        from giz.giz_ruta gr 
            inner join giz.giz_flotavehiculos fv on gr.id_ruta=fv.id_ruta 
        where id_ett=$1 and gr.estado='1'
            group by 
            gr.id_ruta,
            gr.nombre_ruta,
            gr.geom12,
            gr.geom21, 
            estado
        `, [req.body.idEtt]);

        return res.status(200).send(camelcaseKeys(rutas));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}



/**
 * Retorna la lista de rutas con una condicion de empresa
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getRutasEmpresa = async (req, res) => {
    try {
        const rutas = await pg.query(`
        select * from smlpr.sm_pago_viajes
        where id_ett=$1
        order by 1 desc limit 10
         `, [req.body.idEtt]);

        return res.status(200).send(camelcaseKeys(rutas));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Inserta una nueva ruta
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {
        if (!req.body.codigoRuta)
            return res.status(404).send({ message: "Debe enviar el código de la ruta" });

        if (!req.body.nombreRuta)
            return res.status(404).send({ message: "Debe enviar el nombre de la ruta" });

        await pg.query(`create temporary table if not exists temp_rutas_geom(geom text, sentido smallint)`, []);

        if (req.body.geom12)
            await pg.query(pgFormat('insert into temp_rutas_geom(geom, sentido) values %L', getFeatures(req.body.geom12, 1)), []);

        if (req.body.geom21)
            await pg.query(pgFormat('insert into temp_rutas_geom(geom, sentido) values %L', getFeatures(req.body.geom21, 2)), []);

        const rutas = await pg.query(`
        insert into giz.giz_ruta(id_municipalidad, codigo_ruta, nombre_ruta, geom12, geom21,glosa_ruta,detalle_ruta,estado) 
        values(
            $1, 
            $2, 
            $3, 
            (select ST_Union(ST_GeomFromGeoJSON(geom)) from temp_rutas_geom where sentido = 1),
            (select ST_Union(ST_GeomFromGeoJSON(geom)) from temp_rutas_geom where sentido = 2),
            $4,
            $5,
            $6
        ) RETURNING *,st_asgeojson(geom12)::json geom12,st_asgeojson(geom21)::json geom21`, ['300331', req.body.codigoRuta, req.body.nombreRuta, req.body.glosaRuta, req.body.detalleRuta, req.body.estado]);

        await pg.query(`drop table if exists temp_rutas_geom`, []);
        await pg.query(`select giz.fu_ruta_geom($1)`, [rutas[0].id_ruta]);
        await pg.query(`insert into giz.giz_ruta_historico(id_municipalidad,id_ruta) values('300331',$1)`, [rutas[0].id_ruta]);

        return res.status(201).send(camelcaseKeys(
            rutas.map(ruta => ({
                ...ruta
            }))
        ));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualiza una ruta
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        if (!req.body.codigoRuta)
            return res.status(404).send({ message: "Debe enviar el código de la ruta" });

        if (!req.body.nombreRuta)
            return res.status(404).send({ message: "Debe enviar el nombre de la ruta" });

        await pg.query(`create temporary table if not exists temp_rutas_geom(geom text, sentido smallint)`, []);

        if (req.body.geom12)
            await pg.query(pgFormat('insert into temp_rutas_geom(geom, sentido) values %L', getFeatures(req.body.geom12, 1)), []);

        if (req.body.geom21)
            await pg.query(pgFormat('insert into temp_rutas_geom(geom, sentido) values %L', getFeatures(req.body.geom21, 2)), []);

        const rutas = await pg.query(`
            update
                giz.giz_ruta
            set
                codigo_ruta = $1,
                nombre_ruta = $2,
                geom12 = (select ST_Union(ST_GeomFromGeoJSON(geom)) from temp_rutas_geom where sentido = 1),
                geom21 = (select ST_Union(ST_GeomFromGeoJSON(geom)) from temp_rutas_geom where sentido = 2),
                glosa_ruta= $4,
                detalle_ruta=$5,
                estado= $6
            where
                id_ruta = $3
            RETURNING *,st_asgeojson(geom12)::json geom12,st_asgeojson(geom21)::json geom21`, [req.body.codigoRuta, req.body.nombreRuta, req.body.idRuta, req.body.glosaRuta, req.body.detalleRuta, req.body.estado]);

        await pg.query(`select giz.fu_ruta_geom($1)`, [req.body.idRuta]);

        if (req.body.geom12 == '' || req.body.geom21 == '')
            await pg.query(`insert into giz.giz_ruta_historico(id_municipalidad,id_ruta,geom12,geom21,motivo) values('300331',$1,(select st_union(st_geomfromGeoJSON(geom)) from temp_rutas_geom where sentido = 1),(select st_union(st_geomfromGeoJSON(geom)) from temp_rutas_geom where sentido = 2),'Se elimino ruta')`, [req.body.idRuta]);

        if ((req.body.geom12 != '' && req.body.geom12 != null) || (req.body.geom21 != null && req.body.geom21 != ''))
            await pg.query(`insert into giz.giz_ruta_historico(id_municipalidad,id_ruta,geom12,geom21,motivo) values('300331',$1,(select st_union(st_geomfromGeoJSON(geom)) from temp_rutas_geom where sentido = 1),(select st_union(st_geomfromGeoJSON(geom)) from temp_rutas_geom where sentido = 2),'Se agrego geometria de ruta')`, [req.body.idRuta]);

        await pg.query(`drop table if exists temp_rutas_geom`, []);
        return res.status(200).send(camelcaseKeys(
            rutas.map(ruta => ({
                ...ruta
            }))[0]
        ));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Retorna un arreglo con las geometrías del GeoJSON
 * @param {GeoJSON} geoJSON 
 * @param {Number} sentido 
 * @returns 
 */
const getFeatures = (geoJSON, sentido = 1) => {
    let geometry = [];

    if (geoJSON) [geoJSON].map((g) => { geometry.push([JSON.stringify(g), sentido]) });
    return geometry;
}

/**
 * Retorna un arreglo con las geometrías del GeoJSON, para historico
 * @param {GeoJSON} geoJSON 
 * @param {Number} sentido 
 * @returns 
 */
const getGeom = (geoJSON1, sentido = 1, id_muni, id_ruta) => {
    let geometry = [];

    if (geoJSON) [geoJSON].map((g) => { geometry.push([JSON.stringify(g), sentido]) });
    return geometry;
}

const storage = multer.diskStorage({
    destination: "../files",
    filename(req, file, cb) {
        cb(null, `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage }).single("file");

exports.upload = async (req, res) => {
    let struct=[{
        id:"id",
        numeric: false,
        laber:"id",
        csvIndex: 0
    }
    ,{
        id:"placa",
        numeric: false,
        laber:"placa",
        csvIndex: 1
    }
    ,{
        id:"codigoSoat",
        numeric: false,
        laber:"codigoSoat",
        csvIndex: 2
    }
    ,{
        id:"vencimientoSoat",
        numeric: false,
        laber:"vencimientoSoat",
        csvIndex: 3
    }
];
    
    upload(req, res, async err => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }else{

            let liner = new lineByLine(req.file.path);
            let lineNumber = 1;
            let placasRepetidas=[];
            let line = liner.next().toString();
            if (line.length > 0) {
                while ((line = liner.next())) {
                  let oneRow = line.toString();
                  oneRow = oneRow.replace(/(\r\n|\n|\r)/gm, "");
                  const oneRowArray = oneRow.split(";");
                  const exist = await pg.query(`select placa_vehiculo,'duplicado' as error from smlpr.sm_vehiculo where placa_vehiculo='${oneRowArray[0]}' and id_ett=${req.body.idEtt}`)
                    console.log(exist);                    
                  if(exist.length==0){
                      const query = await pg.query(`
                      insert into smlpr.sm_vehiculo(placa_vehiculo,id_estado_vehiculo,id_ett,codigo_soat,vencimiento_soat,fecha_registro_vehiculo)
                      values(
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        now()
                      )
                      returning *,$3 as id_ett, case when id_estado_vehiculo ='1' then 'Activo' 
                      when id_estado_vehiculo ='2' then 'Inactivo' end estado_vehiculo  ` ,[oneRowArray[0],1,req.body.idEtt,oneRowArray[1],oneRowArray[2]]);
                        // console.log("query",query);
                    }else{
                        placasRepetidas.push(exist[0])

                    }                  
                }
              }
              console.log("pr",placasRepetidas)
              return res.status(200).send(camelcaseKeys([{mgs: "ok"},{err: placasRepetidas}]))
        }

    })

}

const camelToSnake = string => {
    return string
      .replace(/[\w]([A-Z])/g, function (m) {
        return m[0] + "_" + m[1];
      })
      .toLowerCase();
  };