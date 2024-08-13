const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la consulta solicitado nivel empresas
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    if (!req.params.consultaId)
        return res.status(404).send({ message: "Debe enviar el parámetro consultaId" });

    const consultaId = parseInt(req.params.consultaId);
    if (consultaId === 1) return consulta1(req, res);
    if (consultaId === 2) return consulta2(req, res);
    if (consultaId === 3) return consulta3(req, res);
    if (consultaId === 4) return consulta4(req, res);
    if (consultaId === 5) return consulta5(req, res);
    if (consultaId === 6) return consulta6(req, res);
    if (consultaId === 7) return consulta7(req, res);
    if (consultaId === 8) return consulta8(req, res);
    if (consultaId === 9) return consulta9(req, res);
    if (consultaId === 10) return consulta10(req, res);
    if (consultaId === 11) return consulta11(req, res);
    if (consultaId === 12) return consulta12(req, res);
    if (consultaId === 14) return consulta14(req, res);
    if (consultaId === 15) return consulta15(req, res);
    if (consultaId === 16) return consulta16(req, res);
    if (consultaId === 18) return consulta18(req, res);
    if (consultaId === 19) return consulta19(req, res);
    if (consultaId === 20) return consulta20(req, res);
    if (consultaId === 21) return consulta21(req, res);
    if (consultaId === 22) return consulta22(req, res);
    if (consultaId === 23) return consulta23(req, res);
    if (consultaId === 24) return consulta24(req, res);

}

const consulta1 = async (req, res) => {
    try {
        const detalle = await pg.query(`       
        select
        row_number() over(order by 1) id
        ,tipo
        ,to_date(to_char(fecha_registro,'dd-mm-yyyy'),'dd-mm-yyyy') fecha
        ,count(*) cantidad
        from smlpr.sm_registros where estado='S' and tipo is not null
        group by 
        tipo
        ,to_date(to_char(fecha_registro,'dd-mm-yyyy'),'dd-mm-yyyy') 
        limit 2
        `, []);
        
        const detalleSem = await pg.query(`       
        select 
        row_number() over(order by 1) id
        ,tipo
        ,x.valor fecha
        ,count(*) cantidad
        from(
        select (extract(week from now())::text) ||(extract(year from now())::text) as valor union all
        select extract(week from now() - CAST('1 week' AS INTERVAL)) || extract(year from now() - CAST('1 week' AS INTERVAL))::text
        ) x
        inner join smlpr.sm_registros sm on extract(week from sm.fecha_registro)::text ||extract(year from sm.fecha_registro)::text = x.valor
        where estado='S' and tipo is not null and tipo <> ''
        group by
        tipo
        ,x.valor 
        `, []);

        const detalleMes = await pg.query(`       
        select 
        row_number() over(order by 1) id
        ,tipo
        ,x.valor fecha
        ,count(*) cantidad
        from(
            select to_char(now(), 'mm/yyyy') as valor union all
            select to_char(now() - CAST('1 month' AS INTERVAL), 'mm/yyyy')
        ) x
        inner join smlpr.sm_registros sm on to_char(sm.fecha_registro , 'mm/yyyy')::text = x.valor
        where estado='S' and tipo is not null and tipo <> ''
        group by
        tipo
        ,x.valor 
        `, []);

        const resumenDia = await pg.query(`       
        select
        x.valor
        , COUNT(case when sm.tipo = '1' then 'CHANCADORA' end) as chancadora
        ,COUNT(case when sm.tipo = '2' then 'DISPOSICION' end) as disposicion
        ,count(*) cantidad
        from(
             select to_char(now(), 'dd/mm/yyyy') as valor union all
             select to_char(now() - CAST('1 days' AS INTERVAL), 'dd/mm/yyyy')
            ) x inner join smlpr.sm_registros sm on to_char(sm.fecha_registro,'dd/mm/yyyy')=x.valor where estado='S' and tipo is not null
        group by 
        x.valor
        order by 
        x.valor
        `, []);

        const resumenSem = await pg.query(`       
        select
        x.valor
        , COUNT(case when sm.tipo = '1' then 'CHANCADORA' end) as chancadora
        ,COUNT(case when sm.tipo = '2' then 'DISPOSICION' end) as disposicion
        ,count(*) cantidad
        from(
        select extract(week from now())::text || ' - '::text ||extract(year from now())::text as valor union all
        select extract(week from now() - CAST('1 week' AS INTERVAL)) ||' - '::text || extract(year from now() - CAST('1 week' AS INTERVAL))::text
       ) x
       inner join smlpr.sm_registros sm on extract(week from sm.fecha_registro)::text ||' - '::text || extract(year from sm.fecha_registro)::text = x.valor 
       where estado='S' and tipo is not null and tipo <> ''
       group by
        x.valor
       order by
        x.valor
        `, []);

        const resumenMes = await pg.query(`       
        select
        x.valor
        , COUNT(case when sm.tipo = '1' then 'CHANCADORA' end) as chancadora
        ,COUNT(case when sm.tipo = '2' then 'DISPOSICION' end) as disposicion
        ,count(*) cantidad
       from(
        select to_char(now(), 'mm/yyyy') as valor union all
        select to_char(now() - CAST('1 month' AS INTERVAL), 'mm/yyyy')
       ) x
       inner join smlpr.sm_registros sm on to_char(sm.fecha_registro, 'mm/yyyy') = x.valor
       where estado='S' and tipo is not null and tipo <> ''
       group by
        x.valor
       order by
        x.valor
        `, []);


        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            detalleSem: camelcaseKeys(detalleSem),
            detalleMes: camelcaseKeys(detalleMes),
            resumenDia: camelcaseKeys(resumenDia),
            resumenSem: camelcaseKeys(resumenSem),
            resumenMes: camelcaseKeys(resumenMes)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta2 = async (req, res) => {
    try {

        // const detalle = await pg.query(`       
        // select 
        //     a.cod_constancia id
        //     ,a.constructora 
        //     ,a.transportista razon_social
        //     ,a.nombre_obra nombre_obra
        //     ,a.fecha_inicio fecha_inicial
        //     ,a.fecha_fin fecha_final
        //     ,a.fecha_registro fechaConstancia
        //     ,a.viajes viaje
        //     ,a.m3 
        //     ,a."CHECK" check
        // from smlpr.sm_constancias a order by 1 desc limit 30    
        
        // `, []);
        const detalle = await pg.query(`select * from smlpr.sm_tmp_constancias where estado='G' and  to_date(v_fecha_constancia,'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy') `, []);
        // console.log(detalle);
        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta3 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select a.*, b.* from (
                    select hi.*,em.razon_social_empresa, em.ruc_ett  from smlpr.sm_historia hi inner join 
                    smlpr.sm_empresas em on em.id=hi.id_empresa::integer
                    where to_date(fecha_genera,'dd-mm-yyyy') =to_date('${req.params.inicio}','dd-mm-yyyy') 
                )a left join (        
                    select id_ett, ruta from smlpr.sm_generados_diario a where 
                    ruta!='' 
                    and fecha_registro::date =to_date('${req.params.inicio}','dd-mm-yyyy')
                    group by id_ett,ruta  
                            )b on a.id_empresa::integer=b.id_ett::integer
    
        `, []);


        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta4 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.id_ett,
        gett.cod_ett,
        gett.razon_social_empresa,
        round(g.km_recorridos,0) tot_Km_Recorridos,
        round(g.km_recorridos_fuera,0) km_Recorridos_Fuera,
        case when g.km_recorridos=0 then '0' else round((g.km_recorridos_fuera/g.km_recorridos),2)*100 || '%' end as porc_Total 
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

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta5 = async (req, res) => {
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
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta6 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1 ) id,
        id_ett, 
        razon_social_empresa, 
        round(avg(detencion),0) as detencion, 
        round(avg(no_detencion),0) as no_detencion,
        round(avg(no_detencion) / avg(detencion)::numeric, 2)*100 || '%' as porc_no_detencion
    from giz_resumen.giz_consulta6
    where to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
    group by 
        id_ett, 
        razon_social_empresa`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta7 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1 ) id,
        id_ett, 
        razon_social_empresa, 
        round(avg(detencion),0) as detencion, 
        round(avg(no_detencion),0) as no_detencion,
        round(avg(no_detencion) / avg(detencion)::numeric, 2)*100 || '%' as porc_no_detencion
    from giz_resumen.giz_consulta6
    where to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
    group by 
        id_ett, 
        razon_social_empresa`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta8 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            row_number() over(order by 1) id,
            id_ett, 
            razon_social_empresa, 
            count(case when dia_semana = 1 then 1 end) as lun,
            count(case when dia_semana = 2 then 1 end) as mar,
            count(case when dia_semana = 3 then 1 end) as mie,
            count(case when dia_semana = 4 then 1 end) as jue,
            count(case when dia_semana = 5 then 1 end) as vie,
            count(case when dia_semana = 6 then 1 end) as sab,
            count(case when dia_semana = 0 then 1 end) as dom,
            count(*) as total
        from giz_resumen.giz_consulta8
        where to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
        group by 
        id_ett, 
        razon_social_empresa`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta9 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        id_ett, 
        razon_social_empresa, 
        count(case when hora_dia between 0 and 6 then 1 end) as h_0_6,
        count(case when hora_dia between 7 and 13 then 1 end) as h_7_13,
        count(case when hora_dia between 14 and 20 then 1 end) as h_14_20,
        count(case when hora_dia between 21 and 23 then 1 end) as h_21_23,
        count(*) as total
        from giz_resumen.giz_consulta9
        where to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
        group by 
        id_ett, 
        razon_social_empresa`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta10 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
                row_number() over(order by id_ett) id,
                id_ett, 
                razon_social_empresa, 
                coalesce(sum(detencion),0) as detencion, 
                coalesce(sum(no_detencion),0) as no_detencion,
                case when sum(detencion)=0 then '0' else round(sum(no_detencion) / sum(detencion)::numeric, 2)*100 || '%' end as porc_no_detencion
            from giz_resumen.giz_consulta10
            where to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
            group by 
                id_ett, 
                razon_social_empresa`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta11 = async (req, res) => {
    try {
        const detalle = await pg.query(`       
        select 
        row_number() over(order by 6 desc) id
        ,*
        ,row_number() over(order by 6 desc) rank
        from (
        select 
        r07.id_ett
        ,gett.cod_ett
        ,gett.razon_social_empresa
        ,count(distinct(r07.placa_vehiculo)) cantidad
        ,sum(r07.tot_km_recorridos_s12) km_recorridos
        ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                )::decimal)*100,0) || '%' porc_Total
        from giz_resumen.giz_reporte07 r07
        inner join giz.giz_ett gett on r07.id_ett= gett.id_ett
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        r07.id_ett 
        ,gett.razon_social_empresa 
        ,gett.cod_ett
        order by 6 desc
        )a`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta12 = async (req, res) => {
    try {
        const detalle = await pg.query(`       
        select 
        id_ett, 
        razon_social_empresa, 
        count(case when velocidad = 0 then 1 end) as vel_0,
        count(case when velocidad between 1 and 30 then 1 end) as vel_1_30,
        count(case when velocidad between 31 and 60 then 1 end) as vel_31_60,
        count(case when velocidad between 60 and 90 then 1 end) as vel_60_90,
        count(case when velocidad > 90 then 1 end) as vel_m90,
        count(*) as total
        from giz_resumen.giz_consulta12
        where  to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        id_ett, 
        razon_social_empresa
        `, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta14 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id
        ,gr.id_ett
        ,gett.razon_social_empresa 
        ,replace(justify_hours(sum(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo_Acu_Transmision_Gps
        ,count(distinct gr.placa_vehiculo) vehiculos
        from giz.giz_resumen.giz_reporte14 gr
        inner join giz.giz_ett gett on gr.id_ett =gett.id_ett 
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        gr.id_ett
        ,gett.razon_social_empresa 
            `, []);

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

const consulta15 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id
        ,gr.id_ett
        ,gett.razon_social_empresa 
        ,replace(justify_hours(avg(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo_Acu_Transmision_Gps
        ,count(distinct gr.placa_vehiculo) vehiculos
        from giz.giz_resumen.giz_reporte14 gr
        inner join giz.giz_ett gett on gr.id_ett =gett.id_ett 
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        gr.id_ett
        ,gett.razon_social_empresa 
            `, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Tiempo Acumulado por los Vehículos de todas las Rutas, en la prestación del Servicio, de la totalidad de Empresas de Transportes registradas'
            end as concepto,
            case
            when id = 1 then 
            (select     
                replace(justify_hours(avg(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo
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
const consulta16 = async (req, res) => {
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
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
const consulta18 = async (req, res) => {
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
        ,gett.razon_social_empresa 
            `, []);

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
const consulta19 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select  
        row_number() over(order by 1) id,
        t.cod_ett,
        t.id_ett,
        t.razon_social_empresa razon_social_empresa,
        count(*) cantidad,
        round(avg(ano)::decimal,0) pro_antiguedad_servicio
        from(
            select 
            gf.id_municipalidad,
            gett.id_ett,
            gett.cod_ett,
            gett.razon_social_empresa,
            gf.id_ruta,
            gf.placa_vehiculo,
            gv.afabricacion_vehiculo,
            extract(YEAR from now())-gv.afabricacion_vehiculo::numeric ano
            --to_char(gv.afabricacion_vehiculo,'yyyy')
            from giz.giz_vehiculo gv inner join giz.giz_flotavehiculos gf on gv.placa_vehiculo=gf.placa_vehiculo_referencia inner join giz.giz_ett gett on gf.id_ett=gett.id_ett 
           where  gv.afabricacion_vehiculo !='' and gv.id_estado_vehiculo='1'
            )t
        group by 
         t.cod_ett,
        t.id_ett,
        t.razon_social_empresa
	    having
        avg(ano)>0
        order by 1
            `, []);


        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta20 = async (req, res) => {
    try {
        const detalle = await pg.query(`       
        select 
        row_number() over(order by 1) id
        ,r07.id_ett
        ,gett.cod_ett
        ,gett.razon_social_empresa
        ,count(distinct(r07.placa_vehiculo)) cantidad
        ,sum(r07.tot_km_recorridos_s12) km_recorridos
        ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                )::decimal)*100,0) || '%' porc_Total
        from giz_resumen.giz_reporte07 r07
        inner join giz.giz_ett gett on r07.id_ett= gett.id_ett
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        r07.id_ett 
        ,gett.razon_social_empresa 
        ,gett.cod_ett`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta21 = async (req, res) => {
    try {
        const detalle = await pg.query(`       
        select 
        row_number() over(order by 1) id
        ,r07.id_ett
        ,gett.cod_ett
        ,gett.razon_social_empresa
        ,count(distinct(r07.placa_vehiculo)) cantidad
        ,round(avg(r07.tot_km_recorridos_s12),2) km_recorridos
        ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                )::decimal)*100,0) || '%' porc_Total
        from giz_resumen.giz_reporte07 r07
        inner join giz.giz_ett gett on r07.id_ett= gett.id_ett
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        r07.id_ett 
        ,gett.razon_social_empresa 
        ,gett.cod_ett`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta22 = async (req, res) => {
    try {

        const detalle = await pg.query(`       
        select 
        row_number() over(order by 1) id,
        a.id_ett,
        a.cod_ett,
        a.razon_social_empresa,
        b.v_servicio,
        a.v_autorizados
            from(
                select 
                fv.id_ett,
                gett.cod_ett,
                gett.razon_social_empresa,
                count(*) v_autorizados
                from 
                giz.giz_flotavehiculos fv 
                inner join giz.giz_ett gett on fv.id_ett=gett.id_ett
                inner join giz.giz_vehiculo gv on fv.placa_vehiculo=gv.placa_vehiculo
                where gv.id_estado_vehiculo=1
                group by
                fv.id_ett,
                gett.cod_ett,
                gett.razon_social_empresa
                )a 
            left join 
                (
                select 
                    fv.id_ett,
                    gett.cod_ett,
                    gett.razon_social_empresa,
                    count(*) v_servicio
                from (
                    select 
                    placa_vehiculo
                    from 
                    giz.giz_transmision  gt
                    where  to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                    group by 
                    placa_vehiculo
                    )gt
                    inner join giz.giz_flotavehiculos fv on gt.placa_vehiculo=fv.placa_vehiculo_referencia
                    inner join giz.giz_ett gett on gett.id_ett=fv.id_ett
                    inner join giz.giz_vehiculo gv on gv.placa_vehiculo=fv.placa_vehiculo
                    where gett.id_estado_ett=1 
                    and gv.id_estado_vehiculo=1
                    group by
                    fv.id_ett,
                    gett.cod_ett,
                    gett.razon_social_empresa
                )b on a.id_ett=b.id_ett
        order by 4 desc`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta23 = async (req, res) => {
    try {
        const detalle = await pg.query(`       
        select 
        row_number() over(order by 6 desc) id
        ,*
        ,row_number() over(order by 6 desc) rank
        from (
        select 
        r07.id_ett
        ,gett.cod_ett
        ,gett.razon_social_empresa
        ,count(distinct(r07.placa_vehiculo)) cantidad
        ,max(r07.tot_km_recorridos_s12) km_recorridos
        ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                )::decimal)*100,0) || '%' porc_Total
        from giz_resumen.giz_reporte07 r07
        inner join giz.giz_ett gett on r07.id_ett= gett.id_ett
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        r07.id_ett 
        ,gett.razon_social_empresa 
        ,gett.cod_ett
        order by 6 desc
        )a`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta24 = async (req, res) => {
    try {
        const detalle = await pg.query(`       
        select 
        row_number() over(order by 6 desc) id
        ,*
        ,row_number() over(order by 6 desc) rank
        from (
        select 
        r07.id_ett
        ,gett.cod_ett
        ,gett.razon_social_empresa
        ,count(distinct(r07.placa_vehiculo)) cantidad
        ,sum(r07.tot_km_recorridos_s12) km_recorridos
        ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                )::decimal)*100,0) || '%' porc_Total
        from giz_resumen.giz_reporte07 r07
        inner join giz.giz_ett gett on r07.id_ett= gett.id_ett
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by 
        r07.id_ett 
        ,gett.razon_social_empresa 
        ,gett.cod_ett
        order by 6 desc
        )a`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}


