const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de sanciones administrativas
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const sanciones = await pg.query(`
        select 
        *
        from smlpr.sm_constructora
        where estado='A'
        order by
            id asc`, []);
        return res.status(200).send(camelcaseKeys(sanciones));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}



/**
 * Inserta una constructora
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {

        const constructora = await pg.query(`insert into smlpr.sm_constructora(constructora, ruc_constructora, estado) values ($1, $2, $3) RETURNING *`,
            [ req.body.constructora, req.body.rucConstructora, req.body.estado]
        );

        return res.status(201).send(camelcaseKeys(
            constructora
        ));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}


/**
 * Actualiza una sanción administrativa
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        const constructora = await pg.query(`
        update 
            smlpr.sm_constructora
        set 
            constructora = $1,
            ruc_constructora = $2,
            estado = $3
        where
            id = $4
        RETURNING
            id as id, 
            constructora, 
            ruc_constructora, 
            estado`,
            [req.body.constructora, req.body.rucConstructora, req.body.estado, req.params.id]
        );

        return res.status(200).send(camelcaseKeys(
            constructora[0]
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
