const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de reportes
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const reportes = await pg.query(`
        select
            id,
            case
                when id = 1 then 'Reporte General'
                when id = 2 then 'Constancia de Reaprovechamiento'
                when id = 3 then 'Reporte por rango Fecha'
                when id = 4 then 'Reporte de viajes por Empresa'
            end as name
        from generate_series(1, 4) as id`, []);
        return res.status(200).send(camelcaseKeys(reportes));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}