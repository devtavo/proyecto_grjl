const pg = require('../services/pg');
const helper = require("../helper/jwt");
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna el reporte solicitado nivel empresas
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    if (!req.params.reporteId)
        return res.status(404).send({ message: "Debe enviar el parámetro reporteId" });

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
        tipo
        ,to_date(to_char(fecha_registro,'dd-mm-yyyy'),'dd-mm-yyyy') fecha
        ,count(*) cantidad
        from smlpr.sm_registros
        group by 
        tipo
        ,to_date(to_char(fecha_registro,'dd-mm-yyyy'),'dd-mm-yyyy')         
                `, []);

        return res.status(200).send({detalle: camelcaseKeys(detalle)});
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte2 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.id_ett,
        gett.cod_ett ||' '||gett.razon_social_empresa razon_social_empresa,
        count(y.rutas) rutas,
        round(sum(y.buses_autorizados),0) buses_autorizados,
        sum(y.buses_en_serv_12) buses_en_serv_12,
        sum(y.buses_en_serv_21) buses_en_serv_21,
        round(avg(y.porc_transmision_1_2),2) || '%' porc_transmision_1_2,
        round(avg(y.porc_transmision_2_1),2) || '%' porc_transmision_2_1
        from (
        select 
            t.id_ett empresa,
            count(*) rutas,
            --coalesce( (select count(*) from giz.giz_flotavehiculos gf where gf.id_ruta= t.id_ruta group by gf.id_ruta),0) buses_autorizados,
            sum(t.buses_autorizados)/count(*) buses_autorizados,
            round(sum(t.vehiculo12)/count(*),0) buses_en_serv_12,
            round(sum(u.vehiculo21)/count(*),0) buses_en_serv_21,
            round(avg(t.promedio::numeric),2) porc_transmision_1_2,
            round(avg(u.promedio::numeric),2) porc_transmision_2_1
            from
            (
                select 
                y.id_ett,
                y.id_ruta,
                (select count(*) from giz.giz_flotavehiculos gf where gf.id_ruta= y.id_ruta group by gf.id_ruta) buses_autorizados,
                y.vehiculo12,
                round(avg(y.factor),2) promedio
                from(
                    select
                    x.id_ett,
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
                        where sentido='1-2' and id_ett=x.id_ett and id_ruta=x.id_ruta and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy') 
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
                        where sentido='1-2' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
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
                    x.id_ett,
                    x.id_ruta, 	
                    x.placa_vehiculo, 
                    x.hora
                    order by  
                    round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 desc,
                    x.placa_vehiculo,
                    x.hora
                )y
                group by 
                y.id_ett,
                y.id_ruta,
                y.vehiculo12
                order by 1,2
            )t inner join
            (	select 
                y.id_ett,
                y.id_ruta,
                (select count(*) from giz.giz_flotavehiculos gf where gf.id_ruta= y.id_ruta group by gf.id_ruta) buses_autorizados,
                y.vehiculo21,
                round(avg(y.factor),2) promedio
                from(
                    select
                    x.id_ett,
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
                        where sentido='2-1' and id_ett=x.id_ett and id_ruta=x.id_ruta and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
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
                        where sentido='2-1' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
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
                    x.id_ett,
                    x.id_ruta, 	
                    x.placa_vehiculo, 
                    x.hora
                    order by  
                    round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 desc,
                    x.placa_vehiculo,
                    x.hora
                )y
                group by 
                y.id_ett,
                y.id_ruta,
                y.vehiculo21
                    order by 1,2
            )u on t.id_ett=u.id_ett
            group by
                t.id_ett,
            t.id_ruta
            )y 
            inner join giz.giz_ett gett on y.empresa=gett.id_ett
            group by 
            cod_ett,
            id_ett,
            razon_social_empresa`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Promedio % de Transmisión del GPS por minuto Sentido 1-2 en todas las Rutas de las EETT registradas en el Sistema:'
                when id = 2 then 'Promedio % de Transmisión del GPS por minuto Sentido 2-1 en todas las Rutas de las EETT registradas en el Sistema:'
                when id = 3 then 'Promedio % de Transmisión del GPS por minuto en ambos Sentidos en todas las Rutas de las EETT registradas en el Sistema:'
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
        return res.status(500).send({ message: error });
    }
}

const reporte3 = async (req, res) => {
    try {
        const detalle = await pg.query(`
         
        select 
        r041.id_ett,
        round(sum(r041.long_ruta),0) longitud,
        gett.razon_social_empresa,
        round(sum(r041.n_paradero),0) n_paradas_ruta,
		round(sum(r041.n_viaje_completo),0) n_viajes_completo,
        round(avg(v_media_12),0) v_media_ruta_12,
        round(avg(v_media_21),0) v_media_ruta_21
        from giz_resumen.giz_reporte04_1 r041
         inner join giz.giz_ett gett on r041.id_ett=gett.id_ett
         where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
         and v_media_12>0
		group by 
		r041.id_ett,
		gett.razon_social_empresa  `, []);

        const resumen = await pg.query(`
        select 
        id,
        case
        when id = 1 then 'Velocidad Media en Sentido 1-2 en las Empresas de Transporte Registradas:'
        when id = 2 then 'Velocidad Media en Sentido 2-1 en las Empresas de Transporte Registradas:'
        when id = 3 then 'Velocidad Media en ambos Sentidos en las Empresas de Transporte Registradas:'
        end as concepto,
        case
            when id = 1 then 0
            when id = 2 then 0
            when id = 3 then 0
        end as kilometraje
        from generate_series(1, 3) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte4 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by z.id_ett) id,
        z.id_ett,
       	z.razon_social_empresa ,
        round(sum(v_autorizados),0) v_autorizados,
        round(sum(v_con_gps),0) v_con_gps,
        round(sum(v_autorizados)-(sum(v_con_gps)),0) v_sin_gps,
        round(sum(v_servicio_c_gps),0) v_servicio_c_gps,
        round(sum(v_servicio_c_gps::decimal)/sum(v_autorizados::decimal),2)*100 || ' %' p_vehiculos_servicio_c_gps 
        from
        ( 	select
                row_number() over(order by gr.id_ruta) id,
                r5.id_ett,
                gett.cod_ett|| ' '|| gett.razon_social_empresa razon_social_empresa,
--                (select count(*) from giz.giz_flotavehiculos gf inner join giz.giz_vehiculo gv on gv.placa_vehiculo=gf.placa_vehiculo where id_ett=r5.id_ett and gv.id_estado_vehiculo=1) v_autorizados,
                r5.v_autorizados,
                r5.v_con_gps,
                r5.v_sin_gps,
                r5.v_servicio_c_gps,
                r5.p_vehiculos_servicio_c_gps  p_vehiculos_servicio_c_gps 
            from
            giz_resumen.giz_reporte05 r5 inner join giz.giz_ruta gr on gr.id_ruta=r5.id_ruta  inner join giz.giz_ett gett on gett.id_ett=r5.id_ett
            where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy') 
        )z    
        group by 
        z.id_ett,
        z.razon_social_empresa
        --,v_autorizados
        `, []);
        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Vehículos con GPS en Servicio y su Porcentaje en las Empresas de Transporte Registradas:'
            end as concepto,
            case
                when id = 1 then '0%'
            end as vehiculos,
            case
                when id = 1 then '0%'
            end as porcentaje
        from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte5 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            row_number() over(order by z.id_ett) id,
            z.id_ett,
            z.cod_ett||' '||z.razon_social_empresa razon_social_empresa,
            round(avg(z.v_autorizados),0) v_autorizados,
            round(avg(z.v_con_gps),0) v_con_gps,
            sum(z.a_boton_panico) a_boton_panico,
            round(avg(z.n_vehiculos_act_btn ),0) n_vehiculos_act_btn ,
            case when avg(v_con_gps)=0 then 0 else round((avg(z.n_vehiculos_act_btn )::decimal/avg(v_con_gps)::decimal)*100,0) end  || '%' p_vehiculos_servicio_c_gps         from
        ( 	select
                row_number() over(order by gr.id_ruta) id,
                r6.id_ett,
                gett.cod_ett,
                gett.razon_social_empresa,
                (select count(*) from giz.giz_flotavehiculos where id_ett=r6.id_ett) v_autorizados,
                r6.v_con_gps,
                r6.a_boton_panico,
                r6.n_vehiculos_act_btn,
                r6.p_vehiculos_servicio_c_gps
            from
            giz_resumen.giz_reporte06 r6 inner join giz.giz_ruta gr on gr.id_ruta=r6.id_ruta  inner join giz.giz_ett gett on gett.id_ett=r6.id_ett
            where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy') 
        )z    
        group by 
        z.id_ett,
        z.razon_social_empresa,
        z.cod_ett`, []);

        const resumen = await pg.query(`
        select 
        id,
        case
            when id = 1 then 'Alertas de Pánico y Porcentaje en las Empresas de Transporte registradas'
        end as concepto,
        case
            when id = 1 then 0
        end as n_alertas,
        case
            when id = 1 then 0
        end as porcentaje
        from generate_series(1, 1) as id`);
        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte6 = async (req, res) => {
    try {
        const sentido_1_2 = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gett.id_ett,
        round(g.v_autorizados,0) v_autorizados,
        round(g.longitud_rutas,0) longitud_rutas,
        g.n_completos_ett n_completos_ett,
        g.n_incompletos_ett n_incompletos_ett,
        g.km_recorridos_completos_12 km_recorridos_completos_12,
        g.km_recorridos_incompletos_12 km_recorridos_incompletos_12,
        g.total total_Km_Recorridos_S_12
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            sum(x.v_autorizados ) v_autorizados ,
            sum(x.longitud_rutas) longitud_rutas,
            sum(x.n_completos_ett) n_completos_ett,
            sum(x.n_incompletos_ett) n_incompletos_ett,
            sum(km_recorridos_completos_12) km_recorridos_completos_12,
            sum(km_recorridos_incompletos_12) km_recorridos_incompletos_12,
            sum(total) total
            from 
            (	
                select
                row_number() over(order by 1) id,
                x.id_ett ,
                avg(x.longitud_rutas ) longitud_rutas,
                avg(x.v_autorizados) v_autorizados,               
                sum(x.n_completos_ett) n_completos_ett,
                sum(x.n_incompletos_ett) n_incompletos_ett,
                sum(x.km_recorridos_con_ett) km_recorridos_completos_12,
                sum(x.km_recorridos_inc_ett) km_recorridos_incompletos_12,
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
                    --km_recorridos_inc_ett km_recorridos_inc_ett,
					n_incompletos_ett * longitud_rutas as km_recorridos_inc_ett,
                    tot_km_recorridos_s12 tot_km_recorridos_s12
                    from 
                    giz_resumen.giz_reporte07 r07
                    where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')   and sentido='1-2'
                    order by 2
                )x
                group by 
                x.id_ett,
                x.id_ruta
                order by 
                3 desc
            )x
            group by 
            x.id_ett
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett
        `, []);

        const sentido_2_1 = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gett.id_ett,
        round(g.v_autorizados,0) v_autorizados,
        round(g.longitud_rutas,0) longitud_rutas,
        g.n_completos_ett n_completos_ett,
        g.n_incompletos_ett n_incompletos_ett,
        g.km_recorridos_completos_12 km_recorridos_completos_21,
        g.km_recorridos_incompletos_12 km_recorridos_incompletos_21,
        g.total total_Km_Recorridos_S_21
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            sum(x.v_autorizados ) v_autorizados ,
            sum(x.longitud_rutas) longitud_rutas,
            sum(x.n_completos_ett) n_completos_ett,
            sum(x.n_incompletos_ett) n_incompletos_ett,
            sum(km_recorridos_completos_12) km_recorridos_completos_12,
            sum(km_recorridos_incompletos_12) km_recorridos_incompletos_12,
            sum(total) total
            from 
            (	
                select
                row_number() over(order by 1) id,
                x.id_ett ,
                avg(x.longitud_rutas ) longitud_rutas,
                avg(x.v_autorizados) v_autorizados,               
                sum(x.n_completos_ett) n_completos_ett,
                sum(x.n_incompletos_ett) n_incompletos_ett,
                sum(x.km_recorridos_con_ett) km_recorridos_completos_12,
                sum(x.km_recorridos_inc_ett) km_recorridos_incompletos_12,
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
                    --km_recorridos_inc_ett km_recorridos_inc_ett,
					n_incompletos_ett * longitud_rutas as km_recorridos_inc_ett,
                    tot_km_recorridos_s12 tot_km_recorridos_s12
                    from 
                    giz_resumen.giz_reporte07 r07
                    where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')   and sentido='2-1'
                    order by 2
                )x
                group by 
                x.id_ett,
                x.id_ruta
                order by 
                3 desc
            )x
            group by 
            x.id_ett
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Kilómetros recorridos en las Rutas de las Empresas de Transporte Registradasen el Sentido 1-2'
                when id = 2 then 'Kilómetros recorridos en las Rutas de las Empresas de Transporte Registradasen el Sentido 2-1'
                when id = 3 then 'Kilómetros recorridos en las Rutas de las Empresas de Transporte Registradas en ambos Sentidos'
            end as concepto,
            case
                when id = 1 then 0
                when id = 2 then 0
                when id = 3 then 0
            end as kilometraje
        from generate_series(1, 3) as id`, []);
        return res.status(200).send({
            sentido_1_2: camelcaseKeys(sentido_1_2),
            sentido_2_1: camelcaseKeys(sentido_2_1),
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
const reporte7 = async (req, res) => {
    try {
        const sentido_1_2 = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.id_ett,
        gett.razon_social_empresa,
        sum(g.nro_rutas) n_rutas,
        sum(g.v_autorizados) v_autorizados,
        sum(g.longitud_rutas) longitud_rutas,
        sum(g.n_paraderos_ruta) n_paraderos_ruta,
        sum(g.n_viajes_detenciones_100) n_viajes_detenciones_100,
        sum(g.n_viajes_detenciones_inc) n_viajes_detenciones_inc,
        sum(g.n_detenciones_paraderos) n_Detenciones_No_Realizadas_Paraderos,
        sum(g.porc_detenciones)*100 || '%' porc_Viajes_Detenciones_Paraderos_12
        from(
            select *
            ,case when ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc)<0 then 0 else ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc) end   n_detenciones_paraderos 
            ,case when (r.n_viajes_detenciones_inc+abs(((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc)))=0 
            		then 0 else 
            		 case when ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc)<0 then 0 else ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc) end /(r.n_viajes_detenciones_inc+case when ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc)<0 then 0 else ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc) end) 
            		end  porc_detenciones 
            from (
                select
                row_number() over(order by 1) id,
                x.id_ett ,
                (select count(*) from (
                    select a.id_ett,a.id_ruta from(
                        select 
                        *		
                        from 
                        giz_resumen.giz_reporte08 r08
                        where  to_date(to_char(r08.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')   and sentido='1-2' and id_ett=x.id_ett
                        )a
                        group by 
                        a.id_ett,a.id_ruta
                    )u
                    ) nro_rutas,
                sum(x.v_autorizados) v_autorizados,
                sum(x.longitud_rutas) longitud_rutas,
                sum(x.n_paraderos_ruta) n_paraderos_ruta,
                sum(x.n_viajes_detenciones_100) n_viajes_detenciones_100,
                sum(x.n_viajes_detenciones_inc) n_viajes_detenciones_inc
--                sum(abs((x.n_paraderos_ruta*x.n_viajes_detenciones_100)-x.n_viajes_detenciones_inc)) n_detenciones_paraderos,--corregir
--                round(abs(((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))::decimal/(sum(n_viajes_detenciones_inc)+(abs((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))))::decimal),2) porc_detenciones -- corregir
                from 
                (	
                    select 
                    id_ett,
                    id_ruta,
                    v_autorizados,
                    longitud_rutas,
                    n_paraderos_ruta,
                    n_viajes_detenciones_100,
                    n_viajes_detenciones_inc
                    from 
                    giz_resumen.giz_reporte08 r08
                    where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  and sentido='1-2'
                    order by 1,4
                )x
                group by 
                x.id_ett 
                order by 
                3 desc
                )r
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett
        group by 
        gett.razon_social_empresa,
        gett.id_ett
        `, []);

        const sentido_2_1 = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.id_ett,
        gett.razon_social_empresa,
        sum(g.nro_rutas) n_rutas,
        sum(g.v_autorizados) v_autorizados,
        sum(g.longitud_rutas) longitud_rutas,
        sum(g.n_paraderos_ruta) n_paraderos_ruta,
        sum(g.n_viajes_detenciones_100) n_viajes_detenciones_100,
        sum(g.n_viajes_detenciones_inc) n_viajes_detenciones_inc,
        sum(g.n_detenciones_paraderos) n_Detenciones_No_Realizadas_Paraderos,
        sum(g.porc_detenciones)*100 || '%' porc_Viajes_Detenciones_Paraderos_21
        from(
            select *
            ,case when ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc)<0 then 0 else ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc) end   n_detenciones_paraderos 
            ,case when (r.n_viajes_detenciones_inc+abs(((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc)))=0 
            		then 0 else 
            		 case when ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc)<0 then 0 else ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc) end /(r.n_viajes_detenciones_inc+case when ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc)<0 then 0 else ((r.n_paraderos_ruta*r.n_viajes_detenciones_100)-r.n_viajes_detenciones_inc) end) 
            		end  porc_detenciones 
            from (
                select
                row_number() over(order by 1) id,
                x.id_ett ,
                (select count(*) from (
                    select a.id_ett,a.id_ruta from(
                        select 
                        *		
                        from 
                        giz_resumen.giz_reporte08 r08
                        where  to_date(to_char(r08.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')   and sentido='2-1' and id_ett=x.id_ett
                        )a
                        group by 
                        a.id_ett,a.id_ruta
                    )u
                    ) nro_rutas,
                sum(x.v_autorizados) v_autorizados,
                sum(x.longitud_rutas) longitud_rutas,
                sum(x.n_paraderos_ruta) n_paraderos_ruta,
                sum(x.n_viajes_detenciones_100) n_viajes_detenciones_100,
                sum(x.n_viajes_detenciones_inc) n_viajes_detenciones_inc
--                sum(abs((x.n_paraderos_ruta*x.n_viajes_detenciones_100)-x.n_viajes_detenciones_inc)) n_detenciones_paraderos,--corregir
--                round(abs(((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))::decimal/(sum(n_viajes_detenciones_inc)+(abs((sum(x.n_paraderos_ruta)*sum(x.n_viajes_detenciones_100))-sum(x.n_viajes_detenciones_inc))))::decimal),2) porc_detenciones -- corregir
                from 
                (	
                    select 
                    id_ett,
                    id_ruta,
                    v_autorizados,
                    longitud_rutas,
                    n_paraderos_ruta,
                    n_viajes_detenciones_100,
                    n_viajes_detenciones_inc
                    from 
                    giz_resumen.giz_reporte08 r08
                    where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  and sentido='2-1'
                    order by 1,4
                )x
                group by 
                x.id_ett 
                order by 
                3 desc
                )r
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett
        group by 
        gett.razon_social_empresa,
        gett.id_ett
        `, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Detenciones de Vehículos en Paraderos y su Porcentaje en Sentido 1-2 en todas las Empresas de transporte registradas:'
                when id = 2 then 'Detenciones de Vehículos en Paraderos y su porcentaje en Sentido 2-1 en todas las Empresas de transporte registradas:'
                when id = 3 then 'Detenciones de Vehículos en Paraderos y su Porcentaje en ambos Sentido en todas las Empresas de transporte registradas:'
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
        return res.status(500).send({ message: error });
    }
}

const reporte8 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.id_ett id_ett,
        gett.cod_ett ||' '||gett.razon_social_empresa razon_social_empresa,
        g.km_recorridos_gps km_recorridos_gps,
		g.km_recorridos_ruta km_recorridos_ruta ,
        g.porc_km_recorridos_ruta_gps  porc_km_recorridos_ruta_gps
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            (sum(x.km_recorridos_gps)) km_recorridos_gps,
            (sum(x.km_recorridos_ruta)) km_recorridos_ruta,
            round(sum(x.km_recorridos_gps)::decimal/sum(x.km_recorridos_ruta)::decimal,2)*100 || '%' porc_km_recorridos_ruta_gps
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                km_recorridos_gps km_recorridos_gps,
                km_recorridos_ruta km_recorridos_ruta
                from 
                giz_resumen.giz_reporte09 r09
                where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
                and km_recorridos_gps!=0
                order by 2
            )x
            group by 
            x.id_ett
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Comparativo de Km Recorridos en Rutas vs. Km Recorridos según GPS, en ambos sentidos, en las todas Rutas de la totalidad de Empresas de Transporte registradas'
            end as concepto,
            case
                when id = 1 then 0
            end as kilometros,
            case
                when id = 1 then 0
            end as porcentaje
        from generate_series(1,1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte9 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.id_ett ,
        gett.cod_ett ||' '|| gett.razon_social_empresa razon_social_empresa,
        round(coalesce(g.km_recorridos,0),0) tot_Km_Recorridos,
        round(coalesce(g.pago_subsidio,0),0) pago_subsidio
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
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
                where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
                order by 2
            )x
            group by 
            x.id_ett
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett
        `, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Reporte de Kilómetros recorridos válidos para pago de Subsidios en todas las Rutas de la totalidad de Empresas de Transporte registradas'
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
            resumen: camelcaseKeys(resumen)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte10 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            row_number() over(order by 1) id,
            gett.id_ett,
            gett.razon_social_empresa,
            round(g.km_recorridos,0) tot_Km_Recorridos,
            round(g.km_recorridos_fuera,0) km_Recorridos_Fuera,
            case when g.km_recorridos=0 then '0' else round((g.km_recorridos_fuera/g.km_recorridos),2)*100  || '%' end as porc_Total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
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
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                order by 6
            )x
            group by 
            x.id_ett
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett=g.id_ett`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Kilómetros Recorridos fuera del Itinerario de todas las Rutas y en horario del Servicio de la totalidad de Empresas de Transporte registradas'
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
        return res.status(500).send({ message: error });
    }
}

const reporte11 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id
        ,gr.id_ett
        ,gett.razon_social_empresa 
        ,replace(justify_hours(sum(tiempo_sin_transmision_gps ))::text,' days ', ' dias ') tiempo_Sin_Transmision_Gps
        from giz.giz_resumen.giz_reporte13 gr
        inner join giz.giz_ett gett on gr.id_ett =gett.id_ett 
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        gr.id_ett
        ,gett.razon_social_empresa `, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Tiempo sin Transmisión del GPS en todas las Rutas de la totalidad de Empresas de Transporte registradas'
            end as concepto,
            case
            when id = 1 then 
            (select     
                replace(justify_hours(sum(tiempo_sin_transmision_gps ))::text,' days ', ' dias ') tiempo
                from giz.giz_resumen.giz_reporte13 gr
                    inner join giz.giz_ett gett on gr.id_ett =gett.id_ett 
                    where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy'))
                    end as tiempo
            from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}


const reporte12 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id
        ,gr.id_ett
        ,gett.razon_social_empresa 
        ,replace(justify_hours(sum(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo_Acu_Transmision_Gps
        from giz.giz_resumen.giz_reporte14 gr
        inner join giz.giz_ett gett on gr.id_ett =gett.id_ett 
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        gr.id_ett
        ,gett.razon_social_empresa `, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Tiempo Acumulado por los Vehículos de todas las Rutas, en la prestación del Servicio, de la totalidad de Empresas de Transportes registradas'
            end as concepto,
            case
            when id = 1 then 
            (select     
                replace(justify_hours(sum(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo
                from giz.giz_resumen.giz_reporte14 gr
                    inner join giz.giz_ett gett on gr.id_ett =gett.id_ett 
                    where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy'))
                    end as tiempo
            from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
const reporte13 = async (req, res) => {
    try {
        const detalle = await pg.query(`select * from giz_resumen.reporte_15_fnc('${req.params.inicio}', '${req.params.final}')`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte14 = async (req, res) => {
    try {
        const detalle = await pg.query(`      
        select 
                row_number() over(order by id_ett) id,
                razon_social_empresa,	
                id_ett id_ett,
                count(id_ruta) rutas,
                sum(placa_vehiculo) buses,
                sum(s_12) salidas_1_2,
                sum(v_in_12) viajes_incompletos_1_2,
                sum(v_c_12) viajes_completos_1_2,
                sum(s_21) salidas_2_1,
                sum(v_in_21) viajes_incompletos_2_1,
                sum(v_c_21) viajes_completos_2_1,
                round(sum(v_c_12)/sum(s_12)*100,2)||'%' porc_viajes_completos_1_2,
                round(sum(v_c_21)/sum(s_21)*100,2)||'%' porc_viajes_completos_2_1
                from (
                select 
            razon_social_empresa,	
                id_ett,
                id_ruta,
                count(*) placa_vehiculo,
                sum(s_12)s_12,
                sum(v_in_12)v_in_12,
                sum(v_c_12)v_c_12,
                sum(s_21)s_21,
                sum(v_in_21)v_in_21,
                sum(v_c_21)v_c_21,
                case when sum(v_c_12)!=0 then round((sum(v_c_12::decimal)/sum(s_12::decimal)),3) else 0 end p_c12,
                case when sum(v_c_21)!=0 then round((sum(v_c_21::decimal)/sum(s_21::decimal)),3) else 0 end  p_c21
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
                    where to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
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
                )c group by razon_social_empresa,id_ett,id_ruta
                order by 1,2
                )d group by razon_social_empresa,id_ett
                `, []);

        const resumen = await pg.query(`
        select 
        id,
        case
            when id = 1 then 'Viajes completos y Porcentaje en Sentido 1-2 de las Empresas de Transporte Registradas:'
            when id = 2 then 'Viajes completos y Porcentaje en Sentido 2-1 de las Empresas de Transporte Registradas:'
            when id = 3 then 'Viajes completos y Porcentaje en ambos Sentidos de las Empresas de Transporte Registradas:'
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
        return res.status(500).send({ message: error });
    }
}
