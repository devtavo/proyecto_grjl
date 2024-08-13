const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de parametros
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const parametros = await pg.query(`
        select 
        id_parametro,
        nombre_parametro,
        glosa_parametro,
        valor_parametro::character varying,
        estado_parametro
        from giz.giz_parametros`, []);
        return res.status(200).send(camelcaseKeys(parametros));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Inserta un nuevo parámetro
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {
        if (!(req.body.nombreParametro || req.body.glosaParametro || req.body.valorParametro))
            return res.status(404).send({ message: "Los campos nombre de parámetro, glosa y valor son obligatorios" });

        const parametro = await pg.query(`insert into giz.giz_parametros(nombre_parametro, glosa_parametro, valor_parametro) values ($1, $2, $3) RETURNING *`,
            [req.body.nombreParametro, req.body.glosaParametro, req.body.valorParametro]
        );

        return res.status(201).send(camelcaseKeys(
            parametro
        ));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualiza un nuevo parámetro
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        if (!req.params.parametroId)
            return res.status(404).send({ message: "Debe enviar el id del parámetro a actualizar" });

        if (!(req.body.nombreParametro || req.body.glosaParametro || req.body.valorParametro))
            return res.status(404).send({ message: "Los campos nombre de parámetro, glosa y valor son obligatorios" });

        const parametro = await pg.query(`
        update 
            giz.giz_parametros 
        set 
            nombre_parametro = $1,
            glosa_parametro = $2,
            valor_parametro = $3
        where
            id_parametro = $4
        RETURNING *`,
            [req.body.nombreParametro, req.body.glosaParametro, req.body.valorParametro, req.params.parametroId]
        );

        return res.status(200).send(camelcaseKeys(
            parametro[0]
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * get un parametro
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
 exports.getParametro = async (req, res) => {
    try {
        if (!req.body.glosaParametro)
            return res.status(404).send({ message: "Debe enviar la glosa del parametro" });

        const parametro = await pg.query(`
        select * 
        from 
            giz.giz_parametros
        where glosa_parametro='${req.body.glosaParametro}'
         `,[]
        );

        return res.status(200).send(camelcaseKeys(
            parametro
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}