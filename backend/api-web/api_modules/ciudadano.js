const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna datos de validacion
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getHashValido = async (req, res) => {
    try {
        const track = await pg.query(`
        select 
            *,
            hash_track::json as t
        from giz.giz_share
        where code_hash=$1`, [req.body.code]);


        return res.status(200).send(camelcaseKeys(track));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
