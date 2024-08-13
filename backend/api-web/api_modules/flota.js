const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista Flota de vehiculos de una empresa
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        if (!req.params.flotaId)
            return res.status(404).send({ message: "Debe enviar el id de la Flota de transporte." });

        const flota = await pg.query(`
                            select 
                            row_number() over (order by sv.placa_vehiculo asc) id,
                            se.id id_ett,
                            se.razon_social_empresa,
                            sv.placa_vehiculo,
                            sv.id_estado_vehiculo,
                            case when sv.id_estado_vehiculo ='1' then 'Activo' 
                                when sv.id_estado_vehiculo ='2' then 'Inactivo'
                            end estado_vehiculo,
                            sv.id_tipo_vehiculo,
                            sv.codigo_soat,
                            sv.vencimiento_soat,
                            sv.fecha_registro_vehiculo
                    from  smlpr.sm_vehiculo sv
                    inner join smlpr.sm_empresas se
                            on sv.id_ett = se.id
            where se.id = $1`, [req.params.flotaId]);
        return res.status(200).send(camelcaseKeys(flota));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Lista los vehiculos de una ruta para validacion
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getVehiculosValidacion = async (req, res) => {
    try {
        if (!(req.body.idRuta))
            return res.status(404).send({ message: "El campo Id_ruta es obligatorios" });

        const flotaVehiculos = await pg.query(`
        select 
        * 
        from giz.giz_flotavehiculos  fv inner join giz.giz_vehiculo gv on fv.placa_vehiculo= gv.placa_vehiculo where id_ruta=$1 and gv.id_estado_vehiculo='1'
        `,
            [req.body.idRuta]);

        return res.status(201).send(camelcaseKeys(
            flotaVehiculos
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Inserta un nuevo Vehiculo a una flota
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {
        const exist = await pg.query(`select * from smlpr.sm_vehiculo where placa_vehiculo=$1 and id_ett=$2`,[req.body.placaVehiculo,req.params.flotaId]);
        console.log(exist.length);
        if (exist.length== 0) {

            const vehiculo = await pg.query(`insert into smlpr.sm_vehiculo(placa_vehiculo,codigo_soat,vencimiento_soat,id_estado_vehiculo,fecha_registro_vehiculo,id_ett) values($1,$2,$3,$4,now(),$5) RETURNING *,case when id_estado_vehiculo ='1' then 'Activo' 
            when id_estado_vehiculo ='2' then 'Inactivo'
             end estado_vehiculo`,[req.body.placaVehiculo, req.body.codigoSoat, req.body.vencimientoSoat, req.body.idEstadoVehiculo, req.params.flotaId]);

            const empresa = await pg.query(`select razon_social_empresa from smlpr.sm_empresas where id=$1`, [req.params.flotaId])
            console.log(empresa);
            return res.status(201).send(camelcaseKeys(
                [{ ...vehiculo[0], ...empresa[0] }]
            ));
        }else{
            return res.status(200).send(camelcaseKeys({mgs: "ok"}))
        }

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}


/**
 * Actualiza la ruta asignada a la flota
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.putRuta = async (req, res) => {
    try {
        if (!(req.params.flotaId || req.params.placaId))
            return res.status(404).send({ message: "Los campos Flota y placa Vehiculo son obligatorios" });

        const flotaVehiculo = await pg.query(`
        update 
            giz.giz_flotavehiculos
        set 
            id_ruta = $1 
        where
            id_ett= $2 and
            placa_vehiculo = $3 and 
            id_flota_vehiculos= $4`,
            [req.body.idRuta, req.params.flotaId, req.params.placaId, req.body.idFlotaVehiculos]);

        return res.status(200).send(camelcaseKeys(
            flotaVehiculo
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualiza un Vehiculo de una flota
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {
        if (!req.params.placaId)
            return res.status(404).send({ message: "Debe enviar la Placa del Vehiculo a actualizar" });

        if (!(req.params.placaId || req.body.codigoSoat || req.body.afabricacionVehiculo || req.body.vencimientoSoat))
            return res.status(404).send({ message: "Los campos Placa, Código SOAT, año de Fab, Fecha de vencimiento SOAT son obligatorios" });

        const flotaVehiculo = await pg.query(`
            update 
                giz.giz_vehiculo
            set 
                afabricacion_vehiculo = $1, 
                id_estado_vehiculo = $2, 
                codigo_soat = $3, 
                vencimiento_soat = $4,
                id_tipo_vehiculo = $5,
                n_asientos=$7,
                n_pasajeros=$8
            where
                placa_vehiculo = $6
            RETURNING 
                *, 
                case when id_estado_vehiculo ='1' then 'Activo' 
                     when id_estado_vehiculo ='2' then 'Inactivo' 
                end estado_vehiculo`,
            [req.body.afabricacionVehiculo, req.body.idEstadoVehiculo, req.body.codigoSoat, req.body.vencimientoSoat, req.body.idTipoVehiculo, req.params.placaId, req.body.asientos, req.body.pasajeros]
        );

        return res.status(200).send(camelcaseKeys(
            flotaVehiculo[0]
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
