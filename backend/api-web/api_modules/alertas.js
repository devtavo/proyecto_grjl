const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de alertas
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const alertas = await pg.query(`
        select
           row_number() over(order by id_alertas) id,
           id_alertas as id_alerta,
           nombre_alerta,
           titulo_alerta,
           descripcion_alerta,
           glosa_alerta,
           accion_alerta
        from giz.giz_alertas`, []);
        return res.status(200).send(camelcaseKeys(alertas));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Detalle de una alerta
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.get = async (req, res) => {
    try {
        if (!req.params.alertaId)
            return res.status(404).send({ message: "Debe enviar el id de la alerta" });

        const alertaId = parseInt(req.params.alertaId);
        const fechaInicio = req.body.fechaInicio || '';
        const fechaFin = req.body.fechaFin || '';
        const geom = JSON.stringify(req.body.geom);
        const idRuta = parseInt(req.body.idRuta);
        let alerta = [];

        //Alertas de congestión del servicio por tramo, por geo cerca, por distrito	
        if (alertaId === 1)
            alerta = await pg.query(`select geojson from giz.fs_alerta1($1, $2, $3, $4)`, [geom, fechaInicio, fechaFin, idRuta]);

        //Alertas de exceso de velocidad por tramo, por geo cerca, por distrito
        if (alertaId === 2)
            alerta = await pg.query(`select geojson from giz.fs_alerta2($1, $2, $3, $4)`, [geom, fechaInicio, fechaFin, idRuta]);

        //Alertas de vehículos en movimiento con puertas abiertas
        if (alertaId === 3)
            alerta = await pg.query(`select geojson from giz.fs_alerta3($1, $2, $3, $4 )`, [geom, fechaInicio, fechaFin,idRuta]);

        //Alerta de vehículos fuera de ruta.
        if (alertaId === 4)
            alerta = await pg.query(`select geojson from giz.fs_alerta4($1, $2, $3, $4)`, [geom, fechaInicio, fechaFin, idRuta]);

        //Alerta de unidades en zonas rígidas, paraderos no autorizados	
        if (alertaId === 5)
            alerta = await pg.query(`select geojson from giz.fs_alerta5($1, $2, $3,$4)`, [geom, fechaInicio, fechaFin,idRuta]);

        //Alerta de tiempo de exceso de detención de un vehículo en un paradero
        if (alertaId === 6)
            alerta = await pg.query(`select geojson from giz.fs_alerta6($1, $2, $3 ,$4)`, [geom, fechaInicio, fechaFin, idRuta]);

        //Alerta de sanciones administrativas
        if (alertaId === 7)
            alerta = await pg.query(`
            select 
                id_sancion_administrativa as id_sancion, 
                to_char(fecha_documento, 'dd/mm/yyyy') as fecha_documento, 
                descripcion_sancion, 
                importe, 
                placa 
            from giz.giz_sancion_administrativa
            where
            to_date(to_char(fecha_documento,'dd-mm-yyyy'),'dd-mm-yyyy') >= to_date(to_char(now(),'dd-mm-yyyy'),'dd-mm-yyyy')
            order by
                id_sancion_administrativa`, []);

        //Alertas de vencimiento de licencias de conducir
        if (alertaId === 8)
            alerta = await pg.query(`
            select 
                c.id_conductor, 
                c.numero_licencia, 
                p.apellido_paterno, 
                p.apellido_materno, 
                p.nombres_completos, 
                c.clase, 
                c.categoria, 
                to_char(c.fecha_expedicion, 'dd/mm/yyyy') as fecha_expedicion, 
                to_char(c.fecha_revalidacion, 'dd/mm/yyyy') as fecha_revalidacion 
            from giz.giz_conductor c 
            inner join giz.giz_persona p on p.id_persona = c.id_persona
            where
                c.fecha_revalidacion < now()::date
            order by
                c.id_conductor`, []);

        //Alertas de vehículos no detenidos en paraderos autorizados
        if (alertaId === 9)
            alerta = await pg.query(`select geojson from giz.fs_alerta9($1, $2, $3 ,$4)`, [geom, fechaInicio, fechaFin,idRuta]);

        //Alertas de vehículos que pierden transmisión según rango de tiempo asignado	
        if (alertaId === 10)
            alerta = await pg.query(`select geojson from giz.fs_alerta10($1, $2, $3,$4)`, [geom, fechaInicio, fechaFin, idRuta]);

        //Alertas de vencimiento de SOAT
        if (alertaId === 11)
            alerta = await pg.query(`
            select 
                e.razon_social_empresa razon_social,
                e.ruc_ett ruc ,
                v.placa_vehiculo,
                v.afabricacion_vehiculo,
                v.codigo_soat,
                to_char(v.vencimiento_soat, 'dd/mm/yyyy') as vencimiento_soat,
                v.estado
            from(
                (select gv.*, gf.id_ett ,1 as codigo_estado, 'Vencido' as estado from giz.giz_vehiculo gv inner join giz.giz_flotavehiculos gf  on gv.placa_vehiculo_referencia=gf.placa_vehiculo_referencia	 where vencimiento_soat::date < now()::date limit 100)
                union all
                (select gv.*, gf.id_ett,2 as codigo_estado, 'Vence en 30 días as estado' from giz.giz_vehiculo gv inner join giz.giz_flotavehiculos gf on gv.placa_vehiculo_referencia=gf.placa_vehiculo_referencia where vencimiento_soat::date >= now()::date + 30 limit 100)
            ) v
            inner join giz.giz_ett e on e.id_ett = v.id_ett
            order by 1,v.vencimiento_soat`, []);

        //Alerta de botón de pánico de la unidad de transporte
        if (alertaId === 12)
            alerta = await pg.query(`select geojson from giz.fs_alerta12($1, $2, $3, $4)`, [geom, fechaInicio, fechaFin, idRuta]);

        //Alerta de apagado de motor de la unidad, dentro de la ruta establecida
        if (alertaId === 13)
            alerta = await pg.query(`select geojson from giz.fs_alerta13($1, $2, $3 , $4)`, [geom, fechaInicio, fechaFin, idRuta]);

        //Alerta de ingreso a la ruta de la unidad de transporte	
        if (alertaId === 14)
            alerta = await pg.query(`select geojson from giz.fs_alerta14($1, $2, $3, $4)`, [geom, fechaInicio, fechaFin, idRuta]);

        //Alerta de encendido de motor de la unidad, dentro de la ruta establecida
        if (alertaId === 15)
            alerta = await pg.query(`select geojson from giz.fs_alerta15($1, $2, $3 , $4)`, [geom, fechaInicio, fechaFin, idRuta]);

        return res.status(200).send(camelcaseKeys(alerta));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Inserta una nueva alerta
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {
        if (!(req.body.nombreAlerta || req.body.tituloAlerta || req.body.descripcionAlerta || req.body.glosaAlerta || req.body.accionAlerta))
            return res.status(404).send({ message: "Los campos Nombre, Titulo, Descripción, Glosa y Acción son obligatorios" });

        const alerta = await pg.query(`insert into giz.giz_alertas(nombre_alerta, titulo_alerta, descripcion_alerta, glosa_alerta, accion_alerta) values ($1, $2, $3, $4, $5) RETURNING *`,
            [req.body.nombreAlerta, req.body.tituloAlerta, req.body.descripcionAlerta, req.body.glosaAlerta, req.body.accionAlerta]
        );

        return res.status(201).send(camelcaseKeys(
            alerta
        ));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualizar una alerta
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        if (!req.params.alertaId)
            return res.status(404).send({ message: "Debe enviar el id de la alerta a actualizar" });

        if (!(req.body.nombreAlerta || req.body.tituloAlerta || req.body.descripcionAlerta || req.body.glosaAlerta || req.body.accionAlerta))
            return res.status(404).send({ message: "Los campos Nombre, Titulo, Descripcion, Glosa y Accion  son obligatorios" });

        const alerta = await pg.query(`
        update 
            giz.giz_alertas
        set 
            nombre_alerta = $1,
            titulo_alerta = $2,
            descripcion_alerta = $3,
            glosa_alerta = $4,
            accion_alerta = $5
        where
            id_alertas = $6
        RETURNING *`,
            [req.body.nombreAlerta, req.body.tituloAlerta, req.body.descripcionAlerta, req.body.glosaAlerta, req.body.accionAlerta, req.params.alertaId]
        );

        return res.status(200).send(camelcaseKeys(
            alerta[0]
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}