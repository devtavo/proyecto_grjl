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
        from smlpr.sm_obras
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

        const obras = await pg.query(`insert into smlpr.sm_obras(nombre, distrito, estado,direccion) values ($1, $2, $3, $4) RETURNING *`,
            [ req.body.nombre,req.body.distrito, req.body.estado, req.body.direccion]
        );

        return res.status(201).send(camelcaseKeys(
            obras
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
        const obras = await pg.query(`
        update 
            smlpr.sm_obras
        set 
            nombre = $1,
            distrito = $2,
            estado = $3,
            direccion = $4
        where
            id = $5
        RETURNING
            id as id, 
            nombre, 
            distrito, 
            estado,
            direccion`,
            [req.body.nombre, req.body.distrito, req.body.estado, req.body.direccion, req.params.id]
        );

        return res.status(200).send(camelcaseKeys(
            obras[0]
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
