const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de conductores
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const idEtt = req.query.idEtt === 'undefined' ? 0 : parseInt(req.query.idEtt);
        const conductores = await pg.query(`
        select 
            c.id_conductor, 
            c.numero_licencia, 
            p.apellido_paterno, 
            p.apellido_materno, 
            p.nombres_completos, 
            c.clase, 
            c.categoria, 
            to_char(c.fecha_expedicion, 'dd/mm/yyyy') as fecha_expedicion, 
            to_char(c.fecha_revalidacion, 'dd/mm/yyyy') as fecha_revalidacion,
            c.id_ett 
        from giz.giz_conductor c 
        inner join giz.giz_persona p on p.id_persona = c.id_persona
        where
        1=1
        ${idEtt == 0 ? `and 1 = 1` : idEtt == 0 ? `and 1 =1` : `and c.id_ett=${idEtt}`}
        order by
            c.id_conductor`,[]);
        return res.status(200).send(camelcaseKeys(conductores));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Inserta un nuevo conductor
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {
        const body = req.body;

        if (!(body.numeroLicencia, body.apellidoPaterno, body.apellidoMaterno, body.nombresCompletos, body.clase, body.categoria, body.fechaExpedicion, body.fechaRevalidacion))
            return res.status(404).send({ message: "Debe enviar todos los atributos del conductor para proceder con el registro." });

        const persona = await pg.query(`insert into giz.giz_persona(nombre, apellido_paterno, apellido_materno, nombres_completos, nro_doc_identidad) values ($1, $2, $3, $4, $5) 
        RETURNING id_persona, apellido_paterno, apellido_materno, nombres_completos`,
            [body.nombresCompletos, body.apellidoPaterno, body.apellidoMaterno, body.nombresCompletos, '00000000']
        );

        if (!persona[0])
            return res.status(404).send({ message: "Ocurrió un error registrando persona." });

        const idPersona = persona[0].id_persona;

        const conductor = await pg.query(`insert into giz.giz_conductor(id_persona, numero_licencia, clase, categoria, fecha_expedicion, fecha_revalidacion) values ($1, $2, $3, $4, to_date($5,'dd-mm-yyyy'), to_date($6,'dd-mm-yyyy')) 
        RETURNING id_conductor, numero_licencia, clase, categoria, to_char(fecha_expedicion, 'dd/mm/yyyy') as fecha_expedicion, to_char(fecha_revalidacion, 'dd/mm/yyyy') as fecha_revalidacion`,
            [idPersona, body.numeroLicencia, body.clase, body.categoria, body.fechaExpedicion, body.fechaRevalidacion]
        );

        return res.status(201).send(camelcaseKeys(
            [{ ...persona[0], ...conductor[0] }]
        ));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**un conductor una sanción administrativa
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        const body = req.body;

        if (!req.params.conductorId)
            return res.status(404).send({ message: "Debe enviar el id del conductor a actualizar" });

        if (!(body.numeroLicencia, body.apellidoPaterno, body.apellidoMaterno, body.nombresCompletos, body.clase, body.categoria, body.fechaExpedicion, body.fechaRevalidacion))
            return res.status(404).send({ message: "Debe enviar todos los atributos del conductor para proceder con el registro." });

        const persona = await pg.query(`
        update 
            giz.giz_persona
        set
            apellido_paterno = $1, 
            apellido_materno = $2, 
            nombres_completos = $3
        where
        id_persona = $4
        RETURNING id_persona, apellido_paterno, apellido_materno, nombres_completos`,
            [body.apellidoPaterno, body.apellidoMaterno, body.nombresCompletos, req.params.conductorId]
        );

        const conductor = await pg.query(`
        update 
            giz.giz_conductor
        set
            numero_licencia = $1, 
            clase = $2, 
            categoria = $3, 
            fecha_expedicion = to_date('${body.fechaExpedicion}', 'dd/mm/yyyy'), 
            fecha_revalidacion = to_date('${body.fechaRevalidacion}', 'dd/mm/yyyy')
        where
        id_conductor = $4
        RETURNING id_conductor, numero_licencia, clase, categoria, to_char(fecha_expedicion, 'dd/mm/yyyy') as fecha_expedicion, to_char(fecha_revalidacion, 'dd/mm/yyyy') as fecha_revalidacion`,
            [body.numeroLicencia, body.clase, body.categoria, req.params.conductorId]
        );

        return res.status(200).send(camelcaseKeys(
            { ...persona[0], ...conductor[0] }
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}