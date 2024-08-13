const helper = require("../helper/jwt");
const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Login
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.login = async (req, res) => {
    if (!req.body.usuario || !req.body.contrasena) {
        return res.status(400).send({ message: 'Debe enviar el usuario y contraseña' });
    }

    try {
        const user = await pg.query(`      
        select 
            gp.id_persona,
            gp.nombre ||' '|| gp.apellido_paterno nombre,
            us.login_usuario,
            us.password_usuario,
            gur.id_rol 
            ,3::integer id_ett 
        from smlpr.sm_usuario us 
            inner join smlpr.sm_persona gp on gp.id_persona = us.id_persona inner join smlpr.sm_usuario_rol gur on us.login_usuario=gur.login_usuario
        where 
            us.login_usuario=  $1`, [req.body.usuario]);

        if (!user[0])
            return res.status(400).send({ message: 'Credenciales de acceso incorrectas' });

        if (!helper.comparePassword(user[0].password_usuario, req.body.contrasena))
            return res.status(400).send({ 'message': 'Credenciales de acceso incorrectas' });

        const token = helper.generateToken(user[0].id_persona);
        return res.status(200).send({ token, usuario: user[0].nombre, idRol: user[0].id_rol, idEtt: user[0].id_ett == null ? 0 : user[0].id_ett });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Retorna la lista de Usuarios
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const usuario = await pg.query(`
        select
            ps.id_persona,
            gu.login_usuario,
            nombre ,
            apellido_paterno ,
            ultimo_acceso,
            nro_doc_identidad,
            tipo_doc_identidad,
            fecha_registro,
            correo,
            gu.id_estadousuario,
            case 
                when gu.id_estadousuario ='1' then 'Activo' 
                when gu.id_estadousuario ='2' then 'Inactivo'
            end estado_usuario,
            gur.id_rol,
            gr.nombre_rol
        from smlpr.sm_persona ps 
        inner join smlpr.sm_usuario gu on ps.id_persona = gu.id_persona 
        inner join smlpr.sm_usuario_rol gur on gur.login_usuario=gu.login_usuario 
        inner join smlpr.sm_rol gr on gr.id_rol=gur.id_rol
        `, []);
        return res.status(200).send(camelcaseKeys(usuario));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
/**
 * Retorna la lista de roles de usuario
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getRoles = async (req, res) => {
    try {
        const roles = await pg.query(`
        select
        * 
        from smlpr.sm_rol`, []);
        return res.status(200).send(camelcaseKeys(roles));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Inserta una nueva usuario
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */

exports.post = async (req, res) => {
    try {
        if (!(req.body.nombre || req.body.apellidoPaterno || req.body.nroDocIdentidad))
            return res.status(404).send({ message: "Los campos nombre, apellido y nroDocIdentidad  son obligatorios" });

        const persona = await pg.query(`insert into smlpr.sm_persona(nombre, apellido_paterno,nombres_completos,nro_doc_identidad,tipo_doc_identidad,fecha_registro,correo) values ($1, $2, $3, $4, 'DNI', now(), $5) RETURNING *`,
            [req.body.nombre, req.body.apellidoPaterno, req.body.nombre || ' ' || req.body.apellidoPaterno, req.body.nroDocIdentidad, req.body.correo]
        );

        const hash = helper.hashPassword(req.body.passwordUsuario);
        const usuario = await pg.query(`insert into smlpr.sm_usuario(login_usuario, password_usuario, id_estadousuario,id_persona) values ($1,$2,1,$3) RETURNING *, case 
                when id_estadousuario ='1' then 'Activo' 
                when id_estadousuario ='2' then 'Inactivo'
            end estado_usuario`,
            [req.body.loginUsuario, hash, persona[0].id_persona]
        );

        const usuarioRol = await pg.query(`insert into smlpr.sm_usuario_rol(login_usuario, id_rol) values ($1,$2) RETURNING *`,
            [req.body.loginUsuario, req.body.idRol]
        );

        const concatPersona = { ...persona[0], ...usuario[0], ...usuarioRol };
        return res.status(201).send(camelcaseKeys(
            [concatPersona]
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualiza una persona y usuario
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        if (!req.params.personaId)
            return res.status(404).send({ message: "Debe enviar el id del usuario a actualizar" });

        if (!(req.body.loginUsuario || req.body.nombre || req.body.apellidoPaterno))
            return res.status(404).send({ message: "Los campos nombre de usuario, nombre y apellidos son  son obligatorios" });

        const persona = await pg.query(`
            update 
                smlpr.sm_persona
            set 
                nombre = $1, 
                apellido_paterno = $2, 
                correo = $4, 
                nro_doc_identidad = $5, 
                fecha_actualizacion = now()
            where
                id_persona = $3
            RETURNING *`,
            [req.body.nombre, req.body.apellidoPaterno, req.params.personaId, req.body.correo, req.body.nroDocIdentidad]
        );

        const hashPassword = req.body.passwordUsuario ? helper.hashPassword(req.body.passwordUsuario) : '';
        const usuario = await pg.query(`
            update 
                smlpr.sm_usuario
            set 
                id_estadousuario = $1                
                ${req.body.passwordUsuario ? `, password_usuario = '${hashPassword}'` : ''}
            where
                id_persona = $2
            RETURNING *, case 
            when id_estadousuario ='1' then 'Activo' 
            when id_estadousuario ='2' then 'Inactivo'
        end estado_usuario `,
            [req.body.idEstadousuario, req.params.personaId]
        );

        const usuarioRol = await pg.query(`
            update 
                smlpr.sm_usuario_rol
            set 
                id_rol = $1                
            where
                login_usuario = $2
            RETURNING *`,
            [req.body.idRol, req.body.loginUsuario]
        );

        const { password_usuario, ...usuarioSinClave } = usuario[0];
        // const { usuarioRoles } = usuarioRol[0];
        const personaUsuario = { ...persona[0], ...usuarioSinClave, ...usuarioRol[0] };

        return res.status(200).send(camelcaseKeys(
            personaUsuario
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

