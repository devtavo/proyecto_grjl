const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna el reporte solicitado 
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    if (!req.params.reporteId)
        return res.status(404).send({
            message: "Debe enviar el parámetro reporteId"
        });

    if (!req.params.empresaId)
        return res.status(404).send({
            message: "Debe enviar el parámetro empresaId"
        });

    const reporteId = parseInt(req.params.reporteId);

    if (reporteId === 1) return reporte1(req, res);
    if (reporteId === 2) return reporte2(req, res);
    if (reporteId === 3) return reporte3(req, res);
    if (reporteId === 4) return reporte4(req, res);
    if (reporteId === 5) return reporte5(req, res);
    if (reporteId === 6) return reporte6(req, res);
    if (reporteId === 7) return reporte7(req, res);
    if (reporteId === 8) return reporte8(req, res);
    if (reporteId === 9) return reporte9(req, res);
    if (reporteId === 10) return reporte10(req, res);
    if (reporteId === 11) return reporte11(req, res);
    if (reporteId === 12) return reporte12(req, res);
    if (reporteId === 13) return reporte13(req, res);
}

const reporte1 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        id,
        id+47 id_ruta ,
        (select codigo_ruta from giz.giz_ruta where id_ruta=id+47)as codigo_ruta,
        floor(random() * 30 + 1)::int as buses,           
        floor(random() * 15 + 1)::int as salidas_1_2,          
        floor(random() * 10 + 1)::int as viajes_incompletos_1_2,          
        floor(random() * 25 + 1)::int as viajes_completos_1_2,          
        floor(random() * 15 + 1)::int as salidas_2_1,          
        floor(random() * 10 + 1)::int as viajes_incompletos_2_1,          
        floor(random() * 25 + 1)::int as viajes_completos_2_1,          
        floor(random() * 100 + 1)::int || '%' as porc_viajes_completos_1_2 ,          
        floor(random() * 100 + 1)::int || '%' as porc_viajes_completos_2_1
        from generate_series(1, 10) as id`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then '% de Viajes completos en Sentido 1-2 en todas las Rutas de la EETT:'
                when id = 2 then '% de Viajes completos en Sentido 2-1 en todas las Rutas de la EETT:'
                when id = 3 then '% de Viajes completos en ambos Sentidos en todas las Rutas de la EETT:'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 3) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen)
        });
    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}

const reporte2 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select
        h.id,
        gr.codigo_ruta,
        h.buses_autorizados,
        h.buses_en_serv_12,
        h.buses_en_serv_21,
        h.porc_transmision_1_2,
        h.porc_transmision_2_1 
        from(
        select 
            row_number() over(order by t.id_ruta) id,
            t.id_ruta ruta,
            coalesce( (select count(*) from giz.giz_flotavehiculos gf where gf.id_ruta= t.id_ruta group by gf.id_ruta),0) buses_autorizados,
            t.vehiculo12 buses_en_serv_12,
            u.vehiculo21 buses_en_serv_21,
            round(avg(t.promedio::numeric),2) || '%' porc_transmision_1_2,
            round(avg(u.promedio::numeric),2) || '%' porc_transmision_2_1
            from
            (
                select 
                y.id_ruta,
                y.vehiculo12,
                round(avg(y.factor),2) promedio
                from(
                    select
                    x.id_ruta, 	
                    x.placa_vehiculo,
                    (select  count(*) from(
                        select distinct(g.placa_vehiculo) from
                        (select
                        id_ett,
                        id_ruta, 
                        placa_vehiculo,
                        hora,
                        cantidad
                        from giz_resumen.giz_reporte03 
                        where sentido='1-2' and id_ett='${req.params.empresaId}' and id_ruta=x.id_ruta and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}' 

                        group by 
                        id_ett,
                        id_ruta, 
                        hora,
                        placa_vehiculo,
                        cantidad
                        order by  
                        placa_vehiculo,
                        hora
                        )g
                        )v
                    )vehiculo12,
                    hora,
                    round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 factor
                    from(
                        select
                        id_ett,
                        id_ruta, 
                        placa_vehiculo,
                        hora,
                        cantidad
                        from giz_resumen.giz_reporte03 
                        where sentido='1-2' and id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                        group by 
                        id_ett,
                        id_ruta, 
                        hora,
                        placa_vehiculo,
                        cantidad
                        order by  
                        placa_vehiculo,
                        hora
                    )x	
                    group by
                    x.id_ruta, 	
                    x.placa_vehiculo, 
                    x.hora
                    order by 
                    x.placa_vehiculo, 
                    x.id_ruta, 	
                    round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 desc,
                    x.placa_vehiculo,
                    x.hora
                )y
                group by 
                y.id_ruta,
                y.vehiculo12
            )t inner join
            (
                select 
                y.id_ruta,
                y.vehiculo21,
                round(avg(y.factor),2) promedio
                from(
                    select
                    x.id_ruta, 	
                    x.placa_vehiculo,
                    (select  count(*) from(
                        select distinct(g.placa_vehiculo) from
                        (select
                        id_ett,
                        id_ruta, 
                        placa_vehiculo,
                        hora,
                        cantidad
                        from giz_resumen.giz_reporte03 
                        where sentido='2-1' and id_ett='${req.params.empresaId}' and id_ruta=x.id_ruta and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'

                        group by 
                        id_ett,
                        id_ruta, 
                        hora,
                        placa_vehiculo,
                        cantidad
                        order by  
                        placa_vehiculo,
                        hora
                        )g
                        )v
                    )vehiculo21,
                    hora,
                    round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 factor
                    from(
                        select
                        id_ett,
                        id_ruta, 
                        placa_vehiculo,
                        hora,
                        cantidad
                        from giz_resumen.giz_reporte03 
                        where sentido='2-1' and id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}' 
                        group by 
                        id_ett,
                        id_ruta, 
                        hora,
                        placa_vehiculo,
                        cantidad
                        order by  
                        placa_vehiculo,
                        hora
                    )x	
                    group by
                    x.id_ruta, 	
                    x.placa_vehiculo, 
                    x.hora
                    order by 
                    x.placa_vehiculo, 
                    x.id_ruta, 	
                    round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 desc,
                    x.placa_vehiculo,
                    x.hora
                )y
                group by 
                y.id_ruta,
                y.vehiculo21
            )u on t.id_ruta=u.id_ruta
            group by
            t.id_ruta,
            t.vehiculo12,
            u.vehiculo21
            )h inner join giz.giz_ruta gr on h.ruta=gr.id_ruta`, []);
        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then '% de Transmisión del GPS por minuto Sentido 1-2 en todas las Rutas de la EETT:'
                when id = 2 then '% de Transmisión del GPS por minuto Sentido 2-1 en todas las Rutas de la EETT:'
                when id = 3 then '% de Transmisión del GPS por minuto en ambos Sentidos en todas las Rutas de la EETT:'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 3) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen)
        });
    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}

const reporte3 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        f.id_ruta id_ruta,
        f.codigo_ruta codigo_ruta,
        round(sum(longitud),2) longitud,
        round(sum(n_paradas_ruta),2) n_paradas_ruta,
        round(sum(n_viajes_completo),2) n_viajes_completo,
        round(avg(v_media_ruta_12),2) v_media_ruta_12,
        round(avg(v_media_ruta_21),2) v_media_ruta_21
        from (
            select 
                y.id,
                y.id_ett,
                gr.id_ruta,
                gr.codigo_ruta,
                sum(y.longitud_ruta) longitud,
                sum(y.c_paraderos) n_paradas_ruta,
                sum(y.viajes_completos) n_viajes_completo,
                avg(y.porc_transmision_1_2) v_media_ruta_12,
                avg(y.porc_transmision_2_1) v_media_ruta_21
                from (
                    select 
                    gc.id_ett id_ett,
                    e.* 
                    from (select 
                        row_number() over(order by t.id_ruta) id,
                        --t.id_ett empresa,
                        t.id_ruta rutas,
                        coalesce( (select round((ST_Length(geom12::geography,true)/1000)::decimal,2)+round((ST_Length(geom21::geography,true)/1000)::decimal,2) c_km from giz.giz_ruta gr where gr.id_ruta=t.id_ruta and geom12 is not null and geom21 is not null),0) longitud_ruta,
                        coalesce((select count(*) from giz.giz_paradero where id_ruta=t.id_ruta),0) c_paraderos,
                        0 viajes_completos,
                        round(avg(t.promedio::numeric),2) porc_transmision_1_2,
                        round(avg(u.promedio::numeric),2) porc_transmision_2_1		    
                        from
                        (
                        select
                            x.id_ett,
                            x.id_ruta, 	
                            hora,
                            round(avg(x.cantidad),2) promedio,
                            '1-2'::text sentido
                        from(
                            select
                            id_ett,
                            id_ruta, 
                            hora,
                            cantidad
                            from giz_resumen.giz_reporte04 
                            where sentido='1-2' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('01-01-2022','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy') 
                            group by 
                            id_ett,
                            id_ruta, 
                            hora,
                            cantidad
                            order by 
                            id_ruta, 
                            hora
                        )x	
                        group by
                        x.id_ett,
                        x.id_ruta, 	
                        x.hora
                        order by 
                        x.id_ett, 	
                        x.hora
                        )t inner join 
                        (
                        select
                            x.id_ett,
                            x.id_ruta, 	
                            hora,
                            round(avg(x.cantidad),2) promedio,
                            '2-1'::text sentido
                                from(
                            select
                            id_ett,
                            id_ruta, 
                            hora,
                            cantidad
                            from giz_resumen.giz_reporte04 
                            where sentido='2-1' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
                            group by 
                            id_ett,
                            id_ruta, 
                            hora,
                            cantidad
                            order by 
                            id_ruta, 
                            hora
                        )x	
                        group by
                        x.id_ett,
                        x.id_ruta, 	
                        x.hora
                        order by 
                        x.id_ett, 	
                        x.hora
                        )u on t.id_ruta=u.id_ruta
                        group by
                    -- t.id_ett,
                        t.id_ruta
                        --,a.sentido            
                    )e left join giz.giz_concesion gc on e.rutas = gc.id_ruta 		
                )y 
                inner join giz.giz_ruta gr on y.rutas=gr.id_ruta
                where y.id_ett='${req.params.empresaId}'
                group by 
                y.id,
                y.id_ett,
                gr.id_ruta,
                gr.codigo_ruta
        )f
        group by
        f.id_ruta,
        f.codigo_ruta `, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Velocidad Media en Sentido 1-2 de todas las Rutas de la EETT:'
                when id = 2 then 'Velocidad Media en Sentido 2-1 de todas las Rutas de la EETT:'
                when id = 3 then 'Velocidad Media en ambos  Sentidos de todas las Rutas de la EETT:'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) kilometraje
        from generate_series(1, 3) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen)
        });
    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}


const reporte4 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        /*rutas*/
        select 
        row_number() over(order by z.codigo_ruta) id,
        z.codigo_ruta ruta,
        z.v_autorizados,
        sum(z.v_con_gps) v_con_gps,
        sum(z.v_sin_gps) v_sin_gps,
        sum(z.v_servicio_c_gps) v_servicio_c_gps,
        round(sum(z.v_servicio_c_gps::decimal)/sum(v_autorizados::decimal),2) || '%' p_vehiculos_servicio_c_gps

        from(	select
            row_number() over(order by gr.id_ruta) id,
            gr.codigo_ruta,
            r5.v_autorizados,
            r5.v_con_gps,
            r5.v_sin_gps,
            r5.v_servicio_c_gps,
            r5.p_vehiculos_servicio_c_gps || '%' 
            from
            giz_resumen.giz_reporte05 r5 inner join giz.giz_ruta gr on gr.id_ruta=r5.id_ruta 
            where id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}' 
        )z
        group by 
        z.codigo_ruta,
        z.v_autorizados`, []);

        const resumen = await pg.query(`
            select 
                id,
                case
                    when id = 1 then '% de Vehículos en Servicio con GPS en la EETT'
                end as concepto,
                round((random() * 10 + 1)::numeric, 2) porcentaje
            from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
        });

    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}

const reporte5 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        /*rutas*/
        select 
        row_number() over(order by z.codigo_ruta) id,
        z.codigo_ruta,
        z.v_autorizados,
        round(avg(z.v_con_gps),0) v_con_gps,
        sum(z.a_boton_panico) a_boton_panico,
        round(avg(z.n_vehiculos_act_btn),0) n_vehiculos_act_btn,
        round((avg(z.n_vehiculos_act_btn)/avg(v_con_gps))*100,0) || '%' p_vehiculos_servicio_c_gps
        from( 
            select
            row_number() over(order by gr.id_ruta) id,
            gr.codigo_ruta,
            r6.v_autorizados,
            r6.v_con_gps,
            r6.a_boton_panico,
            r6.n_vehiculos_act_btn,
            r6.p_vehiculos_servicio_c_gps || '%' 
            from
            giz_resumen.giz_reporte06 r6 inner join giz.giz_ruta gr on gr.id_ruta=r6.id_ruta 
            where r6.id_ett='${req.params.empresaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
            )z
        group by 
        z.codigo_ruta,
        z.v_autorizados `, []);

        const resumen = await pg.query(`
        select 
        id,
        case
            when id = 1 then 'Alertas de Pánico y Porcentaje en todas las Rutas de la empresa '
        end as concepto,
        case
            when id = 1 then 0
        end as n_alertas,
        case
            when id = 1 then 0
        end as porcentaje
        from generate_series(1, 1) as id `, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}
const reporte6 = async (req, res) => {
    try {
        const sentido_1_2 = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.v_autorizados v_autorizados,
        g.longitud_rutas longitud_rutas,
        g.n_completos_ett n_completos_ett,
        g.n_incompletos_ett n_incompletos_ett,
        g.km_recorridos_completos_12 km_recorridos_completos_12,
        g.km_recorridos_incompletos_12 km_recorridos_incompletos_12,
        g.total*100  total_Km_Recorridos_S_12
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            x.v_autorizados v_autorizados,
            x.longitud_rutas longitud_rutas,
            sum(x.n_completos_ett) n_completos_ett,
            sum(x.n_incompletos_ett) n_incompletos_ett,
            (sum(x.n_completos_ett)*longitud_rutas) km_recorridos_completos_12,
            (sum(x.n_incompletos_ett)*longitud_rutas*0.3) km_recorridos_incompletos_12,
            (sum(x.n_completos_ett)*longitud_rutas)+(sum(x.n_incompletos_ett)*longitud_rutas*0.3) total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                coalesce ((select count(*) from giz.giz_flotavehiculos gf where gf.id_ruta=r07.id_ruta group by gf.id_ruta),0)v_autorizados,
                longitud_rutas,
                placa_vehiculo,
                n_completos_ett n_completos_ett,
                n_incompletos_ett  n_incompletos_ett
                from 
                giz_resumen.giz_reporte07 r07
                where r07.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}' and sentido='1-2'
                and n_completos_ett is not null
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta,
            x.v_autorizados,
            x.longitud_rutas 
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const sentido_2_1 = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.v_autorizados v_autorizados,
        g.longitud_rutas longitud_rutas,
        g.n_completos_ett n_completos_ett,
        g.n_incompletos_ett n_incompletos_ett,
        g.km_recorridos_completos_21 km_recorridos_completos_21,
        g.km_recorridos_incompletos_21 km_recorridos_incompletos_21,
        g.total*100 total_Km_Recorridos_S_21
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            x.v_autorizados v_autorizados,
            x.longitud_rutas longitud_rutas,
            sum(x.n_completos_ett) n_completos_ett,
            sum(x.n_incompletos_ett) n_incompletos_ett,
            (sum(x.n_completos_ett)*longitud_rutas) km_recorridos_completos_21,
            (sum(x.n_incompletos_ett)*longitud_rutas*0.3) km_recorridos_incompletos_21,
            (sum(x.n_completos_ett)*longitud_rutas)+(sum(x.n_incompletos_ett)*longitud_rutas*0.3) total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                coalesce ((select count(*) from giz.giz_flotavehiculos gf where gf.id_ruta=r07.id_ruta group by gf.id_ruta),0)v_autorizados,
                longitud_rutas,
                placa_vehiculo,
                n_completos_ett n_completos_ett,
                n_incompletos_ett  n_incompletos_ett
                from 
                giz_resumen.giz_reporte07 r07
                where r07.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}' and sentido='2-1'
                and n_completos_ett is not null
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta,
            x.v_autorizados,
            x.longitud_rutas 
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Kilómetros recorridos en las Rutas de la EETT en el Sentido 1-2'
                when id = 2 then 'Kilómetros recorridos en las Rutas de la EETT en el Sentido 2-1'
                when id = 3 then 'Kilómetros recorridos en las Rutas de la EETT en ambos Sentidos'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 3) as id`, []);

        return res.status(200).send({
            sentido_1_2: camelcaseKeys(sentido_1_2),
            sentido_2_1: camelcaseKeys(sentido_2_1),
            resumen: camelcaseKeys(resumen),
        });

    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}
const reporte7 = async (req, res) => {
    try {
        const sentido_1_2 = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.v_autorizados v_autorizados,
        g.longitud_rutas longitud_rutas,
        g.n_paraderos_ruta n_paraderos_ruta,
        g.n_viajes_detenciones_100 n_viajes_detenciones_100,
        g.n_viajes_detenciones_inc n_viajes_detenciones_inc,
        g.n_detenciones_paraderos n_Detenciones_No_Realizadas_Paraderos,
        g.porc_detenciones*100 || '%' porc_Viajes_Detenciones_Paraderos_12
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            x.v_autorizados v_autorizados,
            x.longitud_rutas longitud_rutas,
            sum(x.n_paraderos_ruta) n_paraderos_ruta,
            sum(x.n_viajes_detenciones_100) n_viajes_detenciones_100,
            sum(x.n_viajes_detenciones_inc) n_viajes_detenciones_inc,
            sum(abs((x.n_paraderos_ruta*x.n_viajes_detenciones_100)-x.n_viajes_detenciones_inc)) n_detenciones_paraderos,--corregir
            round(abs(((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))::decimal/(sum(n_viajes_detenciones_inc)+(abs((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))))::decimal),2) porc_detenciones -- corregir
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                v_autorizados,
                longitud_rutas,
                n_paraderos_ruta,
                n_viajes_detenciones_100,
                n_viajes_detenciones_inc
                from 
                giz_resumen.giz_reporte08 r08
                where  r08.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'  and r08.sentido='1-2'
                order by 4
            )x
            group by 
            x.id_ett,
            x.id_ruta,
            x.v_autorizados,
            x.longitud_rutas 
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const sentido_2_1 = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.v_autorizados v_autorizados,
        g.longitud_rutas longitud_rutas,
        g.n_paraderos_ruta n_paraderos_ruta,
        g.n_viajes_detenciones_100 n_viajes_detenciones_100,
        g.n_viajes_detenciones_inc n_viajes_detenciones_inc,
        g.n_detenciones_paraderos n_Detenciones_No_Realizadas_Paraderos,
        g.porc_detenciones*100 || '%' porc_Viajes_Detenciones_Paraderos_21
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            x.v_autorizados v_autorizados,
            x.longitud_rutas longitud_rutas,
            sum(x.n_paraderos_ruta) n_paraderos_ruta,
            sum(x.n_viajes_detenciones_100) n_viajes_detenciones_100,
            sum(x.n_viajes_detenciones_inc) n_viajes_detenciones_inc,
            sum(abs((x.n_paraderos_ruta*x.n_viajes_detenciones_100)-x.n_viajes_detenciones_inc)) n_detenciones_paraderos,--corregir
            round(abs(((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))::decimal/(sum(n_viajes_detenciones_inc)+(abs((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))))::decimal),2) porc_detenciones -- corregir
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                v_autorizados,
                longitud_rutas,
                n_paraderos_ruta,
                n_viajes_detenciones_100,
                n_viajes_detenciones_inc
                from 
                giz_resumen.giz_reporte08 r08
                where  r08.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'  and r08.sentido='2-1'
                order by 4
            )x
            group by 
            x.id_ett,
            x.id_ruta,
            x.v_autorizados,
            x.longitud_rutas 
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta `, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then '%  de Viajes con Detenciones de Vehículos en Paraderos en Sentido 1-2 en todas las Rutas de la EETT:'
                when id = 2 then '%  de Viajes con Detenciones de Vehículos en Paraderos en Sentido 2-1 en todas las Rutas de la EETT:'
                when id = 3 then '%  de Viajes con Detenciones de Vehículos en Paraderos en ambos Sentido en todas las Rutas de la EETT:'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 3) as id`, []);
        return res.status(200).send({
            sentido_1_2: camelcaseKeys(sentido_1_2),
            sentido_2_1: camelcaseKeys(sentido_2_1),
            resumen: camelcaseKeys(resumen),
        });

    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}
const reporte8 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.km_recorridos_gps km_recorridos_gps,
        g.porc_km_recorridos_ruta_gps || '%' porc_km_recorridos_ruta_gps
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos_gps)) km_recorridos_gps,
            0/sum(x.km_recorridos_gps) porc_km_recorridos_ruta_gps
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                km_recorridos_gps km_recorridos_gps
                from 
                giz_resumen.giz_reporte09 r09
                where  r09.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}' 
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then '%  de Km Recorridos en Rutas de la EETT (Rutas vs. GPS)'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
        });

    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}
const reporte9 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.km_recorridos tot_Km_Recorridos,
        g.pago_subsidio pago_subsidio
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            (sum(x.subsidio)*sum(x.km_recorridos)) pago_subsidio
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                subsidio,
                round(tot_km_recorridos/1000,2) km_recorridos
                from 
                giz_resumen.giz_reporte10 r10
                where  r10.id_ett='${req.params.empresaId}' and to_char(r10.fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then '%  de Km Recorridos en Rutas de la EETT (Rutas vs. GPS)'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
        });

    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}
const reporte10 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.km_recorridos tot_Km_Recorridos,
        g.km_recorridos_fuera km_Recorridos_Fuera,
        round((g.km_recorridos_fuera/g.km_recorridos)*100,2)  || '%' porc_Total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            (sum(x.km_recorridos_fuera)) km_recorridos_fuera
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                round(km_recorridos_gps/1000,2) km_recorridos,
                round(km_recorridos_ruta/1000,2) km_recorridos_fuera
                from 
                giz_resumen.giz_reporte11 r11
                where  r11.id_ett='${req.params.empresaId}' and to_char(r11.fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);
        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Pago de Subsidio por Rutas, según kilómetros recorridos '
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 1) as id`, []);
        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen)
        });
    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}

const reporte11 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            id,
            'Ruta' || ' ' || id as ruta,
            floor(random() * 2000 + 1)::int as km_recorridos_fuera_ruta            
            from generate_series(1, 10) as id`, []);
        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}
const reporte12 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        id,
            'Ruta' || ' ' || id as ruta,
            floor(random() * 2000 + 1)::int as tiempo_sin_transmision_gps            
            from generate_series(1, 10) as id`, []);
        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
        });

    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}

const reporte13 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            id,
            'Ruta' || ' ' || id as ruta,
            floor(random() * 2000 + 1)::int as tot_tiempo_acumulado_o_s            
            from generate_series(1, 10) as id   `, []);
        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
        });

    } catch (error) {
        return res.status(500).send({
            message: error
        });
    }
}