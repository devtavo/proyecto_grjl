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
        return res.status(404).send({ message: "Debe enviar el parámetro reporteId" });

    if (!req.params.empresaId)
        return res.status(404).send({ message: "Debe enviar el parámetro empresaId" });

    if (!req.params.rutaId)
        return res.status(404).send({ message: "Debe enviar el parámetro rutaId" });

    const reporteId = parseInt(req.params.reporteId);

    if (reporteId === 1) return reporte1(req, res);
    if (reporteId === 2) return reporte2(req, res);
    if (reporteId === 3) return reporte3(req, res);
    if (reporteId === 5) return reporte5(req, res);
    if (reporteId === 6) return reporte6(req, res);
    if (reporteId === 8) return reporte8(req, res);
    if (reporteId === 9) return reporte9(req, res);
    if (reporteId === 10) return reporte10(req, res);
    if (reporteId === 11) return reporte11(req, res);
    if (reporteId === 12) return reporte12(req, res);
    if (reporteId === 14) return reporte14(req, res);
}

const reporte1 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            row_number() over(order by placa_vehiculo) id,
            placa_vehiculo placa,
            sum(s_12) salidas_1_2,
            sum(v_in_12)viajes_incompletos_1_2,
            sum(v_c_12)viajes_completos_1_2,
            sum(s_21)salidas_2_1,
            sum(v_in_21)viajes_incompletos_2_1,
            sum(v_c_21)viajes_completos_2_1,	
            round(case when sum(s_12)=0 then 0 else sum(v_c_12)/sum(s_12)*100 end ,2)||'%' porc_viajes_completos_1_2,
            round(case when sum(s_21)=0 then 0 else sum(v_c_21)/sum(s_21)*100 end ,2)||'%' porc_viajes_completos_2_1
        from (select 
        --	id_ett,
        --	id_ruta,
            placa_vehiculo,
            sum(salida_1_2)s_12,
            sum(viajes_incompletos_1_2)v_in_12,
            sum(salida_1_2)-sum(viajes_incompletos_1_2)v_c_12,
            sum(salida_2_1)s_21,
            sum(viajes_incompletos_2_1)v_in_21,
            sum(salida_2_1)-sum(viajes_incompletos_2_1)v_c_21	
            from giz_resumen.giz_reporte01 r1
                where r1.id_ett='${req.params.empresaId}' and r1.id_ruta='${req.params.rutaId}' and to_date(to_char(r1.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                group by 
            --	id_ett,
            --	id_ruta,
                placa_vehiculo,
                salida_1_2,
                viajes_incompletos_1_2,
                salida_2_1,
                viajes_incompletos_2_1 
                order by 1,2)x 
        group by placa_vehiculo`, []);

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
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte2 = async (req, res) => {
    try {
        const sentido_1_2 = await pg.query(`
        select 
        row_number() over(order by placa_vehiculo) id,
        placa_vehiculo placa,
        coalesce(round(sum(case when y.hora=5 then y.factor end),0),0) || '%' h05,
        coalesce(round(sum(case when y.hora=6 then y.factor end),0),0) || '%' h06,
        coalesce(round(sum(case when y.hora=7 then y.factor end),0),0) || '%'  h07,
        coalesce(round(sum(case when y.hora=8 then y.factor end),0),0) || '%'  h08,
        coalesce(round(sum(case when y.hora=9 then y.factor end),0),0) || '%'  h09,
        coalesce(round(sum(case when y.hora=10 then y.factor end),0),0) || '%'  h10,
        coalesce(round(sum(case when y.hora=11 then y.factor end),0),0) || '%'  h11,
        coalesce(round(sum(case when y.hora=12 then y.factor end),0),0) || '%'  h12,
        coalesce(round(sum(case when y.hora=13 then y.factor end),0),0) || '%'  h13,
        coalesce(round(sum(case when y.hora=14 then y.factor end),0),0) || '%'  h14,
        coalesce(round(sum(case when y.hora=15 then y.factor end),0),0) || '%'  h15,
        coalesce(round(sum(case when y.hora=16 then y.factor end),0),0) || '%'  h16,
        coalesce(round(sum(case when y.hora=17 then y.factor end),0),0) || '%'  h17,
        coalesce(round(sum(case when y.hora=18 then y.factor end),0),0) || '%'  h18,
        coalesce(round(sum(case when y.hora=19 then y.factor end),0),0) || '%'  h19,
        coalesce(round(sum(case when y.hora=20 then y.factor end),0),0) || '%'  h20,
        coalesce(round(sum(case when y.hora=21 then y.factor end),0),0) || '%'  h21,
        coalesce(round(sum(case when y.hora=22 then y.factor end),0),0) || '%'  h22,
        coalesce(round(sum(case when y.hora=23 then y.factor end),0),0) || '%'  h23,
        coalesce(round(sum(case when y.hora=24 then y.factor end),0),0) || '%'  h24,
        round(avg(y.factor),0) || '%' porc_sentido
        from(
            select 
            x.placa_vehiculo,
            hora,
            round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 factor
            from(
                select 
                placa_vehiculo,
                hora,
                cantidad
                from giz_resumen.giz_reporte03 
                where sentido='1-2' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                group by 
                hora,
                placa_vehiculo,
                cantidad
                order by  
                placa_vehiculo,
                hora
            )x	
            group by
            x.placa_vehiculo, 
            x.hora
            order by  
            round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 desc,
            x.placa_vehiculo,
            x.hora
        )y
        group by 
        placa_vehiculo`, []);

        const sentido_2_1 = await pg.query(`
        select 
        row_number() over(order by placa_vehiculo) id,
        placa_vehiculo placa,
        coalesce(round(sum(case when y.hora=5 then y.factor end),0),0) || '%' h05,
        coalesce(round(sum(case when y.hora=6 then y.factor end),0),0) || '%' h06,
        coalesce(round(sum(case when y.hora=7 then y.factor end),0),0) || '%'  h07,
        coalesce(round(sum(case when y.hora=8 then y.factor end),0),0) || '%'  h08,
        coalesce(round(sum(case when y.hora=9 then y.factor end),0),0) || '%'  h09,
        coalesce(round(sum(case when y.hora=10 then y.factor end),0),0) || '%'  h10,
        coalesce(round(sum(case when y.hora=11 then y.factor end),0),0) || '%'  h11,
        coalesce(round(sum(case when y.hora=12 then y.factor end),0),0) || '%'  h12,
        coalesce(round(sum(case when y.hora=13 then y.factor end),0),0) || '%'  h13,
        coalesce(round(sum(case when y.hora=14 then y.factor end),0),0) || '%'  h14,
        coalesce(round(sum(case when y.hora=15 then y.factor end),0),0) || '%'  h15,
        coalesce(round(sum(case when y.hora=16 then y.factor end),0),0) || '%'  h16,
        coalesce(round(sum(case when y.hora=17 then y.factor end),0),0) || '%'  h17,
        coalesce(round(sum(case when y.hora=18 then y.factor end),0),0) || '%'  h18,
        coalesce(round(sum(case when y.hora=19 then y.factor end),0),0) || '%'  h19,
        coalesce(round(sum(case when y.hora=20 then y.factor end),0),0) || '%'  h20,
        coalesce(round(sum(case when y.hora=21 then y.factor end),0),0) || '%'  h21,
        coalesce(round(sum(case when y.hora=22 then y.factor end),0),0) || '%'  h22,
        coalesce(round(sum(case when y.hora=23 then y.factor end),0),0) || '%'  h23,
        coalesce(round(sum(case when y.hora=24 then y.factor end),0),0) || '%'  h24,
        round(avg(y.factor),0) || '%' porc_sentido
        from(
            select 
            x.placa_vehiculo,
            hora,
            round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 factor
            from(
                select 
                placa_vehiculo,
                hora,
                cantidad
                from giz_resumen.giz_reporte03 
                where sentido='2-1' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                group by 
                hora,
                placa_vehiculo,
                cantidad
                order by  
                placa_vehiculo,
                hora
            )x	
            group by
            x.placa_vehiculo, 
            x.hora
            order by  
            round(sum(x.cantidad)/(count(x.hora)*60)::decimal,2)*100 desc,
            x.placa_vehiculo,
            x.hora
        )y
        group by 
        placa_vehiculo`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Promedio % de Transmisión del GPS por minuto Sentido 1-2 '
                when id = 2 then 'Promedio % de Transmisión del GPS por minuto Sentido 2-1 '
                when id = 3 then 'Proemdio % de Transmisión del GPS por minuto en ambos Sentidos '
            end as concepto,
            floor(random() * 100 + 1)::int || '%' porcentaje 
        from generate_series(1, 3) as id`, []);

        return res.status(200).send({
            sentido12: camelcaseKeys(sentido_1_2),
            sentido21: camelcaseKeys(sentido_2_1),
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte3 = async (req, res) => {
    try {
        const sentido_1_2 = await pg.query(`
        select 
        row_number() over(order by 1) id,
            placa_vehiculo placa,
            coalesce(round(sum(case when y.hora=1 then y.factor end),0),0) h1,
            coalesce(round(sum(case when y.hora=2 then y.factor end),0),0) h2,
            coalesce(round(sum(case when y.hora=3 then y.factor end),0),0) h3,
            coalesce(round(sum(case when y.hora=4 then y.factor end),0),0) h4,
            coalesce(round(sum(case when y.hora=5 then y.factor end),0),0) h5,
            coalesce(round(sum(case when y.hora=6 then y.factor end),0),0) h6,
            coalesce(round(sum(case when y.hora=7 then y.factor end),0),0) h7,
            coalesce(round(sum(case when y.hora=8 then y.factor end),0),0) h8,
            coalesce(round(sum(case when y.hora=9 then y.factor end),0),0) h9,
            coalesce(round(sum(case when y.hora=10 then y.factor end),0),0) h10,
            coalesce(round(sum(case when y.hora=11 then y.factor end),0),0) h11,
            coalesce(round(sum(case when y.hora=12 then y.factor end),0),0) h12,
            coalesce(round(sum(case when y.hora=13 then y.factor end),0),0) h13,
            coalesce(round(sum(case when y.hora=14 then y.factor end),0),0) h14,
            coalesce(round(sum(case when y.hora=15 then y.factor end),0),0) h15,
            coalesce(round(sum(case when y.hora=16 then y.factor end),0),0) h16,
            coalesce(round(sum(case when y.hora=17 then y.factor end),0),0) h17,
            coalesce(round(sum(case when y.hora=18 then y.factor end),0),0) h18,
            coalesce(round(sum(case when y.hora=19 then y.factor end),0),0) h19,
            coalesce(round(sum(case when y.hora=20 then y.factor end),0),0) h20,
            coalesce(round(sum(case when y.hora=21 then y.factor end),0),0) h21,
            coalesce(round(sum(case when y.hora=22 then y.factor end),0),0) h22,
            coalesce(round(sum(case when y.hora=23 then y.factor end),0),0) h23,
            coalesce(round(sum(case when y.hora=24 then y.factor end),0),0) h24,
            coalesce(round(avg(y.factor),0),0) promedio
        from(
            select 
            replace(x.placa_vehiculo,'-','') placa_vehiculo,
            hora,
            round(sum(x.cantidad)::decimal,2) factor
            from(
                select 
                placa_vehiculo,
                hora,
                cantidad
                from giz_resumen.giz_reporte04 
                where sentido='1-2' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                group by 
                hora,
                placa_vehiculo,
                cantidad
                order by  
                placa_vehiculo,
                hora
            )x	
            group by
            x.placa_vehiculo, 
            x.hora
            order by  
            round(sum(x.cantidad)::decimal,2) desc,
            x.placa_vehiculo,
            x.hora
        )y
        group by 
        placa_vehiculo`, []);

        const sentido_2_1 = await pg.query(`
        select 
            row_number() over(order by placa_vehiculo) id,
            placa_vehiculo placa,
            coalesce(round(sum(case when y.hora=1 then y.factor end),0),0) h1,
            coalesce(round(sum(case when y.hora=2 then y.factor end),0),0) h2,
            coalesce(round(sum(case when y.hora=3 then y.factor end),0),0) h3,
            coalesce(round(sum(case when y.hora=4 then y.factor end),0),0) h4,
            coalesce(round(sum(case when y.hora=5 then y.factor end),0),0) h5,
            coalesce(round(sum(case when y.hora=6 then y.factor end),0),0) h6,
            coalesce(round(sum(case when y.hora=7 then y.factor end),0),0) h7,
            coalesce(round(sum(case when y.hora=8 then y.factor end),0),0) h8,
            coalesce(round(sum(case when y.hora=9 then y.factor end),0),0) h9,
            coalesce(round(sum(case when y.hora=10 then y.factor end),0),0) h10,
            coalesce(round(sum(case when y.hora=11 then y.factor end),0),0) h11,
            coalesce(round(sum(case when y.hora=12 then y.factor end),0),0) h12,
            coalesce(round(sum(case when y.hora=13 then y.factor end),0),0) h13,
            coalesce(round(sum(case when y.hora=14 then y.factor end),0),0) h14,
            coalesce(round(sum(case when y.hora=15 then y.factor end),0),0) h15,
            coalesce(round(sum(case when y.hora=16 then y.factor end),0),0) h16,
            coalesce(round(sum(case when y.hora=17 then y.factor end),0),0) h17,
            coalesce(round(sum(case when y.hora=18 then y.factor end),0),0) h18,
            coalesce(round(sum(case when y.hora=19 then y.factor end),0),0) h19,
            coalesce(round(sum(case when y.hora=20 then y.factor end),0),0) h20,
            coalesce(round(sum(case when y.hora=21 then y.factor end),0),0) h21,
            coalesce(round(sum(case when y.hora=22 then y.factor end),0),0) h22,
            coalesce(round(sum(case when y.hora=23 then y.factor end),0),0) h23,
            coalesce(round(sum(case when y.hora=24 then y.factor end),0),0) h24,
            coalesce(round(avg(y.factor),0),0) promedio
        from(
            select 
            replace(x.placa_vehiculo,'-','') placa_vehiculo,
            hora,
            round(sum(x.cantidad)::decimal,2) factor
            from(
                select 
                placa_vehiculo,
                hora,
                cantidad
                from giz_resumen.giz_reporte04 
                where sentido='2-1' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                group by 
                hora,
                placa_vehiculo,
                cantidad
                order by  
                placa_vehiculo,
                hora
            )x	
            group by
            x.placa_vehiculo, 
            x.hora
            order by  
            round(sum(x.cantidad)::decimal,2) desc,
            x.placa_vehiculo,
            x.hora
        )y
        group by 
        placa_vehiculo`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Velocidad Media en Sentido 1-2 en la Ruta '
                when id = 2 then 'Velocidad Media en Sentido 2-1 en la Ruta '
                when id = 3 then 'Velocidad Media en ambos Sentidos en la Ruta '
            end as concepto,
            case
                when id = 1 then 0
                when id = 2 then 0
                when id = 3 then 0
            end as kilometraje
        from generate_series(1, 3) as id`, []);

        return res.status(200).send({
            sentido12: camelcaseKeys(sentido_1_2),
            sentido21: camelcaseKeys(sentido_2_1),
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte5 = async (req, res) => {
    try {
        const id_evento = await pg.query(
            `select 
                (valor_parametro->> 'codAlerta')::integer id_evento
                from giz.giz_parametros where glosa_parametro = 'alerta12'
            `, []);

        const panico = await pg.query(` 
        select 
            placa_vehiculo,
            longitud,
            latitud
            from giz.giz_transmision 
            where id_evento=${id_evento[0].id_evento}
        `, []);

        return res.status(200).send(
            panico
        );
    } catch (error) {
        return res.status(500).send({ message: error });
    }

}

const reporte6 = async (req, res) => {
    try {
        const sentido_1_2 = await pg.query(` 
        select
        row_number() over(order by 1) id,
        x.id_ett ,
        x.id_ruta,
        x.placa_vehiculo placa,
        (sum(x.n_completos_ett)) n_completos_ett,
        (sum(x.n_incompletos_ett)) n_incompletos_ett,
        (sum(x.km_recorridos_con_ett)) km_recorridos_completos_12,
        (sum(x.km_recorridos_inc_ett)) km_recorridos_incompletos_12,
        (sum(x.km_recorridos_con_ett))+(sum(x.km_recorridos_inc_ett)) total_km_recorridos_s_12
        from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                longitud_rutas,
                placa_vehiculo,
                n_completos_ett n_completos_ett,
                n_incompletos_ett  n_incompletos_ett,
                km_recorridos_con_ett,
                n_incompletos_ett * longitud_rutas as km_recorridos_inc_ett
                from 
                giz_resumen.giz_reporte07 r07
                where sentido='1-2' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_date(to_char(r07.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                and n_completos_ett is not null
                order by 2
            )x
        group by 
        x.id_ett,
        x.id_ruta,
        x.placa_vehiculo,
        longitud_rutas
        order by 
        3 desc
        `, []);

        const sentido_2_1 = await pg.query(`
        select
        row_number() over(order by 1) id,
        x.id_ett ,
        x.id_ruta,
        x.placa_vehiculo placa,
        (sum(x.n_completos_ett)) n_completos_ett,
        (sum(x.n_incompletos_ett)) n_incompletos_ett,
        (sum(x.km_recorridos_con_ett)) km_recorridos_completos_21,
        (sum(x.km_recorridos_inc_ett)) km_recorridos_incompletos_21,
        (sum(x.km_recorridos_con_ett))+(sum(x.km_recorridos_inc_ett)) total_km_recorridos_s_21
        from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                longitud_rutas,
                placa_vehiculo,
                n_completos_ett n_completos_ett,
                n_incompletos_ett  n_incompletos_ett,
                km_recorridos_con_ett,
                n_incompletos_ett * longitud_rutas as km_recorridos_inc_ett
                from 
                giz_resumen.giz_reporte07 r07
                where sentido='2-1' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_date(to_char(r07.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                and n_completos_ett is not null
                order by 2
            )x
        group by 
        x.id_ett,
        x.id_ruta,
        x.placa_vehiculo,
        longitud_rutas
        order by 
        3 desc`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Kilómetros recorridos en Sentido 1-2'
                when id = 2 then 'Kilómetros recorridos en Sentido 2-1'
                when id = 3 then 'Kilómetros recorridos en las Rutas de la EETT en ambos Sentidos'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 3) as id`, []);

        return res.status(200).send({
            sentido12: camelcaseKeys(sentido_1_2),
            sentido21: camelcaseKeys(sentido_2_1),
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
        x.id_ett ,
        x.id_ruta,
        x.placa_vehiculo placa,
        (sum(x.km_recorridos_gps)) km_recorridos_gps,
        sum(x.km_recorridos_ruta) km_recorridos_ruta,
        case when sum(x.km_recorridos_ruta)::decimal =0 then 0 else round(sum(x.km_recorridos_gps)::decimal/sum(x.km_recorridos_ruta)::decimal,2)*100 end || ' %' porc_km_recorridos_ruta_gps
        from 
        (	
            select 
            row_number() over(order by 1),
            id_ett,
            id_ruta,
            placa_vehiculo,
            coalesce(km_recorridos_ruta,0)::integer km_recorridos_ruta,
            coalesce(km_recorridos_gps,0)::integer km_recorridos_gps
            from 
            giz_resumen.giz_reporte09 r09
            where r09.id_ett='${req.params.empresaId}' and r09.id_ruta='${req.params.rutaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
            order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta,
            x.placa_vehiculo
            order by 
            3 desc`, []);

        const resumen = await pg.query(`
        select 
        id,
        case
            when id = 1 then 'Comparativo de Km Recorridos en Rutas vs. Km Recorridos según GPS, en ambos sentidos:'
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
        return res.status(500).send({ message: error });
    }
}
const reporte9 = async (req, res) => {
    try {
        const detalle = await pg.query(`
	    select
        row_number() over(order by 1) id,
        x.placa_vehiculo placa,
        x.glosa tipo_Vehiculo,
        x.subsidio subsidio_Km,
        round(coalesce(sum(x.km_recorridos),0),0) tot_Km_Recorridos,
        round(coalesce(sum(x.pago_subsidio),0),0) pago_Subsidio
        from 
        (	
            select 
            row_number() over(order by 1),
            id_ett,
            id_ruta,
            placa_vehiculo,
            gtv.glosa,
            tipo_vehiculo,
            subsidio,
            round(tot_km_recorridos,2) km_recorridos,
            subsidio*round(tot_km_recorridos,2) pago_subsidio
            from 
            giz_resumen.giz_reporte10 r10 inner join giz.giz_tipo_vehiculo gtv on r10.tipo_vehiculo::integer = gtv.id_tipo_vehiculo 
            where r10.id_ett='${req.params.empresaId}' and r10.id_ruta='${req.params.rutaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
            and tot_km_recorridos is not null
            order by 2
            )x
	    group by 
	    x.id_ett,
	    x.id_ruta,
	    x.placa_vehiculo,
	    x.glosa,
	    x.tipo_vehiculo,
	    x.subsidio
	    order by 
	    3 desc
        `, []);

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
        return res.status(500).send({ message: error });
    }
}

const reporte10 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.placa_vehiculo placa,
        g.km_recorridos tot_Km_Recorridos,
        g.km_recorridos_fuera km_Recorridos_Fuera,
        case when g.km_recorridos =0 then 0.00 else round((g.km_recorridos_fuera/g.km_recorridos)::decimal*100,2) end  || '%' porc_Total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            x.placa_vehiculo,
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
                where r11.id_ett='${req.params.empresaId}' and r11.id_ruta='${req.params.rutaId}' and to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta,
            x.placa_vehiculo
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta
        
        `, []);
        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Kilómetros Recorridos fuera del Itinerario de todas las Rutas y en horario del Servicio de la totalidad'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
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
        ,r13.id_ruta
        ,fv.placa_vehiculo placa
        ,replace(justify_hours(sum(tiempo_sin_transmision_gps ))::text,' days ', ' dias ') tiempo_Sin_Transmision_Gps 
        --justify_hours(sum(tiempo_sin_transmision_gps ))::text
        from giz.giz_resumen.giz_reporte13 r13
        inner join giz.giz_flotavehiculos fv on r13.placa_vehiculo =fv.placa_vehiculo
        where r13.id_ett= '${req.params.empresaId}'  and r13.id_ruta='${req.params.rutaId}' and  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
		group by 
        r13.id_ruta
       ,fv.placa_vehiculo`, []);

        const resumen = await pg.query(`
       select 
           id,
           case
               when id = 1 then 'Tiempo sin Transmisión del GPS en todas las Rutas de la totalidad de Empresas de Transporte registradas'
           end as concepto,
           case
           when id = 1 then 
           (select 
            replace(justify_hours(sum(tiempo_sin_transmision_gps ))::text,' days ', ' dias ') tiempo_Sin_Transmision_Gps 
            from giz.giz_resumen.giz_reporte13 r13
            inner join giz.giz_flotavehiculos fv on r13.placa_vehiculo =fv.placa_vehiculo
            where r13.id_ett= '${req.params.empresaId}'  and r13.id_ruta='${req.params.rutaId}' and  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
            )             
           end as tiempo
           from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
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
        ,r14.id_ruta
        ,fv.placa_vehiculo placa
        ,replace(justify_hours(sum(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo_Acu_Transmision_Gps 
        --justify_hours(sum(tiempo_sin_transmision_gps ))::text
        from giz.giz_resumen.giz_reporte14 r14
        inner join giz.giz_flotavehiculos fv on r14.placa_vehiculo =fv.placa_vehiculo
        where r14.id_ett= '${req.params.empresaId}'  and r14.id_ruta='${req.params.rutaId}' and  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
		group by 
        r14.id_ruta
       ,fv.placa_vehiculo`, []);

        const resumen = await pg.query(`
       select 
           id,
           case
               when id = 1 then 'Tiempo Acumulado por los Vehículos en la prestación del Servicio.'
           end as concepto,
           case
           when id = 1 then 
           (select 
            replace(justify_hours(sum(tiempo_transmision_gps ))::text,' days ', ' dias ') tiempo_Acu_Transmision_Gps 
            from giz.giz_resumen.giz_reporte14 r14
            inner join giz.giz_flotavehiculos fv on r14.placa_vehiculo =fv.placa_vehiculo
            where r14.id_ett= '${req.params.empresaId}'  and r14.id_ruta='${req.params.rutaId}' and  to_date(to_char(fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
            )             
           end as tiempo
           from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle: camelcaseKeys(detalle),
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

const reporte14 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            row_number() over(order by placa_vehiculo) id,
            placa_vehiculo placa,
            sum(s_12) salidas_1_2,
            sum(v_in_12)viajes_incompletos_1_2,
            sum(v_c_12)viajes_completos_1_2,
            sum(s_21)salidas_2_1,
            sum(v_in_21)viajes_incompletos_2_1,
            sum(v_c_21)viajes_completos_2_1,	
            round(case when sum(s_12)=0 then 0 else sum(v_c_12)/sum(s_12)*100 end ,2)||'%' porc_viajes_completos_1_2,
            round(case when sum(s_21)=0 then 0 else sum(v_c_21)/sum(s_21)*100 end ,2)||'%' porc_viajes_completos_2_1
        from (select 
        --	id_ett,
        --	id_ruta,
            placa_vehiculo,
            sum(salida_1_2)s_12,
            sum(viajes_incompletos_1_2)v_in_12,
            sum(salida_1_2)-sum(viajes_incompletos_1_2)v_c_12,
            sum(salida_2_1)s_21,
            sum(viajes_incompletos_2_1)v_in_21,
            sum(salida_2_1)-sum(viajes_incompletos_2_1)v_c_21	
            from giz_resumen.giz_reporte16 r1
                where r1.id_ett='${req.params.empresaId}' and r1.id_ruta='${req.params.rutaId}' and to_date(to_char(r1.fecha,'dd-mm-yyyy'),'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')
                group by 
            --	id_ett,
            --	id_ruta,
                placa_vehiculo,
                salida_1_2,
                viajes_incompletos_1_2,
                salida_2_1,
                viajes_incompletos_2_1 
                order by 1,2)x 
        group by placa_vehiculo`, []);

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
            resumen: camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
