const pg = require('../services/pg');
const pgFormat = require('pg-format');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de registros controlador
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const registros = await pg.query(`
        select 
            row_number() over(order by id desc)idn
            ,*
            from (
                select
                *, id_razon_social as razon_social_empresa , fecha_registro fecha_registro2 from smlpr.sm_registros  order by id desc limit 120
                )x
                `, []);

        return res.status(200).send(camelcaseKeys(registros));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}


/**
 * Inserta una nueva registro
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {
        if (!req.body.placa)
            return res.status(404).send({ message: "Debe enviar la placa" });

        const registro = await pg.query(`
        insert into smlpr.sm_registros(placa,id_razon_social,tipo,autorizado,estado,tipo_color,origen) 
        values(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            'M'
            ) RETURNING *`, [req.body.placa, req.body.razonSocialEmpresa, req.body.tipo, req.body.autorizado, req.body.estado, req.body.tipoColor]);

        return res.status(201).send(camelcaseKeys(
            registro.map(registro => ({
                ...registro
            }))
        ));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualiza una registro
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        const registros = await pg.query(`
            update
                smlpr.sm_registros
            set
                placa = $1,
                autorizado = $2,
                estado = $3,
                tipo = $4,
                tipo_color= $5,
                calidad = $6,
                id_razon_social = $8
            where
                id = $7
            RETURNING * `, [req.body.placa, req.body.autorizado, req.body.estado, req.body.tipo, req.body.tipoColor,req.body.calidad,req.params.registroId,req.body.idRazonSocial]);

        return res.status(200).send(camelcaseKeys(
            registros.map(registro => ({
                ...registro
            }))[0]
        ));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

