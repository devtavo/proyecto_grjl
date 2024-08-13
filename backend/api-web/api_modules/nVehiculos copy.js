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
    if (reporteId === 6) return reporte6(req, res);
    if (reporteId === 8) return reporte8(req, res);
    if (reporteId === 9) return reporte9(req, res);
    if (reporteId === 10) return reporte10(req, res);
    if (reporteId === 11) return reporte11(req, res);
    if (reporteId === 12) return reporte12(req, res);
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
                when id = 1 then '% de Viajes completos en Sentido 1-2 en la Ruta (Código) de la EETT:'
                when id = 2 then '% de Viajes completos en Sentido 2-1 en la Ruta (Código) de la EETT:'
                when id = 3 then '% de Viajes completos en ambos Sentidos en la Ruta (Código) de la EETT:'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
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
        sum(case when y.hora=1 then y.factor end) ||'%' h1,
        sum(case when y.hora=2 then y.factor end) ||'%' h2,
        sum(case when y.hora=3 then y.factor end) ||'%' h3,
        sum(case when y.hora=4 then y.factor end) ||'%' h4,
        sum(case when y.hora=5 then y.factor end) ||'%' h5,
        sum(case when y.hora=6 then y.factor end) ||'%' h6,
        sum(case when y.hora=7 then y.factor end) ||'%' h7,
        sum(case when y.hora=8 then y.factor end) ||'%' h8,
        sum(case when y.hora=9 then y.factor end) ||'%' h9,
        sum(case when y.hora=10 then y.factor end) ||'%' h10,
        sum(case when y.hora=11 then y.factor end) ||'%' h11,
        sum(case when y.hora=12 then y.factor end) ||'%' h12,
        sum(case when y.hora=13 then y.factor end) ||'%' h13,
        sum(case when y.hora=14 then y.factor end) ||'%' h14,
        sum(case when y.hora=15 then y.factor end) ||'%' h15,
        sum(case when y.hora=16 then y.factor end) ||'%' h16,
        sum(case when y.hora=17 then y.factor end) ||'%' h17,
        sum(case when y.hora=18 then y.factor end) ||'%' h18,
        sum(case when y.hora=19 then y.factor end) ||'%' h19,
        sum(case when y.hora=20 then y.factor end) ||'%' h20,
        sum(case when y.hora=21 then y.factor end) ||'%' h21,
        sum(case when y.hora=22 then y.factor end) ||'%' h22,
        sum(case when y.hora=23 then y.factor end) ||'%' h23,
        sum(case when y.hora=24 then y.factor end) ||'%' h24,
        round(avg(y.factor),2)||'%' porc_sentido_12
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
                where sentido='1-2' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
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
        sum(case when y.hora=1 then y.factor end) ||'%' h1,
        sum(case when y.hora=2 then y.factor end) ||'%' h2,
        sum(case when y.hora=3 then y.factor end) ||'%' h3,
        sum(case when y.hora=4 then y.factor end) ||'%' h4,
        sum(case when y.hora=5 then y.factor end) ||'%' h5,
        sum(case when y.hora=6 then y.factor end) ||'%' h6,
        sum(case when y.hora=7 then y.factor end) ||'%' h7,
        sum(case when y.hora=8 then y.factor end) ||'%' h8,
        sum(case when y.hora=9 then y.factor end) ||'%' h9,
        sum(case when y.hora=10 then y.factor end) ||'%' h10,
        sum(case when y.hora=11 then y.factor end) ||'%' h11,
        sum(case when y.hora=12 then y.factor end) ||'%' h12,
        sum(case when y.hora=13 then y.factor end) ||'%' h13,
        sum(case when y.hora=14 then y.factor end) ||'%' h14,
        sum(case when y.hora=15 then y.factor end) ||'%' h15,
        sum(case when y.hora=16 then y.factor end) ||'%' h16,
        sum(case when y.hora=17 then y.factor end) ||'%' h17,
        sum(case when y.hora=18 then y.factor end) ||'%' h18,
        sum(case when y.hora=19 then y.factor end) ||'%' h19,
        sum(case when y.hora=20 then y.factor end) ||'%' h20,
        sum(case when y.hora=21 then y.factor end) ||'%' h21,
        sum(case when y.hora=22 then y.factor end) ||'%' h22,
        sum(case when y.hora=23 then y.factor end) ||'%' h23,
        sum(case when y.hora=24 then y.factor end) ||'%' h24,
        round(avg(y.factor),2)||'%' porc_sentido_21
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
                where sentido='2-1' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
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
                when id = 1 then '% de Transmisión del GPS por minuto Sentido 1-2 en la Ruta (Código) de la EETT:'
                when id = 2 then '% de Transmisión del GPS por minuto Sentido 2-1 en la Ruta (Código) de la EETT:'
                when id = 3 then '% de Transmisión del GPS por minuto en ambos Sentidos en la Ruta (Código) de la EETT:'
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

const reporte3 = async (req, res) => {
    try {
        const sentido_1_2 = await pg.query(`
        select 
            row_number() over(order by placa_vehiculo) id,
            placa_vehiculo placa,
            sum(case when y.hora=1 then y.factor end) h1,
            sum(case when y.hora=2 then y.factor end) h2,
            sum(case when y.hora=3 then y.factor end) h3,
            sum(case when y.hora=4 then y.factor end) h4,
            sum(case when y.hora=5 then y.factor end) h5,
            sum(case when y.hora=6 then y.factor end) h6,
            sum(case when y.hora=7 then y.factor end) h7,
            sum(case when y.hora=8 then y.factor end) h8,
            sum(case when y.hora=9 then y.factor end) h9,
            sum(case when y.hora=10 then y.factor end) h10,
            sum(case when y.hora=11 then y.factor end) h11,
            sum(case when y.hora=12 then y.factor end) h12,
            sum(case when y.hora=13 then y.factor end) h13,
            sum(case when y.hora=14 then y.factor end) h14,
            sum(case when y.hora=15 then y.factor end) h15,
            sum(case when y.hora=16 then y.factor end) h16,
            sum(case when y.hora=17 then y.factor end) h17,
            sum(case when y.hora=18 then y.factor end) h18,
            sum(case when y.hora=19 then y.factor end) h19,
            sum(case when y.hora=20 then y.factor end) h20,
            sum(case when y.hora=21 then y.factor end) h21,
            sum(case when y.hora=22 then y.factor end) h22,
            sum(case when y.hora=23 then y.factor end) h23,
            sum(case when y.hora=24 then y.factor end) h24,
            round(avg(y.factor),2) promedio
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
            sum(case when y.hora=1 then y.factor end) h1,
            sum(case when y.hora=2 then y.factor end) h2,
            sum(case when y.hora=3 then y.factor end) h3,
            sum(case when y.hora=4 then y.factor end) h4,
            sum(case when y.hora=5 then y.factor end) h5,
            sum(case when y.hora=6 then y.factor end) h6,
            sum(case when y.hora=7 then y.factor end) h7,
            sum(case when y.hora=8 then y.factor end) h8,
            sum(case when y.hora=9 then y.factor end) h9,
            sum(case when y.hora=10 then y.factor end) h10,
            sum(case when y.hora=11 then y.factor end) h11,
            sum(case when y.hora=12 then y.factor end) h12,
            sum(case when y.hora=13 then y.factor end) h13,
            sum(case when y.hora=14 then y.factor end) h14,
            sum(case when y.hora=15 then y.factor end) h15,
            sum(case when y.hora=16 then y.factor end) h16,
            sum(case when y.hora=17 then y.factor end) h17,
            sum(case when y.hora=18 then y.factor end) h18,
            sum(case when y.hora=19 then y.factor end) h19,
            sum(case when y.hora=20 then y.factor end) h20,
            sum(case when y.hora=21 then y.factor end) h21,
            sum(case when y.hora=22 then y.factor end) h22,
            sum(case when y.hora=23 then y.factor end) h23,
            sum(case when y.hora=24 then y.factor end) h24,
            round(avg(y.factor),2) promedio
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
        (sum(x.n_completos_ett)*longitud_rutas) km_recorridos_completos_12,
        (sum(x.n_incompletos_ett)*longitud_rutas*0.3) km_recorridos_incompletos_12,
        (sum(x.n_completos_ett)*longitud_rutas)+(sum(x.n_incompletos_ett)*longitud_rutas*0.3) total_km_recorridos_s_12
        from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                longitud_rutas,
                placa_vehiculo,
                n_completos_ett n_completos_ett,
                n_incompletos_ett  n_incompletos_ett
                from 
                giz_resumen.giz_reporte07 r07
                where sentido='1-2' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
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

        const sentido_2_1 = await pg.query(`
        select
        row_number() over(order by 1) id,
        x.id_ett ,
        x.id_ruta,
        x.placa_vehiculo placa,
        (sum(x.n_completos_ett)) n_completos_ett,
        (sum(x.n_incompletos_ett)) n_incompletos_ett,
        (sum(x.n_completos_ett)*longitud_rutas) km_recorridos_completos_21,
        (sum(x.n_incompletos_ett)*longitud_rutas*0.3) km_recorridos_incompletos_21,
        (sum(x.n_completos_ett)*longitud_rutas)+(sum(x.n_incompletos_ett)*longitud_rutas*0.3) total_km_recorridos_s_21
        from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                longitud_rutas,
                placa_vehiculo,
                n_completos_ett n_completos_ett,
                n_incompletos_ett  n_incompletos_ett
                from 
                giz_resumen.giz_reporte07 r07
                where sentido='2-1' and id_ett='${req.params.empresaId}' and id_ruta='${req.params.rutaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
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
                when id = 1 then 'Kilómetros recorridos en la Rutas(codigo) de la EETT en el Sentido 1-2'
                when id = 2 then 'Kilómetros recorridos en la Rutas(codigo) de la EETT en el Sentido 2-1'
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
            0/sum(x.km_recorridos_gps)|| '%' porc_km_recorridos_ruta_gps
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
                where r09.id_ett='${req.params.empresaId}' and r09.id_ruta='${req.params.rutaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}' 
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
                when id = 1 then 'Kilómetros recorridos en la Rutas(codigo) de la EETT en el Sentido 1-2'
                when id = 2 then 'Kilómetros recorridos en la Rutas(codigo) de la EETT en el Sentido 2-1'
                when id = 3 then 'Kilómetros recorridos en las Rutas de la EETT en ambos Sentidos'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 3) as id`, []);

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
        x.id_ett ,
        x.id_ruta,
        x.placa_vehiculo placa,
        x.tipo_vehiculo tipo_Vehiculo,
        x.subsidio subsidio_Km,
        (sum(x.km_recorridos)) tot_Km_Recorridos,
        (sum(x.subsidio)*sum(x.km_recorridos)) pago_Subsidio
        from 
        (	
            select 
            row_number() over(order by 1),
            id_ett,
            id_ruta,
            placa_vehiculo,
            tipo_vehiculo,
            subsidio,
            round(tot_km_recorridos/1000,2) km_recorridos
            from 
            giz_resumen.giz_reporte10 r10
            where r10.id_ett='${req.params.empresaId}' and r10.id_ruta='${req.params.rutaId}' and to_char(r10.fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
            order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta,
            x.placa_vehiculo,
            x.tipo_vehiculo,
            x.subsidio
            order by 
            3 desc`, []);

        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then '%  de Km Recorridos por los Vehìculos (Rutas vs. GPS)'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle:camelcaseKeys(detalle),
            resumen:camelcaseKeys(resumen),
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
        round((g.km_recorridos_fuera/g.km_recorridos)*100,2)  || '%' porc_Total
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
                round(km_recorridos_gps/1000,2) km_recorridos,
                round(km_recorridos_ruta/1000,2) km_recorridos_fuera
                from 
                giz_resumen.giz_reporte11 r11
                where r11.id_ett='${req.params.empresaId}' and r11.id_ruta='${req.params.rutaId}' and to_char(r11.fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            where km_recorridos!=0
            group by 
            x.id_ett,
            x.id_ruta,
            x.placa_vehiculo
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);
        const resumen = await pg.query(`
        select 
            id,
            case
                when id = 1 then 'Pago de Subsidio por Vehículos, según kilómetros recorridos en su Ruta'
            end as concepto,
            round((random() * 10 + 1)::numeric, 2) porcentaje
        from generate_series(1, 1) as id`, []);

        return res.status(200).send({
            detalle:camelcaseKeys(detalle),
            resumen:camelcaseKeys(resumen),
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
const reporte11 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            id,
            'AVX' || '-' || (random() * 500 + 100)::int as placa,       
            floor(random() * 2000 + 1)::int as km_recorridos_fuera_ruta            
        from generate_series(1, 10) as id`, []);

        return res.status(200).send({
            detalle:camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
const reporte12 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            id,
            'AVX' || '-' || (random() * 500 + 100)::int as placa,       
            floor(random() * 2000 + 1)::int as tiempo_sin_transmision_gps            
            from generate_series(1, 10) as id`, []);

        return res.status(200).send({
            detalle:camelcaseKeys(detalle)
        });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

