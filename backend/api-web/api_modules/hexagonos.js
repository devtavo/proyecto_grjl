//const { pool } = require('../services/pg');
const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');
const QueryStream = require('pg-query-stream');
const JSONStream = require('JSONStream');

/**
 * Retorna listado de hexagonos
 * @param {Object} req
 * @param {Object} res
 * @returns
 */
exports.getAll = async (req, res) => {
    //try {
    const hexagonos = await pg.query(`
        select 
            gid as id, 
            ST_AsGeoJSON(geom)::json as geom 
        from giz_test.hex_arequipa
        where 
            quintil > 0 
        order by 
            gid`, []);
    return res.status(200).send(camelcaseKeys(hexagonos));
    /*} catch (error) {
        return res.status(500).send({ message: error });
    }*/

    /*try {
        const client = await pool.connect();
        const query = new QueryStream('select gid as id, ST_AsGeoJSON(geom)::json as geom from giz_test.hex_arequipa order by gid', []);
        //const query = new QueryStream('select * from generate_series(1, 10000000)', []);
        const stream = client.query(query);
        stream.on('end', () => client.release());
        stream.pipe(JSONStream.stringify(false)).pipe(res);
    } catch (error) {
        console.error(error);
    }*/
}