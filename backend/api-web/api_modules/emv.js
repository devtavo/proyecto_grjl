const helper = require("../helper/jwt");
const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de EMV
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const emv = await pg.query(`
        select
            id_emv, 
            razon_social, 
            glosa_empresa, 
            ruc, 
            direccion, 
            id_estado_empresa, 
            to_char(fecha_registro,'dd-mm-yyyy') fecha_registro, 
            fecha_actualizacion, 
            token, 
            ip, 
            login_usuario, 
            correo,
            case 
                when id_estado_empresa ='1' then 'Activo' 
                when id_estado_empresa ='2' then 'Inactivo'
            end estado_emv
        from giz.giz_emv`, []);
        return res.status(200).send(camelcaseKeys(emv));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Inserta una nueva EMV
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {
        if (!(req.body.ruc || req.body.razonSocial || req.body.direccion))
            return res.status(404).send({ message: "Los campos Ruc, razón social y dirección son obligatorios" });

        const hashPassword = helper.hashPassword(req.body.passwordUsuario);
        const emv = await pg.query(`insert into giz.giz_emv(razon_social,glosa_empresa,ruc,direccion,id_estado_empresa,token,ip,login_usuario,password_usuario,correo) values($1,$2,$3,$4,1,$5,$6,$7,$8,$9) RETURNING *`,
            [req.body.razonSocial, req.body.glosaEmpresa, req.body.ruc, req.body.direccion, req.body.token, req.body.ip, req.body.loginUsuario, hashPassword, req.body.correo]
        );

        return res.status(201).send(camelcaseKeys(
            emv
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualiza una EMV
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        if (!req.params.emvId)
            return res.status(404).send({ message: "Debe enviar el id de la EMV a actualizar" });

        if (!(req.body.ruc || req.body.razonSocial || req.body.direccion))
            return res.status(404).send({ message: "Los campos Ruc, razón social y direccion son obligatorios" });

        const hashPassword = req.body.passwordUsuario ? helper.hashPassword(req.body.passwordUsuario) : '';

        const emv = await pg.query(`
            update giz.giz_emv
            set 
                ruc = $1, 
                razon_social = $2, 
                direccion= $3, 
                id_estado_empresa= $4,
                glosa_empresa=$5,
                ip=$6, 
                login_usuario=$7,
                fecha_actualizacion=now(),
                ${req.body.passwordUsuario ? `password_usuario = '${hashPassword}',` : ''}
                correo=$8
            where
                id_emv = $9
            RETURNING *`,
            [req.body.ruc, req.body.razonSocial, req.body.direccion, req.body.idEstadoEmpresa, req.body.glosaEmpresa, req.body.ip, req.body.loginUsuario, req.body.correo, req.params.emvId]
        );

        const { password_usuario, ...emvSinClave } = emv[0];

        return res.status(200).send(camelcaseKeys(emvSinClave));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}