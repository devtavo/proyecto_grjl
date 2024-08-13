const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de subsidio
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const subsidio = await pg.query(`
            select 
            *
            from giz.giz_tipo_vehiculo
            `, []);
        return res.status(200).send(camelcaseKeys(subsidio));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

