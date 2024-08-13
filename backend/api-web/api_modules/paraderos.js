const pg = require('../services/pg');
const pgFormat = require('pg-format');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de paraderos
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const idRuta = parseInt(req.query.idRuta);
        const sentido = req.query.sentido === 'undefined' ? '' : req.query.sentido;
        const paraderos = await pg.query(`
        SELECT 
            row_number() over(order by sentido , nombre_paradero  ) id,
            id_paradero, 
            id_municipalidad, 
            id_ruta, 
            nombre_paradero, 
            glosa_paradero, 
            ST_Y(geom) as latitud, 
            ST_X(geom) as longitud,
            round(ST_X(geom)::decimal,8)::text ||' '|| round(ST_Y(geom)::decimal,8)::text  as coordenadas, 
            sentido,
            inicio_fin,
            st_asgeojson(the_geom_estacion)::json the_geom_estacion,
            orden,
            estado,
            case 
                when estado ='1' then 'Activo' 
                when estado ='2' then 'Inactivo'
            end estado_f
            FROM giz.giz_paradero
        where
            estado='1' and 1 = 1
            ${idRuta > 0 ? `and id_ruta = '${idRuta}'` : ''}
            ${sentido.length > 0 ? `and sentido = '${sentido}'` : ''}
        order by sentido , nombre_paradero   
        `, []);
        return res.status(200).send(camelcaseKeys(paraderos));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Retorna la lista de paradas para geoman
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getParadas = async (req, res) => {
    try {
        const idRuta = parseInt(req.query.idRuta);
        const sentido = req.query.sentido === 'undefined' ? '' : req.query.sentido;
        const paraderos = await pg.query(`
        select json_build_object(
            'type','FeatureCollection',
            'features',json_agg(st_asgeojson(a)::json)
            ) as data from(   
            select 
            *
            --st_asgeojson(t.*)::json 
            from (select 
             id_paradero,
             nombre_paradero,
             sentido,
             inicio_fin, 
             the_geom_estacion
             FROM giz.giz_paradero 
             where
             estado='1' and 1 = 1 and 
             the_geom_estacion is not null 
             ${idRuta > 0 ? `and id_ruta = '${idRuta}'` : ''}
             ${sentido.length > 0 ? `and sentido = '${sentido}'` : ''}
             )t
             )a 
             `, []);
        return res.status(200).send(camelcaseKeys(paraderos));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}


/**
 * Inserta un nuevo paradero
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {
        if (!req.body.idRuta)
            return res.status(404).send({ message: "Debe enviar el código de la ruta" });


        if (!Array.isArray(req.body.theGeomEstacion)) {
            await pg.query(`create temporary table if not exists temp_paraderos_geom(geom text, sentido text,id_ruta integer)`, []);
            await pg.query(pgFormat('insert into temp_paraderos_geom(geom, sentido,id_ruta) values %L', getFeatures(req.body.theGeomEstacion, req.body.sentido, req.body.idRuta)), []);
            const paraderos = await pg.query(`
            insert into giz.giz_paradero(id_municipalidad,id_ruta,nombre_paradero,glosa_paradero,sentido,inicio_fin,the_geom_estacion,orden ) 
            values(
                $1, 
                $2, 
                $3, 
                $4,
                $5,
                $6,
                (select ST_GeomFromGeoJSON(geom) from temp_paraderos_geom where id_ruta = $2),
                $7
                ) RETURNING *,st_asgeojson(the_geom_estacion)::json the_geom_estacion`,
                ['300331', req.body.idRuta, req.body.nombreParadero, req.body.glosaParadero, req.body.sentido, req.body.inicioFin, req.body.orden]);
            await pg.query(`drop table if exists temp_paraderos_geom`, []);

            return res.status(201).send(camelcaseKeys(
                paraderos.map(parada => ({
                    ...parada
                }))
            ));

        } else {

            await pg.query(`create temporary table if not exists temp_paraderos_geom( id_ruta integer, name text, names text, sentido text,inicio_fin text, geom text, orden integer )`, []);
            await pg.query(pgFormat('insert into temp_paraderos_geom(id_ruta, name, names, sentido, inicio_fin, geom, orden) values %L', getFeatures2(req.body.theGeomEstacion, req.body.idRuta)), []);

             const paraderos = await pg.query(`
             insert into giz.giz_paradero(id_municipalidad,id_ruta,nombre_paradero,glosa_paradero,sentido,inicio_fin,the_geom_estacion,orden ) 
             select 
            '300331'::text muni,
            id_ruta,
            name,
            names,
            sentido,
            inicio_fin,
            st_force_2d(st_multi(ST_GeomFromGeoJSON(geom))),
            orden
            from temp_paraderos_geom  
            RETURNING *, id_paradero as id,st_asgeojson(the_geom_estacion)::json the_geom_estacion
            `,[]);

             await pg.query(`drop table if exists temp_paraderos_geom`, []);
            return res.status(200).send(camelcaseKeys(paraderos));

        }

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualiza un paradero
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        if (!req.body.idRuta)
            return res.status(404).send({ message: "Debe enviar el código de la ruta" });

        if (!req.body.idParadero)
            return res.status(404).send({ message: "Debe enviar codigo de Paradero" });

        await pg.query(`create temporary table if not exists temp_paraderos_geom(geom text, sentido text,id_ruta integer)`, []);

        if (req.body.theGeomEstacion)
            await pg.query(pgFormat('insert into temp_paraderos_geom(geom, sentido,id_ruta) values %L', getFeatures(req.body.theGeomEstacion, req.body.sentido, req.body.idRuta)), []);

        const paradero = await pg.query(`
            update
                giz.giz_paradero
            set
                nombre_paradero = $1,
                glosa_paradero = $2,
                the_geom_estacion = (select ST_GeomFromGeoJSON(geom) from temp_paraderos_geom where sentido = $3 and id_ruta=$4),
                inicio_fin= $5,
                sentido=$3,
                orden=$7,
                estado=$8
            where
                id_paradero = $6
            RETURNING *,st_asgeojson(the_geom_estacion)::json the_geom_estacion`,
            [req.body.nombreParadero, req.body.glosaParadero, req.body.sentido, req.body.idRuta, req.body.inicioFin, req.body.idParadero, req.body.orden,req.body.estado]);

        await pg.query(`drop table if exists temp_paraderos_geom`, []);
        return res.status(200).send(camelcaseKeys(
            paradero.map(parada => ({
                ...parada
            }))[0]
            // {message:"ok"}
        ));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Retorna un arreglo con las geometrías del GeoJSON
 * @param {GeoJSON} geoJSON 
 * @param {Text} sentido
 * @param {Text} id_ruta 
 * @returns 
 */
const getFeatures = (geoJSON, sentido, id_ruta) => {
    let geometry = [];

    if (geoJSON) [geoJSON].map((g) => { geometry.push([JSON.stringify(g), sentido, id_ruta]) });
    return geometry;
}

const getFeatures2 = (geoJSON, id_ruta) => {
    let geometry = [];

    if (geoJSON) geoJSON.map((g) => { geometry.push([id_ruta, g.properties.Name, g.properties.Name, g.properties.sentido, g.properties.inicio_fin, JSON.stringify(g.geometry), g.properties.orden]) });
    return geometry;

}