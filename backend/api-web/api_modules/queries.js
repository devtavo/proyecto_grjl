const pg = require('../services/pg');

/**
 * Get list of inquiries
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const queries = await pg.query(`
        select
            id,
            case
                when id = 1 then 'Consolidado de kms recorrido por vehículo, flota y empresa'
                else 'Cantidad de vehículos autorizados / Cantidad de vehículos en servicio'
            end as name
        from generate_series(1, 2) as id`, []);
        return res.status(200).send(queries);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

exports.get = async (req, res) => {

    switch (parseInt(req.params.id)) {
        case 1:
            const queries = await pg.query(`
                            select 
                                        id_ett,
                                        count(id_ruta)id_ruta,
                                        sum(placa_vehiculo)placa_vehiculo,
                                        sum(s_12)s_12,
                                        sum(v_in_12)v_in_12,
                                        sum(v_c_12)v_c_12,
                                        sum(s_21)s_21,
                                        sum(v_in_21)v_in_21,
                                        sum(v_c_21)v_c_21,
                                        round(sum(v_c_12)/sum(s_12),3)p_c12,
                                        round(sum(v_c_21)/sum(s_21),3)p_c21
                            from (
                                select id_ett,
                                        id_ruta,
                                        sum(placa_vehiculo)placa_vehiculo,
                                        sum(s_12)s_12,
                                        sum(v_in_12)v_in_12,
                                        sum(v_c_12)v_c_12,
                                        sum(s_21)s_21,
                                        sum(v_in_21)v_in_21,
                                        sum(v_c_21)v_c_21,
                                        round(sum(v_c_12)/sum(s_12),3)p_c12,
                                        round(sum(v_c_21)/sum(s_21),3)p_c21
                                        from (
                                    select id_ett,
                                            id_ruta,
                                            count(placa_vehiculo)placa_vehiculo,
                                            sum(salida_1_2)s_12,
                                            sum(viajes_incompletos_1_2)v_in_12,
                                            sum(salida_1_2)-sum(viajes_incompletos_1_2) v_c_12,
                                            sum(salida_2_1)s_21,
                                            sum(viajes_incompletos_2_1)v_in_21,
                                            sum(salida_2_1)-sum(viajes_incompletos_2_1)v_c_21
                                            from giz_resumen.giz_reporte01 
                                            group by id_ett,
                                            placa_vehiculo,
                                            id_ruta, 
                                            salida_1_2,
                                        viajes_incompletos_1_2
                                            order by 1
                                )c group by id_ett,id_ruta
                                order by 1,2
                            )d group by id_ett
 
                        `);
            data = { data: queries };
            break;
        case 2:
            data = { data: "bbbbb" };
            break;
        default:
            data = { data: req.params.id };
    }
    res.status(200).json(data);
}