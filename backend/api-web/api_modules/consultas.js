const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');

/**
 * Retorna la lista de consultas
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {
    try {
        const consulta = await pg.query(`
        select
            id,
            case
            when id = 2 then 'Constancia de Reaprovechamiento Generadas'
            when id = 3 then 'Reporte General de ingreso Diario'
            end as name
        from generate_series(2, 3) as id`, []);
        return res.status(200).send(camelcaseKeys(consulta));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Detalle de una consulta
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.get = async (req, res) => {
    try {
        let sql = '';
        const consultaId = parseInt(req.params.consultaId);
        const ettId = req.query.ettId;
        const rutaId = req.query.rutaId;
        const fechaInicio= req.query.fechaInicio;
        const fechaFinal= req.query.fechaFinal;

        if (!req.params.consultaId)
            return res.status(404).send({ message: "Debe enviar el id de la alerta" });

        if(consultaId===2){
            sql=`
            truncate table giz_resumen.tmp_consulta2;
 
            insert into giz_resumen.tmp_consulta2 
            select * from giz.giz_transmision where to_date(to_char(fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy')= to_date(${fechaInicio},'dd-mm-yyyy');
            
            select 
            row_to_json(c2) as consulta 
            from (
                select 
                a.id_ett,
                a.razon_social_empresa,
                b.v_servicio,
                a.v_autorizados
                    from(
                        select 
                        fv.id_ett,
                        gett.razon_social_empresa,
                        count(*) v_autorizados
                        from 
                        giz.giz_flotavehiculos fv 
                        inner join giz.giz_ett gett on fv.id_ett=gett.id_ett
                        group by
                        fv.id_ett,
                        gett.razon_social_empresa
                        )a 
                    left join 
                        (
                        select 
                            fv.id_ett,
                            gett.razon_social_empresa,
                            count(*) v_servicio
                        from (
                            select 
                            placa_vehiculo
                            from 
                            giz.giz_transmision  gt
                            where to_date(to_char(gt.fecha_emv,'dd-mm-yyyy'),'dd-mm-yyyy') =to_date(${fechaInicio},'dd-mm-yyyy') 
                            group by 
                            placa_vehiculo
                            )gt
                            inner join giz.giz_flotavehiculos fv on gt.placa_vehiculo=fv.placa_vehiculo_referencia
                            inner join giz.giz_ett gett on gett.id_ett=fv.id_ett
                            group by
                            fv.id_ett,
                            gett.razon_social_empresa
                        )b on a.id_ett=b.id_ett
                order by 4 desc
                )c2;
            `;
        }    
        //Consulta 4
        if (consultaId === 4) {
            sql = `
            select 
                id_ett, 
                razon_social_empresa, 
                round(sum(km_en_ruta)::numeric, 2) as km_en_ruta, 
                round(sum(km_fuera_ruta)::numeric, 2) as km_fuera_ruta,
                round(((sum(km_fuera_ruta) / (sum(km_en_ruta) + sum(km_fuera_ruta))) * 100)::numeric, 2) as porc_fuera_ruta
            from giz_resumen.giz_consulta4 
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    round(sum(km_en_ruta)::numeric, 2) as km_en_ruta, 
                    round(sum(km_fuera_ruta)::numeric, 2) as km_fuera_ruta,
                    round(((sum(km_fuera_ruta) / (sum(km_en_ruta) + sum(km_fuera_ruta))) * 100)::numeric, 2) as porc_fuera_ruta
                from giz_resumen.giz_consulta4
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    round(sum(km_en_ruta)::numeric, 2) as km_en_ruta, 
                    round(sum(km_fuera_ruta)::numeric, 2) as km_fuera_ruta,
                    round(((sum(km_fuera_ruta) / (sum(km_en_ruta) + sum(km_fuera_ruta))) * 100)::numeric, 2) as porc_fuera_ruta
                from giz_resumen.giz_consulta4
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 6
        if (consultaId === 6) {
            sql = `
            select 
                id_ett, 
                razon_social_empresa, 
                avg(detencion) as detencion, 
                avg(no_detencion) as no_detencion,
                round(avg(no_detencion) / avg(detencion)::numeric, 2) as porc_no_detencion
            from giz_resumen.giz_consulta6
            group by 
                id_ett, 
                razon_social_empresa,
                placa_vehiculo`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    sum(detencion) as detencion, 
                    sum(no_detencion) as no_detencion,
                    round(sum(no_detencion) / sum(detencion)::numeric, 2) as porc_no_detencion
                from giz_resumen.giz_consulta6 
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    sum(detencion) as detencion, 
                    sum(no_detencion) as no_detencion,
                    round(sum(no_detencion) / sum(detencion)::numeric, 2) as porc_no_detencion
                from giz_resumen.giz_consulta6 
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 7
        if (consultaId === 7) {
            sql = `
            select 
                id_ett, 
                razon_social_empresa, 
                count(distinct placa_vehiculo) as unidades,
                sum(detencion) as detencion, 
                sum(no_detencion) as no_detencion,
                round(sum(no_detencion) / sum(detencion)::numeric, 2) as porc_no_detencion
            from giz_resumen.giz_consulta6
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    count(distinct placa_vehiculo) as unidades,
                    sum(detencion) as detencion, 
                    sum(no_detencion) as no_detencion,
                    round(sum(no_detencion) / sum(detencion)::numeric, 2) as porc_no_detencion
                from giz_resumen.giz_consulta6 
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    sum(detencion) as detencion, 
                    sum(no_detencion) as no_detencion,
                    round(sum(no_detencion) / sum(detencion)::numeric, 2) as porc_no_detencion
                from giz_resumen.giz_consulta6 
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 8
        if (consultaId === 8) {
            sql = `
            select 
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
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
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
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
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
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 9
        if (consultaId === 9) {
            sql = `
            select 
                id_ett, 
                razon_social_empresa, 
                count(case when hora_dia between 0 and 6 then 1 end) as h_0_6,
                count(case when hora_dia between 7 and 13 then 1 end) as h_7_13,
                count(case when hora_dia between 14 and 20 then 1 end) as h_14_20,
                count(case when hora_dia between 21 and 23 then 1 end) as h_21_23,
                count(*) as total
            from giz_resumen.giz_consulta9
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    count(case when hora_dia between 0 and 6 then 1 end) as h_0_6,
                    count(case when hora_dia between 7 and 13 then 1 end) as h_7_13,
                    count(case when hora_dia between 14 and 20 then 1 end) as h_14_20,
                    count(case when hora_dia between 21 and 23 then 1 end) as h_21_23,
                    count(*) as total
                from giz_resumen.giz_consulta9 
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    count(case when hora_dia between 0 and 6 then 1 end) as h_0_6,
                    count(case when hora_dia between 7 and 13 then 1 end) as h_7_13,
                    count(case when hora_dia between 14 and 20 then 1 end) as h_14_20,
                    count(case when hora_dia between 21 and 23 then 1 end) as h_21_23,
                    count(*) as total
                from giz_resumen.giz_consulta9 
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 10
        if (consultaId === 10) {
            sql = `
            select 
                id_ett, 
                razon_social_empresa, 
                sum(detencion) as detencion, 
                sum(no_detencion) as no_detencion,
                round(sum(no_detencion) / sum(detencion)::numeric, 2)*100 as porc_no_detencion
            from giz_resumen.giz_consulta10
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    sum(detencion) as detencion, 
                    sum(no_detencion) as no_detencion,
                    round(sum(no_detencion) / sum(detencion)::numeric, 2) as porc_no_detencion
                from giz_resumen.giz_consulta10 
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    sum(detencion) as detencion, 
                    sum(no_detencion) as no_detencion,
                    round(sum(no_detencion) / sum(detencion)::numeric, 2) as porc_no_detencion
                from giz_resumen.giz_consulta10 
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 12
        if (consultaId === 12) {
            sql = `
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
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    count(case when velocidad = 0 then 1 end) as vel_0,
                    count(case when velocidad between 1 and 30 then 1 end) as vel_1_30,
                    count(case when velocidad between 31 and 60 then 1 end) as vel_31_60,
                    count(case when velocidad between 60 and 90 then 1 end) as vel_60_90,
                    count(case when velocidad > 90 then 1 end) as vel_m90,
                    count(*) as total
                from giz_resumen.giz_consulta12 
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    count(case when velocidad = 0 then 1 end) as vel_0,
                    count(case when velocidad between 1 and 30 then 1 end) as vel_1_30,
                    count(case when velocidad between 31 and 60 then 1 end) as vel_31_60,
                    count(case when velocidad between 60 and 90 then 1 end) as vel_60_90,
                    count(case when velocidad > 90 then 1 end) as vel_m90,
                    count(*) as total
                from giz_resumen.giz_consulta12 
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 14
        if (consultaId === 14) {
            sql = `
            select 
                id_ett, 
                razon_social_empresa, 
                to_char(min(fecha_emv), 'dd/mm/yyyy hh24:mi:ss') as desde,
                to_char(max(fecha_emv), 'dd/mm/yyyy hh24:mi:ss') as hasta,
                age(max(fecha_emv), min(fecha_emv))::text as tiempo,
                count(distinct placa_vehiculo) as vehiculos,
                count(*) as transmisiones
            from giz_resumen.giz_consulta12
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    to_char(min(fecha_emv), 'dd/mm/yyyy hh24:mi:ss') as desde,
                    to_char(max(fecha_emv), 'dd/mm/yyyy hh24:mi:ss') as hasta,
                    age(max(fecha_emv), min(fecha_emv))::text as tiempo,
                    count(distinct placa_vehiculo) as vehiculos,
                    count(*) as transmisiones
                from giz_resumen.giz_consulta12 
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    to_char(min(fecha_emv), 'dd/mm/yyyy hh24:mi:ss') as desde,
                    to_char(max(fecha_emv), 'dd/mm/yyyy hh24:mi:ss') as hasta,
                    age(max(fecha_emv), min(fecha_emv))::text as tiempo,
                    count(distinct placa_vehiculo) as vehiculos,
                    count(*) as transmisiones
                from giz_resumen.giz_consulta12 
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 15
        if (consultaId === 15) {
            sql = `
            select
                id_ett, 
                razon_social_empresa,
                TO_CHAR((avg(tiempo)::integer || ' second')::interval, 'HH24:MI:SS') as tiempo_promedio,
                count(distinct placa_vehiculo) as vehiculos,
                count(*) as transmisiones
            from(
                select
                    fecha_emv::date,
                    id_ett, 
                    razon_social_empresa,
                    id_ruta,
                    glosa_ruta,
                    placa_vehiculo,
                    extract(epoch from max(fecha_emv) - min(fecha_emv)) as tiempo
                from giz_resumen.giz_consulta14
                group by
                    fecha_emv::date,
                    id_ett, 
                    razon_social_empresa,
                    id_ruta,
                    glosa_ruta,
                    placa_vehiculo
            ) x
            group by
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select
                    id_ruta,
                    glosa_ruta,
                    TO_CHAR((avg(tiempo)::integer || ' second')::interval, 'HH24:MI:SS') as tiempo_promedio,
                    count(distinct placa_vehiculo) as vehiculos,
                    count(*) as transmisiones
                from(
                    select
                        fecha_emv::date,
                        id_ett, 
                        razon_social_empresa,
                        id_ruta,
                        glosa_ruta,
                        placa_vehiculo,
                        extract(epoch from max(fecha_emv) - min(fecha_emv)) as tiempo
                    from giz_resumen.giz_consulta14
                    where
                        id_ett = ${ettId}
                    group by
                        fecha_emv::date,
                        id_ett, 
                        razon_social_empresa,
                        id_ruta,
                        glosa_ruta,
                        placa_vehiculo
                ) x
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select
                    placa_vehiculo,
                    TO_CHAR((avg(tiempo)::integer || ' second')::interval, 'HH24:MI:SS') as tiempo_promedio,
                    count(distinct placa_vehiculo) as vehiculos,
                    count(*) as transmisiones
                from(
                    select
                        fecha_emv::date,
                        id_ett, 
                        razon_social_empresa,
                        id_ruta,
                        glosa_ruta,
                        placa_vehiculo,
                        extract(epoch from max(fecha_emv) - min(fecha_emv)) as tiempo
                    from giz_resumen.giz_consulta14
                    where
                        id_ett = ${ettId} and
                        id_ruta = ${rutaId}
                    group by
                        fecha_emv::date,
                        id_ett, 
                        razon_social_empresa,
                        id_ruta,
                        glosa_ruta,
                        placa_vehiculo
                ) x
                group by
                    placa_vehiculo`;
        }

        //Consulta 22
        if (consultaId === 22) {
            sql = `
            select 
                id_ett, 
                razon_social_empresa, 
                count(distinct placa_vehiculo) as cant_vehiculos
            from giz_resumen.giz_consulta22
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    count(distinct placa_vehiculo) as cant_vehiculos
                from giz_resumen.giz_consulta22 
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    count(*) as transmisiones
                from giz_resumen.giz_consulta22 
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 23
        if (consultaId === 23) {
            sql = `
            select 
                id_ett, 
                razon_social_empresa,
                count(distinct placa_vehiculo) as unidades,
                round(sum(km_en_ruta)::numeric, 2) as km_en_ruta, 
                round(sum(km_fuera_ruta)::numeric, 2) as km_fuera_ruta,
                round(((sum(km_fuera_ruta) / (sum(km_en_ruta) + sum(km_fuera_ruta))) * 100)::numeric, 2) as porc_fuera_ruta
            from giz_resumen.giz_consulta4 
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    count(distinct placa_vehiculo) as unidades,
                    round(sum(km_en_ruta)::numeric, 2) as km_en_ruta, 
                    round(sum(km_fuera_ruta)::numeric, 2) as km_fuera_ruta,
                    round(((sum(km_fuera_ruta) / (sum(km_en_ruta) + sum(km_fuera_ruta))) * 100)::numeric, 2) as porc_fuera_ruta
                from giz_resumen.giz_consulta4
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    round(sum(km_en_ruta)::numeric, 2) as km_en_ruta, 
                    round(sum(km_fuera_ruta)::numeric, 2) as km_fuera_ruta,
                    round(((sum(km_fuera_ruta) / (sum(km_en_ruta) + sum(km_fuera_ruta))) * 100)::numeric, 2) as porc_fuera_ruta
                from giz_resumen.giz_consulta4
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        //Consulta 18
        if (consultaId === 18) {
            sql = `
            select 
                id_ett, 
                razon_social_empresa,
                count(distinct placa_vehiculo) as unidades,
                sum(tiempo)::text as tiempo
            from giz_resumen.giz_consulta18
            group by 
                id_ett, 
                razon_social_empresa`;

            if (ettId)
                sql = `
                select  
                    id_ruta,
                    glosa_ruta,
                    count(distinct placa_vehiculo) as unidades,
                    sum(tiempo)::text as tiempo
                from giz_resumen.giz_consulta18
                where
                    id_ett = ${ettId}
                group by
                    id_ruta,
                    glosa_ruta`;

            if (rutaId)
                sql = `
                select 
                    placa_vehiculo,
                    sum(tiempo)::text as tiempo
                from giz_resumen.giz_consulta18
                where
                    id_ett = ${ettId} and
                    id_ruta = ${rutaId}
                group by
                    placa_vehiculo`;
        }

        const consulta = await pg.query(sql, []);
        return res.status(200).send(camelcaseKeys(consulta));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}