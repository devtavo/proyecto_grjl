const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la consulta solicitado nivel de rutas
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    if (!req.params.consultaId)
        return res.status(404).send({ message: "Debe enviar el parámetro consultaId" });

    if (!req.params.empresaId)
        return res.status(404).send({ message: "Debe enviar el parámetro empresaId" });

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
        ,r07.id_ruta
        ,gr.codigo_ruta 
        ,sum(r07.tot_km_recorridos_s12) km_recorridos
        ,count(distinct(r07.placa_vehiculo)) cantidad
        ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                )::decimal)*100,0) || '%' porc_Total
        from giz_resumen.giz_reporte07 r07
        inner join giz.giz_ruta gr on r07.id_ruta= gr.id_ruta
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        and gr.estado='1' and r07.id_ett='${req.params.empresaId}'
        group by 
        r07.id_ruta 
        ,gr.codigo_ruta`, []);


        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta2 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
                row_number() over(order by 1) id,
                a.id_ruta,
                a.codigo_ruta,
                coalesce(b.v_servicio,0) v_servicio,
                coalesce(a.v_autorizados,0) v_autorizados
                    from(
                        select 
                        fv.id_ruta,
                        gr.codigo_ruta,
                        count(*) v_autorizados
                        from 
                        giz.giz_flotavehiculos fv 
                        inner join giz.giz_ruta gr on fv.id_ruta=gr.id_ruta
                        inner join giz.giz_vehiculo gv on fv.placa_vehiculo=gv.placa_vehiculo
                        where gv.id_estado_vehiculo=1
                        and gr.estado='1' and fv.id_ett='${req.params.empresaId}'
                        group by
                        fv.id_ruta,
                        gr.codigo_ruta
                        )a 
                    left join 
                        (
                        select 
                            fv.id_ruta,
                            gr.codigo_ruta,
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
                            inner join giz.giz_ruta gr on gr.id_ruta=fv.id_ruta
                            inner join giz.giz_vehiculo gv on gv.placa_vehiculo=fv.placa_vehiculo
                            where gr.estado='1' and fv.id_ett='${req.params.empresaId}'
                            and gv.id_estado_vehiculo=1
                            group by
                            fv.id_ruta,
                            gr.codigo_ruta
                        )b on a.id_ruta=b.id_ruta
                order by 4 desc`, []);


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
        select 
        row_number() over(order by 1) id,
        gr.id_ruta,
        gr.codigo_ruta,
        x.cantidad,
        x.pro_antiguedad_servicio
        from(
        select 
        u.id_ruta id_ruta,
        count(*) cantidad,
        round(avg(u.ano)::decimal,0) pro_antiguedad_servicio
        from(
            select 
            gf.id_municipalidad,
            gf.id_ett,
            gf.id_ruta,
            gf.placa_vehiculo,
            gv.afabricacion_vehiculo,
            extract(YEAR from now())-gv.afabricacion_vehiculo::numeric ano
            from giz.giz_vehiculo gv inner join giz.giz_flotavehiculos gf on gv.placa_vehiculo=gf.placa_vehiculo
            where gv.afabricacion_vehiculo !='' and gv.id_estado_vehiculo='1'
            and gf.id_ett='${req.params.empresaId}'

        )u
        group by 
        u.id_ruta
        )x inner join giz.giz_ruta gr on x.id_ruta=gr.id_ruta
        where x.pro_antiguedad_servicio is not null`, []);

        const subquery = ` 
        select 
        row_number() over(order by 1) id,
        gr.codigo_ruta,
        x.cantidad,
        x.pro_antiguedad_servicio
        from(
        select 
        u.id_ruta id_ruta,
        count(*) cantidad,
        round(avg(u.ano)::decimal,0) pro_antiguedad_servicio
        from(
            select 
            gf.id_municipalidad,
            gf.id_ett,
            gf.id_ruta,
            gf.placa_vehiculo,
            gv.afabricacion_vehiculo,
            extract(YEAR from now())-gv.afabricacion_vehiculo::numeric ano
            from giz.giz_vehiculo gv inner join giz.giz_flotavehiculos gf on gv.placa_vehiculo=gf.placa_vehiculo
            where gf.id_ett='${req.params.empresaId}' and gv.afabricacion_vehiculo !=''

        )u
        group by 
        u.id_ruta
        )x inner join giz.giz_ruta gr on x.id_ruta=gr.id_ruta
        where x.pro_antiguedad_servicio is not null`;

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'column' as type) t) as chart,
                (select row_to_json(t) from(select 'Promedio de Antigüedad de Vehículos en Servicio de las Empresas de Transporte del Sistema (Años)' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.codigo_ruta) AS categories) t) as \"xAxis\",
                (select row_to_json(t) from (select row_to_json(t) as title from(select 'Cantidad de Años' as text) t) t) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                select
                    array_to_json(array_agg(x)) as series
                from(      
                select 'Rutas' as name,JSON_AGG(x.pro_antiguedad_servicio) as data
                ) x
                )
            from(
                ${subquery}
                ) x
        ) x`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            chart: camelcaseKeys(chart[0].options)
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
          gr.id_ruta
        `, []);

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
        row_number() over(order by 1) id,
        a.id_ruta,
        gr.codigo_ruta ,
        a.detencion,
        a.no_detencion,
        a.porc_no_detencion
        from (
            select  
                id_ett,
                id_ruta,
                sum(detencion) as detencion, 
                sum(no_detencion) as no_detencion,
                case when sum(detencion)=0 then 0 else round(sum(no_detencion) / sum(detencion)::numeric, 2)*100  end || '%' porc_no_detencion
                from giz_resumen.giz_consulta6 
            where
                id_ett = '${req.params.empresaId}'
                and to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  

            group by
            id_ett,
                id_ruta
                order by 1
        ) a inner join giz.giz_ruta gr on gr.id_ruta=a.id_ruta
                    
            `, []);

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
        row_number() over(order by 1) id,
        a.id_ruta,
        gr.codigo_ruta ,
        a.detencion,
        a.no_detencion,
        a.porc_no_detencion
        from (
            select  
                id_ett,
                id_ruta,
                sum(detencion) as detencion, 
                sum(no_detencion) as no_detencion,
                case when sum(detencion)=0 then 0 else round(sum(no_detencion) / sum(detencion)::numeric, 2)*100  end || '%' porc_no_detencion
                from giz_resumen.giz_consulta6 
            where
                id_ett = '${req.params.empresaId}'
                and to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  

            group by
            id_ett,
                id_ruta
                order by 1
        ) a inner join giz.giz_ruta gr on gr.id_ruta=a.id_ruta
                    
            `, []);

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
            id_ruta,
            glosa_ruta codigo_ruta,
            count(case when dia_semana = 1 then 1 end) as lun,
            count(case when dia_semana = 2 then 1 end) as mar,
            count(case when dia_semana = 3 then 1 end) as mie,
            count(case when dia_semana = 4 then 1 end) as jue,
            count(case when dia_semana = 5 then 1 end) as vie,
            count(case when dia_semana = 6 then 1 end) as sab,
            count(case when dia_semana = 0 then 1 end) as dom,
            count(*) as total
        from giz_resumen.giz_consulta8 
        where
            id_ett = '${req.params.empresaId}'
            and to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
            group by
            id_ruta,
            glosa_ruta                    
            `, []);

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
        id_ruta,
        glosa_ruta codigo_ruta,
        count(case when hora_dia between 0 and 6 then 1 end) as h_0_6,
        count(case when hora_dia between 7 and 13 then 1 end) as h_7_13,
        count(case when hora_dia between 14 and 20 then 1 end) as h_14_20,
        count(case when hora_dia between 21 and 23 then 1 end) as h_21_23,
        count(*) as total
    from giz_resumen.giz_consulta9 
    where
        id_ett = '${req.params.empresaId}'
        and to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
    group by
        id_ruta,
        glosa_ruta                    
            `, []);

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
            id_ruta,
            glosa_ruta codigo_ruta,
            coalesce(sum(detencion),0) as detencion, 
            coalesce(sum(no_detencion),0) as no_detencion,
            case when sum(detencion)=0 then '0' else round(coalesce(sum(no_detencion),0) / coalesce(sum(detencion),0)::numeric, 2)*100 || '%' end as porc_no_detencion
        from giz_resumen.giz_consulta10 
        where
            id_ett = '${req.params.empresaId}'
            and to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')  
        group by
            id_ruta,
            glosa_ruta`, []);
   
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
        row_number() over(order by 3 desc) id
        ,*
        ,row_number() over(order by 3 desc ) rank
        from(
                select 
                r07.id_ruta
                ,gr.codigo_ruta 
                ,round(sum(r07.tot_km_recorridos_s12),2) km_recorridos
                ,count(distinct(r07.placa_vehiculo)) cantidad
                ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                        select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                        )::decimal)*100,0) || '%' porc_Total
                from giz_resumen.giz_reporte07 r07
                inner join giz.giz_ruta gr on r07.id_ruta= gr.id_ruta
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                and gr.estado='1' and r07.id_ett='${req.params.empresaId}'
                group by 
                r07.id_ruta 
                ,gr.codigo_ruta
                order by 3 desc
                )a
                
        `, []);


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
            row_number() over(order by 1) id,
            id_ruta,
            glosa_ruta codigo_ruta,
            count(case when velocidad = 0 then 1 end) as vel_0,
            count(case when velocidad between 1 and 30 then 1 end) as vel_1_30,
            count(case when velocidad between 31 and 60 then 1 end) as vel_31_60,
            count(case when velocidad between 60 and 90 then 1 end) as vel_60_90,
            count(case when velocidad > 90 then 1 end) as vel_m90,
            count(*) as total
        from giz_resumen.giz_consulta12 
        where
            id_ett = '${req.params.empresaId}'
            and to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        group by
            id_ruta,
            glosa_ruta
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
        ,r14.id_ruta
        ,gr.codigo_ruta 
        ,replace(justify_hours(sum(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo_Acu_Transmision_Gps 
        ,count(distinct r14.placa_vehiculo) vehiculos
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


const consulta15 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id
        ,r14.id_ruta
        ,gr.codigo_ruta 
        ,replace(justify_hours(avg(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo_Acu_Transmision_Gps 
        ,count(distinct r14.placa_vehiculo) vehiculos
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
            (select replace(justify_hours(avg(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo 
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

const consulta16 = async (req, res) => {
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
const consulta19 = async (req, res) => {
    try {
        const detalle = await pg.query(` 
        select 
        row_number() over(order by 1) id,
        gr.id_ruta,
        gr.codigo_ruta,
        x.cantidad,
        x.pro_antiguedad_servicio
        from(
        select 
        u.id_ruta id_ruta,
        count(*) cantidad,
        round(avg(u.ano)::decimal,0) pro_antiguedad_servicio
        from(
            select 
            gf.id_municipalidad,
            gf.id_ett,
            gf.id_ruta,
            gf.placa_vehiculo,
            gv.afabricacion_vehiculo,
            extract(YEAR from now())-gv.afabricacion_vehiculo::numeric ano
            from giz.giz_vehiculo gv inner join giz.giz_flotavehiculos gf on gv.placa_vehiculo=gf.placa_vehiculo
            where gv.afabricacion_vehiculo !='' and gv.id_estado_vehiculo='1'
            and gf.id_ett='${req.params.empresaId}'

        )u
        group by 
        u.id_ruta
        )x inner join giz.giz_ruta gr on x.id_ruta=gr.id_ruta
        where x.pro_antiguedad_servicio is not null`, []);

        const subquery = ` 
        select 
        row_number() over(order by 1) id,
        gr.codigo_ruta,
        x.cantidad,
        x.pro_antiguedad_servicio
        from(
        select 
        u.id_ruta id_ruta,
        count(*) cantidad,
        round(avg(u.ano)::decimal,0) pro_antiguedad_servicio
        from(
            select 
            gf.id_municipalidad,
            gf.id_ett,
            gf.id_ruta,
            gf.placa_vehiculo,
            gv.afabricacion_vehiculo,
            extract(YEAR from now())-gv.afabricacion_vehiculo::numeric ano
            from giz.giz_vehiculo gv inner join giz.giz_flotavehiculos gf on gv.placa_vehiculo=gf.placa_vehiculo
            where gf.id_ett='${req.params.empresaId}' and gv.afabricacion_vehiculo !=''

        )u
        group by 
        u.id_ruta
        )x inner join giz.giz_ruta gr on x.id_ruta=gr.id_ruta
        where x.pro_antiguedad_servicio is not null`;

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'column' as type) t) as chart,
                (select row_to_json(t) from(select 'Promedio de Antigüedad de Vehículos en Servicio de las Empresas de Transporte del Sistema (Años)' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.codigo_ruta) AS categories) t) as \"xAxis\",
                (select row_to_json(t) from (select row_to_json(t) as title from(select 'Cantidad de Años' as text) t) t) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                select
                    array_to_json(array_agg(x)) as series
                from(      
                select 'Rutas' as name,JSON_AGG(x.pro_antiguedad_servicio) as data
                ) x
                )
            from(
                ${subquery}
                ) x
        ) x`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            chart: camelcaseKeys(chart[0].options)
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
        ,r07.id_ruta
        ,gr.codigo_ruta 
        ,sum(r07.tot_km_recorridos_s12) km_recorridos
        ,count(distinct(r07.placa_vehiculo)) cantidad
        ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                )::decimal)*100,0) || '%' porc_Total
        from giz_resumen.giz_reporte07 r07
        inner join giz.giz_ruta gr on r07.id_ruta= gr.id_ruta
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        and gr.estado='1' and r07.id_ett='${req.params.empresaId}'
        group by 
        r07.id_ruta 
        ,gr.codigo_ruta`, []);


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
        ,r07.id_ruta
        ,gr.codigo_ruta 
        ,round(avg(r07.tot_km_recorridos_s12),2) km_recorridos
        ,count(distinct(r07.placa_vehiculo)) cantidad
        ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                )::decimal)*100,0) || '%' porc_Total
        from giz_resumen.giz_reporte07 r07
        inner join giz.giz_ruta gr on r07.id_ruta= gr.id_ruta
        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
        and gr.estado='1' and r07.id_ett='${req.params.empresaId}'
        group by 
        r07.id_ruta 
        ,gr.codigo_ruta`, []);


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
                a.id_ruta,
                a.codigo_ruta,
                coalesce(b.v_servicio,0) v_servicio,
                coalesce(a.v_autorizados,0) v_autorizados
                    from(
                        select 
                        fv.id_ruta,
                        gr.codigo_ruta,
                        count(*) v_autorizados
                        from 
                        giz.giz_flotavehiculos fv 
                        inner join giz.giz_ruta gr on fv.id_ruta=gr.id_ruta
                        inner join giz.giz_vehiculo gv on fv.placa_vehiculo=gv.placa_vehiculo
                        where gv.id_estado_vehiculo=1
                        and gr.estado='1' and fv.id_ett='${req.params.empresaId}'
                        group by
                        fv.id_ruta,
                        gr.codigo_ruta
                        )a 
                    left join 
                        (
                        select 
                            fv.id_ruta,
                            gr.codigo_ruta,
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
                            inner join giz.giz_ruta gr on gr.id_ruta=fv.id_ruta
                            inner join giz.giz_vehiculo gv on gv.placa_vehiculo=fv.placa_vehiculo
                            where gr.estado='1' and fv.id_ett='${req.params.empresaId}'
                            and gv.id_estado_vehiculo=1
                            group by
                            fv.id_ruta,
                            gr.codigo_ruta
                        )b on a.id_ruta=b.id_ruta
                order by 4 desc`, []);


        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const consulta23= async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 3 desc) id
        ,*
        ,row_number() over(order by 3 desc ) rank
        from(
                select 
                r07.id_ruta
                ,gr.codigo_ruta 
                ,round(max(r07.tot_km_recorridos_s12),2) km_recorridos
                ,count(distinct(r07.placa_vehiculo)) cantidad
                ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                        select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                        )::decimal)*100,0) || '%' porc_Total
                from giz_resumen.giz_reporte07 r07
                inner join giz.giz_ruta gr on r07.id_ruta= gr.id_ruta
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                and gr.estado='1' and r07.id_ett='${req.params.empresaId}'
                group by 
                r07.id_ruta 
                ,gr.codigo_ruta
                order by 3 desc
                )a
                
        `, []);


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
        row_number() over(order by 3 desc) id
        ,*
        ,row_number() over(order by 3 desc ) rank
        from(
                select 
                r07.id_ruta
                ,gr.codigo_ruta 
                ,round(sum(r07.tot_km_recorridos_s12),2) km_recorridos
                ,count(distinct(r07.placa_vehiculo)) cantidad
                ,round((sum(r07.tot_km_recorridos_s12::decimal)/(
                        select sum(r07.tot_km_recorridos_s12) from giz_resumen.giz_reporte07 r07
                        where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                        )::decimal)*100,0) || '%' porc_Total
                from giz_resumen.giz_reporte07 r07
                inner join giz.giz_ruta gr on r07.id_ruta= gr.id_ruta
                where  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                and gr.estado='1' and r07.id_ett='${req.params.empresaId}'
                group by 
                r07.id_ruta 
                ,gr.codigo_ruta
                order by 3 desc
                )a
                
        `, []);


        return res.status(200).send({
            detalle: camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}




