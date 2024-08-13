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
    if (reporteId === 14) return reporte14(req, res);
}

const reporte1 = async (req, res) => {
    try {
        const detalle = await pg.query(`          
        select 
        c.razon_social_empresa,	
        c.id_ett,
        c.id_ruta ,
        gr.codigo_ruta ,
        count(*) buses,
        sum(s_12) salidas12,
        sum(v_in_12) viajes_Incompletos_12,
        sum(v_c_12) viajes_Completos_12,
        sum(s_21) salidas_21,
        sum(v_in_21) viajes_Incompletos_21,
        sum(v_c_21) viajes_Completos_21,
        case when sum(v_c_12)!=0 then round((sum(v_c_12::decimal)/sum(s_12::decimal))*100,2) else 0 end || '%' porc_Viajes_Completos_12,
        case when sum(v_c_21)!=0 then round((sum(v_c_21::decimal)/sum(s_21::decimal))*100,2) else 0 end || '%' porc_Viajes_Completos_21
        from (
        select 
            geet.razon_social_empresa,
            r1.id_ett,
            id_ruta,
            placa_vehiculo placa_vehiculo,
            salida_1_2 s_12,
            viajes_incompletos_1_2 v_in_12,
            viajes_completos_1_2  v_c_12,
            salida_2_1 s_21,
            viajes_incompletos_2_1 v_in_21,
            viajes_completos_2_1 v_c_21
            from giz_resumen.giz_reporte01 r1 left join giz.giz_ett geet on r1.id_ett=geet.id_ett  
            where  r1.id_ett='${req.params.empresaId}' and to_date(to_char(r1.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
            group by 
            geet.razon_social_empresa,	
            r1.id_ett,
            placa_vehiculo,
            id_ruta, 
            salida_1_2,
            viajes_incompletos_1_2,
            viajes_completos_1_2,
            salida_2_1 ,
            viajes_incompletos_2_1 ,
            viajes_completos_2_1 
            order by 1
        )c inner join giz.giz_ruta gr on c.id_ruta=gr.id_ruta 
        group by c.razon_social_empresa,c.id_ett,c.id_ruta,gr.codigo_ruta
        order by 1,2`, []);

        const resumen = await pg.query(`
            select 
                id,
                case
                when id = 1 then '% de Viajes completos en Sentido 1-2 en todas las Rutas de la EETT:'
                when id = 2 then '% de Viajes completos en Sentido 2-1 en todas las Rutas de la EETT:'
                when id = 3 then '% de Viajes completos en ambos Sentidos en todas las Rutas de la EETT:'
                end as concepto,
                case
                    when id = 1 then 0
                    when id = 2 then 0
                    when id = 3 then 0
                end as completos,
                case
                    when id = 1 then 0
                    when id = 2 then 0
                    when id = 3 then 0
                end as porcentaje
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
        h.ruta id_ruta,
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
            round(sum(t.promedio::numeric),2) || '%' porc_transmision_1_2,
            round(sum(u.promedio::numeric),2) || '%' porc_transmision_2_1
            from
            (
                select 
                y.id_ruta,
                (select count(*) from giz.giz_flotavehiculos gf where gf.id_ruta= y.id_ruta group by gf.id_ruta) buses_autorizados,
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
                        where sentido='1-2' and id_ett='${req.params.empresaId}' and id_ruta=x.id_ruta and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')

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
                        where sentido='1-2' and id_ett='${req.params.empresaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
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
                        where sentido='2-1' and id_ett='${req.params.empresaId}' and id_ruta=x.id_ruta and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')

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
                        where sentido='2-1' and id_ett='${req.params.empresaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
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
                when id = 1 then 'Promedio del % de Transmisión del GPS por minuto Sentido 1-2 en todas las Rutas de la EETT:'
                when id = 2 then 'Promedio del % de Transmisión del GPS por minuto Sentido 2-1 en todas las Rutas de la EETT:'
                when id = 3 then 'Promedio del % de Transmisión del GPS por minuto en ambos Sentidos en todas las Rutas de la EETT:'
            end as concepto,
            case
            when id = 1 then 0
            when id = 2 then 0
            when id = 3 then 0
        end as porcentaje       
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
        round(avg(longitud),2) longitud,
        round(sum(n_paradas_ruta),0) n_paradas_ruta,
        round(sum(n_viajes_completo),0) n_viajes_completo,
        round(avg(v_media_ruta_12),0) v_media_ruta_12,
        round(avg(v_media_ruta_21),0) v_media_ruta_21
        from (
            select 
                y.id,
                y.id_ett,
                gr.id_ruta,
                gr.codigo_ruta,
                avg(y.longitud_ruta) longitud,
                sum(y.c_paraderos) n_paradas_ruta,
                sum(y.viajes_completos) n_viajes_completo,
                avg(y.porc_transmision_1_2) v_media_ruta_12,
                avg(y.porc_transmision_2_1) v_media_ruta_21
                from (
                    select 
                    gc.id_ett id_ett,
                    e.* 
                    from(select 
                        row_number() over(order by t.id_ruta) id,
                        --t.id_ett empresa,
                        t.id_ruta rutas,
                        coalesce((select round((ST_Length(geom12::geography,true)/1000)::decimal,2)+round((ST_Length(geom21::geography,true)/1000)::decimal,2) c_km from giz.giz_ruta gr where gr.id_ruta=t.id_ruta and geom12 is not null and geom21 is not null),0) longitud_ruta,
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
                            where sentido='1-2' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
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
                    )e left join giz.giz_flotavehiculos gc on e.rutas = gc.id_ruta 		
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
                when id = 1 then 'Velocidad promedio en Sentido 1-2 de todas las Rutas de la EETT:'
                when id = 2 then 'Velocidad promedio en Sentido 2-1 de todas las Rutas de la EETT:'
                when id = 3 then 'Velocidad promedio en ambos  Sentidos de todas las Rutas de la EETT:'
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
        round(sum(z.v_servicio_c_gps::decimal)/sum(v_autorizados::decimal),2)*100 || '%' p_vehiculos_servicio_c_gps        from(	select
            row_number() over(order by gr.id_ruta) id,
            gr.codigo_ruta,
--            (select count(*) from giz.giz_flotavehiculos gf inner join giz.giz_vehiculo gv on gv.placa_vehiculo=gf.placa_vehiculo where id_ett=r5.id_ett and gv.id_estado_vehiculo=1) v_autorizados,
            r5.v_autorizados,
            r5.v_con_gps,
            r5.v_sin_gps,
            r5.v_servicio_c_gps,
            r5.p_vehiculos_servicio_c_gps || '%' 
            from
            giz_resumen.giz_reporte05 r5 inner join giz.giz_ruta gr on gr.id_ruta=r5.id_ruta 
            where id_ett='${req.params.empresaId}' and  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy') 
        )z
        group by 
        z.codigo_ruta,
        z.v_autorizados`, []);

        const resumen = await pg.query(`
            select 
                id,
                case
                    when id = 1 then 'Promedio % de Vehículos en Servicio con GPS en la EETT'
                end as concepto,
               0 as vehiculos,
               0 as porcentaje
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
        z.id_ruta,
        z.codigo_ruta,
        sum(z.v_autorizados) v_autorizados,
        round(avg(z.v_con_gps),0) v_con_gps,
        sum(z.a_boton_panico) a_boton_panico,
        round(avg(z.n_vehiculos_act_btn),0) n_vehiculos_act_btn,
        case when avg(v_con_gps)=0 then 0 else round((avg(z.n_vehiculos_act_btn )::decimal/avg(v_con_gps)::decimal)*100,0) end  || '%' p_vehiculos_servicio_c_gps  
        from( 
            select
            row_number() over(order by gr.id_ruta) id,
            gr.id_ruta,
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
        z.id_ruta,
        z.codigo_ruta
        `, []);

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
        gr.id_ruta,
        g.v_autorizados v_autorizados,
        g.longitud_rutas longitud_rutas,
        g.n_completos_ett n_completos_ett,
        g.n_incompletos_ett n_incompletos_ett,
        g.km_recorridos_completos_12 km_recorridos_completos_12,
        g.km_recorridos_incompletos_12 km_recorridos_incompletos_12,
        g.total  total_Km_Recorridos_S_12
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            x.v_autorizados v_autorizados,
            x.longitud_rutas longitud_rutas,
            sum(x.n_completos_ett) n_completos_ett,
            sum(x.n_incompletos_ett) n_incompletos_ett,
            (sum(x.km_recorridos_con_ett)) km_recorridos_completos_12,
            (sum(x.km_recorridos_inc_ett)) km_recorridos_incompletos_12,
            (sum(x.km_recorridos_con_ett)+sum(x.km_recorridos_inc_ett)) total
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
                n_incompletos_ett  n_incompletos_ett,
                km_recorridos_con_ett km_recorridos_con_ett,
--                km_recorridos_inc_ett km_recorridos_inc_ett,
                n_incompletos_ett * longitud_rutas as km_recorridos_inc_ett
                from 
                giz_resumen.giz_reporte07 r07
                where r07.id_ett='${req.params.empresaId}' and to_date(to_char(r07.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy') and sentido='1-2'
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
        gr.id_ruta,
        g.v_autorizados v_autorizados,
        g.longitud_rutas longitud_rutas,
        g.n_completos_ett n_completos_ett,
        g.n_incompletos_ett n_incompletos_ett,
        g.km_recorridos_completos_21 km_recorridos_completos_21,
        g.km_recorridos_incompletos_21 km_recorridos_incompletos_21,
        g.total  total_Km_Recorridos_S_21
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            x.v_autorizados v_autorizados,
            x.longitud_rutas longitud_rutas,
            sum(x.n_completos_ett) n_completos_ett,
            sum(x.n_incompletos_ett) n_incompletos_ett,
            (sum(x.km_recorridos_con_ett)) km_recorridos_completos_21,
            (sum(x.km_recorridos_inc_ett)) km_recorridos_incompletos_21,
            (sum(x.km_recorridos_con_ett)+sum(x.km_recorridos_inc_ett)) total
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
                n_incompletos_ett  n_incompletos_ett,
                km_recorridos_con_ett km_recorridos_con_ett,
--                km_recorridos_inc_ett km_recorridos_inc_ett,
                n_incompletos_ett * longitud_rutas as km_recorridos_inc_ett
                from 
                giz_resumen.giz_reporte07 r07
                where r07.id_ett='${req.params.empresaId}' and to_date(to_char(r07.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy') and sentido='2-1'
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
            round((random() * 10 + 1)::numeric, 2) kilometraje
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
        gr.codigo_ruta,
        g.v_autorizados v_autorizados,
        g.longitud_rutas longitud_rutas,
        g.n_paraderos_ruta n_paraderos_ruta,
        g.n_viajes_detenciones_100 n_viajes_detenciones_100,
        g.n_viajes_detenciones_inc n_viajes_detenciones_inc,
        g.n_detenciones_paraderos n_Detenciones_No_Realizadas_Paraderos
--        g.porc_detenciones*100 || '%' porc_Viajes_Detenciones_Paraderos_12
        ,case when g.n_viajes_detenciones_inc=0 then 0  else (g.n_detenciones_paraderos/(g.n_viajes_detenciones_inc-g.n_detenciones_paraderos))*100 end  || '%' porc_Viajes_Detenciones_Paraderos_12
        from(
            select
            row_number() over(order by 1) id,
            x.id_ruta,
            sum(x.v_autorizados) v_autorizados,
            sum(x.longitud_rutas) longitud_rutas,
            sum(x.n_paraderos_ruta) n_paraderos_ruta,
            sum(x.n_viajes_detenciones_100) n_viajes_detenciones_100,
            sum(x.n_viajes_detenciones_inc) n_viajes_detenciones_inc,
            sum(case when ((x.n_paraderos_ruta*x.n_viajes_detenciones_100)-x.n_viajes_detenciones_inc)<0 then 0 else ((x.n_paraderos_ruta*x.n_viajes_detenciones_100)-x.n_viajes_detenciones_inc) end ) n_detenciones_paraderos,--corregir
            
            case when (sum(n_viajes_detenciones_inc)+(abs((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc)))) =0 then 0 else round(abs(((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))::decimal/(sum(n_viajes_detenciones_inc)+(abs((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))))::decimal),2) end as porc_detenciones -- corregir

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
                where  r08.id_ett='${req.params.empresaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.inicio}','dd-mm-yyyy')  and r08.sentido='1-2'
                order by 4
            )x
            group by 
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta
        `, []);

        const sentido_2_1 = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gr.codigo_ruta,
        g.v_autorizados v_autorizados,
        g.longitud_rutas longitud_rutas,
        g.n_paraderos_ruta n_paraderos_ruta,
        g.n_viajes_detenciones_100 n_viajes_detenciones_100,
        g.n_viajes_detenciones_inc n_viajes_detenciones_inc,
        g.n_detenciones_paraderos n_Detenciones_No_Realizadas_Paraderos
--        g.porc_detenciones*100 || '%' porc_Viajes_Detenciones_Paraderos_21
        ,case when g.n_viajes_detenciones_inc=0 then 0  else (g.n_detenciones_paraderos/(g.n_viajes_detenciones_inc-g.n_detenciones_paraderos))*100 end  || '%' porc_Viajes_Detenciones_Paraderos_21
        from(
            select
            row_number() over(order by 1) id,
            x.id_ruta,
            sum(x.v_autorizados) v_autorizados,
            sum(x.longitud_rutas) longitud_rutas,
            sum(x.n_paraderos_ruta) n_paraderos_ruta,
            sum(x.n_viajes_detenciones_100) n_viajes_detenciones_100,
            sum(x.n_viajes_detenciones_inc) n_viajes_detenciones_inc,
            sum(case when ((x.n_paraderos_ruta*x.n_viajes_detenciones_100)-x.n_viajes_detenciones_inc)<0 then 0 else ((x.n_paraderos_ruta*x.n_viajes_detenciones_100)-x.n_viajes_detenciones_inc) end ) n_detenciones_paraderos,--corregir
            
            case when (sum(n_viajes_detenciones_inc)+(abs((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc)))) =0 then 0 else round(abs(((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))::decimal/(sum(n_viajes_detenciones_inc)+(abs((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))))::decimal),2) end as porc_detenciones -- corregir

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
                where  r08.id_ett='${req.params.empresaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.inicio}','dd-mm-yyyy')  and r08.sentido='2-1'
                order by 4
            )x
            group by 
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Detenciones de Vehículos en Paraderos y su Porcentaje en Sentido 1-2 en todas rutas de la Empresas de transporte registradas:'
                when id = 2 then 'Detenciones de Vehículos en Paraderos y su porcentaje en Sentido 2-1 en todas rutas de la Empresas de transporte registradas:'
                when id = 3 then 'Detenciones de Vehículos en Paraderos y su Porcentaje en ambos Sentido en todas rutas de la Empresas de transporte registradas:'
            end as concepto,
            case
                when id = 1 then 0
                when id = 2 then 0
                when id = 3 then 0
            end as detenciones,
            case
                when id = 1 then 0
                when id = 2 then 0
                when id = 3 then 0
             end as porcentaje
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
		gr.id_ruta ,
        gr.codigo_ruta,
        g.km_recorridos_gps km_recorridos_gps,
        g.km_recorridos_ruta km_recorridos_ruta,
        g.porc_km_recorridos_ruta_gps || ' %' porc_km_recorridos_ruta_gps
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos_gps)) km_recorridos_gps,
            (sum(x.km_recorridos_ruta)) km_recorridos_ruta,
            case when sum(x.km_recorridos_ruta)::decimal =0 then 0 else round(sum(x.km_recorridos_gps)::decimal/sum(x.km_recorridos_ruta)::decimal,2)*100 end  porc_km_recorridos_ruta_gps
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                km_recorridos_gps km_recorridos_gps,
                coalesce(km_recorridos_ruta,0)::integer km_recorridos_ruta
                from 
                giz_resumen.giz_reporte09 r09
                where  r09.id_ett='${req.params.empresaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                and km_recorridos_gps!=0
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
                when id = 1 then 'Comparativo de Km Recorridos en Rutas vs. Km Recorridos según GPS, en ambos sentidos, en todas las Rutas de la EETT'
            end as concepto,
            case
                when id = 1 then 0
            end as kilometros,
            case
                when id = 1 then 0
            end as porcentaje
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
        gr.id_ruta ,
        gr.codigo_ruta,
        round(coalesce(g.km_recorridos,0),0) tot_Km_Recorridos,
        round(coalesce(g.pago_subsidio,0),0) pago_subsidio
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            (sum(x.pago_subsidio)) pago_subsidio
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                subsidio,
                round(tot_km_recorridos,2) km_recorridos,
		        subsidio*round(tot_km_recorridos,2) pago_subsidio
                from 
                giz_resumen.giz_reporte10 r10
                where  r10.id_ett='${req.params.empresaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                and tot_km_recorridos is not null
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
                when id = 1 then 'Reporte de Kilómetros recorridos válidos para pago de Subsidios'
            end as concepto,
            case  
            when id = 1 then 0
        end as importe,
        case   
            when id = 1 then 0
        end as subsidio
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
        --gett.razon_social_empresa,
        gr.id_ruta ,
        gr.codigo_ruta,
        sum(g.km_recorridos) tot_Km_Recorridos,
        sum(g.km_recorridos_fuera) km_Recorridos_Fuera,
        case when sum(g.km_recorridos)=0 then 0.00 else  round((sum(g.km_recorridos_fuera)/sum(g.km_recorridos))*100,2) end  || '%' porc_Total
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
                round(km_recorridos_gps,2) km_recorridos,
                round(km_recorridos_ruta,2) km_recorridos_fuera
                from 
                giz_resumen.giz_reporte11 r11
                where r11.id_ett='${req.params.empresaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta
        group by 
          gr.codigo_ruta,
          gr.id_ruta `, []);

        const resumen = await pg.query(`
        select 
        id,
        case
            when id = 1 then 'Kilómetros Recorridos fuera del Itinerario de todas las Rutas y en horario del Servicio de la totalidad'
        end as concepto,
        case
            when id = 1 then 0
        end as kilometraje,
        case
            when id = 1 then 0
        end as porcentaje
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
        row_number() over(order by 1) id
        ,r13.id_ruta
        ,gr.codigo_ruta 
        ,replace(justify_hours(sum(tiempo_sin_transmision_gps ))::text,' days ', ' dias ') tiempo_Sin_Transmision_Gps 
        --justify_hours(sum(tiempo_sin_transmision_gps ))::text
        from giz.giz_resumen.giz_reporte13 r13
        inner join giz.giz_ruta gr on r13.id_ruta =gr.id_ruta 
        where r13.id_ett= '${req.params.empresaId}' and  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
		group by 
        r13.id_ruta
        ,gr.codigo_ruta
        `, []);
        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Tiempo sin Transmisión del GPS en todas las Rutas de la totalidad de Empresas de Transporte registradas'
            end as concepto,
            case
            when id = 1 then 
            (select replace(justify_hours(sum(tiempo_sin_transmision_gps ))::text,' days ', ' dias ') tiempo 
                from giz.giz_resumen.giz_reporte13 r13
                inner join giz.giz_ruta gr on r13.id_ruta =gr.id_ruta 
                where r13.id_ett= '${req.params.empresaId}'  and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
               )             
            end as tiempo
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
const reporte12 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id
        ,r14.id_ruta
        ,gr.codigo_ruta 
        ,replace(justify_hours(sum(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo_Acu_Transmision_Gps 
        from giz.giz_resumen.giz_reporte14 r14
        inner join giz.giz_ruta gr on r14.id_ruta =gr.id_ruta 
        where r14.id_ett= '${req.params.empresaId}' and  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
		group by 
        r14.id_ruta
        ,gr.codigo_ruta`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Tiempo Acumulado por los Vehículos en todas las Rutas , en la prestación del Servicio, en la EETT'
            end as concepto,
            case
            when id = 1 then 
            (select replace(justify_hours(sum(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo 
                from giz.giz_resumen.giz_reporte14 r14
                inner join giz.giz_ruta gr on r14.id_ruta =gr.id_ruta 
                where r14.id_ett= '${req.params.empresaId}'  and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
               )             
            end as tiempo
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

const reporte14 = async (req, res) => {
    try {
        const detalle = await pg.query(`          
        select 
        c.razon_social_empresa,	
        c.id_ett,
        c.id_ruta ,
        gr.codigo_ruta ,
        count(*) buses,
        sum(s_12) salidas12,
        sum(v_in_12) viajes_Incompletos_12,
        sum(v_c_12) viajes_Completos_12,
        sum(s_21) salidas_21,
        sum(v_in_21) viajes_Incompletos_21,
        sum(v_c_21) viajes_Completos_21,
        case when sum(v_c_12)!=0 then round((sum(v_c_12::decimal)/sum(s_12::decimal)),3) else 0 end || '%' porc_Viajes_Completos_12,
        case when sum(v_c_21)!=0 then round((sum(v_c_21::decimal)/sum(s_21::decimal)),3) else 0 end || '%' porc_Viajes_Completos_21
        from (
        select 
            geet.razon_social_empresa,
            r1.id_ett,
            id_ruta,
            placa_vehiculo placa_vehiculo,
            salida_1_2 s_12,
            viajes_incompletos_1_2 v_in_12,
            viajes_completos_1_2  v_c_12,
            salida_2_1 s_21,
            viajes_incompletos_2_1 v_in_21,
            viajes_completos_2_1 v_c_21
            from giz_resumen.giz_reporte16 r1 left join giz.giz_ett geet on r1.id_ett=geet.id_ett  
            where  r1.id_ett='${req.params.empresaId}' and to_date(to_char(r1.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
            group by 
            geet.razon_social_empresa,	
            r1.id_ett,
            placa_vehiculo,
            id_ruta, 
            salida_1_2,
            viajes_incompletos_1_2,
            viajes_completos_1_2,
            salida_2_1 ,
            viajes_incompletos_2_1 ,
            viajes_completos_2_1 
            order by 1
        )c inner join giz.giz_ruta gr on c.id_ruta=gr.id_ruta 
        group by c.razon_social_empresa,c.id_ett,c.id_ruta,gr.codigo_ruta
        order by 1,2`, []);

        const resumen = await pg.query(`
            select 
                id,
                case
                when id = 1 then '% de Viajes completos en Sentido 1-2 en todas las Rutas de la EETT:'
                when id = 2 then '% de Viajes completos en Sentido 2-1 en todas las Rutas de la EETT:'
                when id = 3 then '% de Viajes completos en ambos Sentidos en todas las Rutas de la EETT:'
                end as concepto,
                case
                    when id = 1 then 0
                    when id = 2 then 0
                    when id = 3 then 0
                end as completos,
                case
                    when id = 1 then 0
                    when id = 2 then 0
                    when id = 3 then 0
                end as porcentaje
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