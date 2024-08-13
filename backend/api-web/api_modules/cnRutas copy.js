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
    if (consultaId === 3) return consulta3(req, res);
    if (consultaId === 4) return consulta4(req, res);
    if (consultaId === 5) return consulta5(req, res);
    if (consultaId === 10) return consulta10(req, res);
    if (consultaId === 11) return consulta11(req, res);
    if (consultaId === 16) return consulta16(req, res);
    if (consultaId === 19) return consulta19(req, res);
    if (consultaId === 21) return consulta21(req, res);
    if (consultaId === 24) return consulta24(req, res);

}

const consulta1 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.km_recorridos,
        g.porc_total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            round((sum(x.km_recorridos)/(select sum(d.km_recorridos) from (select 
                            row_number() over(order by 1),
                            placa_vehiculo,
                            round(km_recorridos/1000,2) km_recorridos
                            from 
                            giz_resumen.giz_consulta01 c1
                            where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                            order by 2
                    )d
                ) ) *100,2) || '%' porc_total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                round(km_recorridos/1000,2) km_recorridos
                from 
                giz_resumen.giz_consulta01 c1
                where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const subquery = `select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta ,
        g.km_recorridos,
        g.porc_total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            round((sum(x.km_recorridos)/(select sum(d.km_recorridos) from (select 
                            row_number() over(order by 1),
                            placa_vehiculo,
                            round(km_recorridos/1000,2) km_recorridos
                            from 
                            giz_resumen.giz_consulta01 c1
                            where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                            order by 2
                    )d
                ) ) *100,2)  porc_total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                round(km_recorridos/1000,2) km_recorridos
                from 
                giz_resumen.giz_consulta01 c1
                where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`;

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'KILÓMETROS RECORRIDOS POR LOS VEHÍCULOS EN SERVICIO' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.codigo_ruta) AS categories) t) as \"xAxis\",
                (select array_to_json(array_agg(to_json(u))) from (select to_json(t) from(select to_json(t)as title from(select case when y=1 then 'Kilometros Recorridos' else 'Porcentaje Total' end as text from generate_series(1,2)y ) t ) t union all select to_json('opposite:'||'true'::text) as opposite )u) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                    select 
                    array_to_json(array_agg(to_json(c))) as series
                    from (
                     select 
                     case when y=1	
                         then 'Kilometros Recorridos' 
                         else 'Porcentaje Total' end as name, 
                     case when y=1 
                         then 'column'  
                         else 'spline'  end as type, 
                     case when y=1
                         then 1
                         else 0 end as \"yAxis\",
                     case when y=1
                         then JSON_AGG(x.km_recorridos) 
                         else JSON_AGG(x.porc_total) end as data
                     from  
                     generate_series(1,2)y 
                   )c
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
            where gv.afabricacion_vehiculo !=''
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
            id,
            'Ruta' || ' ' || id as ruta,
            floor(random() * 10 + 1)::int as km_recorridos_ruta,
            floor(random() * 10 + 1)::int as km_recorridos_fuera_ruta,
            round((random() * 10 + 1)::numeric, 2)  as porc_km_recorridos_fuera_ruta
        from generate_series(1, 10) as id`, []);

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'KILÓMETROS RECORRIDOS FUERA DE RUTA' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.ruta) AS categories) t) as \"xAxis\",
                (select array_to_json(array_agg(to_json(u))) from (select to_json(t) from(select to_json(t)as title from(select case when y=1 then 'Kilometros Recorridos' else 'Porcentaje Total' end as text from generate_series(1,2)y ) t ) t union all select to_json('opposite:'||'true'::text) as opposite )u) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                    select 
                    array_to_json(array_agg(to_json(c))) as series
                    from (
                        select 
                        case when y=1 then 'Kilómetros recorridos en Ruta' 
                            when y=2 then 'Kilómetros recorridos fuera de Ruta' 
                            when y=3 then 'Porcentaje de Kilómetros Recorridos fuera de Ruta' end as name, 
                        case 
                            when y=1 then 'column'  
                            when y=2 then 'column'  
                            when y=3 then 'spline'  
                            end as type, 
                        case when y=1
                            then 1
                            else 0 end as \"yAxis\",
                        case 
                            when y=1 then JSON_AGG(x.km_recorridos_ruta) 
                            when y=2 then JSON_AGG(x.km_recorridos_fuera_ruta) 
                            when y=3 then JSON_AGG(x.porc_km_recorridos_fuera_ruta) 
                        end as data
                                from  
                        generate_series(1,3)y 
                    )c
                )
            from(
                select 
                    id,
                    'Ruta' || ' ' || id as ruta,
                    floor(random() * 10 + 1)::int as km_recorridos_ruta,
                    floor(random() * 10 + 1)::int as km_recorridos_fuera_ruta,
                    round((random() * 10 + 1)::numeric, 2)  as porc_km_recorridos_fuera_ruta
                from generate_series(1, 10) as id
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

const consulta5 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            id,
            'Ruta' || ' ' || id as ruta,
            floor(random() * 10 + 1)::int as km_recorridos_ruta,
            floor(random() * 10 + 1)::int as km_recorridos_fuera_ruta,
            round((random() * 10 + 1)::numeric, 2)  as porc_km_recorridos_fuera_ruta
        from generate_series(1, 10) as id`, []);

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'KILÓMETROS RECORRIDOS FUERA DE RUTA' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.ruta) AS categories) t) as \"xAxis\",
                (select array_to_json(array_agg(to_json(u))) from (select to_json(t) from(select to_json(t)as title from(select case when y=1 then 'Kilometros Recorridos' else 'Porcentaje Total' end as text from generate_series(1,2)y ) t ) t union all select to_json('opposite:'||'true'::text) as opposite )u) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                    select 
                    array_to_json(array_agg(to_json(c))) as series
                    from (
                        select 
                        case when y=1 then 'Kilómetros recorridos en Ruta' 
                            when y=2 then 'Kilómetros recorridos fuera de Ruta' 
                            when y=3 then 'Porcentaje de Kilómetros Recorridos fuera de Ruta' end as name, 
                        case 
                            when y=1 then 'column'  
                            when y=2 then 'column'  
                            when y=3 then 'spline'  
                            end as type, 
                        case when y=1
                            then 1
                            else 0 end as \"yAxis\",
                        case 
                            when y=1 then JSON_AGG(x.km_recorridos_ruta) 
                            when y=2 then JSON_AGG(x.km_recorridos_fuera_ruta) 
                            when y=3 then JSON_AGG(x.porc_km_recorridos_fuera_ruta) 
                        end as data
                                from  
                        generate_series(1,3)y 
                    )c
                )
            from(
                select 
                    id,
                    'Ruta' || ' ' || id as ruta,
                    floor(random() * 10 + 1)::int as km_recorridos_ruta,
                    floor(random() * 10 + 1)::int as km_recorridos_fuera_ruta,
                    round((random() * 10 + 1)::numeric, 2)  as porc_km_recorridos_fuera_ruta
                from generate_series(1, 10) as id
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

const consulta10 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select  
                    id_ruta,
                    glosa_ruta,
                    sum(detencion) as detencion, 
                    sum(no_detencion) as no_detencion,
                    round(sum(no_detencion) / sum(detencion)::numeric, 2) as porc_no_detencion
                from giz_resumen.giz_consulta10 
                where
                    id_ett = ${req.body.empresaId}
                group by
                    id_ruta,
                    glosa_ruta`, []);

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'KILÓMETROS RECORRIDOS FUERA DE RUTA' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.ruta) AS categories) t) as \"xAxis\",
                (select array_to_json(array_agg(to_json(u))) from (select to_json(t) from(select to_json(t)as title from(select case when y=1 then 'Kilometros Recorridos' else 'Porcentaje Total' end as text from generate_series(1,2)y ) t ) t union all select to_json('opposite:'||'true'::text) as opposite )u) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                    select 
                    array_to_json(array_agg(to_json(c))) as series
                    from (
                        select 
                        case when y=1 then 'Kilómetros recorridos en Ruta' 
                            when y=2 then 'Kilómetros recorridos fuera de Ruta' 
                            when y=3 then 'Porcentaje de Kilómetros Recorridos fuera de Ruta' end as name, 
                        case 
                            when y=1 then 'column'  
                            when y=2 then 'column'  
                            when y=3 then 'spline'  
                            end as type, 
                        case when y=1
                            then 1
                            else 0 end as \"yAxis\",
                        case 
                            when y=1 then JSON_AGG(x.km_recorridos_ruta) 
                            when y=2 then JSON_AGG(x.km_recorridos_fuera_ruta) 
                            when y=3 then JSON_AGG(x.porc_km_recorridos_fuera_ruta) 
                        end as data
                                from  
                        generate_series(1,3)y 
                    )c
                )
            from(
                select 
                    id,
                    'Ruta' || ' ' || id as ruta,
                    floor(random() * 10 + 1)::int as km_recorridos_ruta,
                    floor(random() * 10 + 1)::int as km_recorridos_fuera_ruta,
                    round((random() * 10 + 1)::numeric, 2)  as porc_km_recorridos_fuera_ruta
                from generate_series(1, 10) as id
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

const consulta11 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.km_recorridos,
        g.porc_total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            round((sum(x.km_recorridos)/(select sum(d.km_recorridos) from (select 
                            row_number() over(order by 1),
                            placa_vehiculo,
                            round(km_recorridos/1000,2) km_recorridos
                            from 
                            giz_resumen.giz_consulta01 c1
                            where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                            order by 2
                    )d
                ) ) *100,2) || '%' porc_total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                round(km_recorridos/1000,2) km_recorridos
                from 
                giz_resumen.giz_consulta01 c1
                where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const subquery = `select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta ,
        g.km_recorridos,
        g.porc_total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            round((sum(x.km_recorridos)/(select sum(d.km_recorridos) from (select 
                            row_number() over(order by 1),
                            placa_vehiculo,
                            round(km_recorridos/1000,2) km_recorridos
                            from 
                            giz_resumen.giz_consulta01 c1
                            where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                            order by 2
                    )d
                ) ) *100,2)  porc_total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                round(km_recorridos/1000,2) km_recorridos
                from 
                giz_resumen.giz_consulta01 c1
                where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`;

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'KILÓMETROS RECORRIDOS POR LOS VEHÍCULOS EN SERVICIO' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.codigo_ruta) AS categories) t) as \"xAxis\",
                (select array_to_json(array_agg(to_json(u))) from (select to_json(t) from(select to_json(t)as title from(select case when y=1 then 'Kilometros Recorridos' else 'Porcentaje Total' end as text from generate_series(1,2)y ) t ) t union all select to_json('opposite:'||'true'::text) as opposite )u) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                    select 
                    array_to_json(array_agg(to_json(c))) as series
                    from (
                     select 
                     case when y=1	
                         then 'Kilometros Recorridos' 
                         else 'Porcentaje Total' end as name, 
                     case when y=1 
                         then 'column'  
                         else 'spline'  end as type, 
                     case when y=1
                         then 1
                         else 0 end as \"yAxis\",
                     case when y=1
                         then JSON_AGG(x.km_recorridos) 
                         else JSON_AGG(x.porc_total) end as data
                     from  
                     generate_series(1,2)y 
                   )c
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

const consulta16 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
            id,
            'Ruta' || ' ' || id as ruta,
            floor(random() * 10 + 1)::int as km_recorridos_ruta,
            floor(random() * 10 + 1)::int as km_recorridos_fuera_ruta,
            round((random() * 10 + 1)::numeric, 2)  as porc_km_recorridos_fuera_ruta
        from generate_series(1, 10) as id`, []);

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'KILÓMETROS RECORRIDOS FUERA DE RUTA' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.ruta) AS categories) t) as \"xAxis\",
                (select array_to_json(array_agg(to_json(u))) from (select to_json(t) from(select to_json(t)as title from(select case when y=1 then 'Kilometros Recorridos' else 'Porcentaje Total' end as text from generate_series(1,2)y ) t ) t union all select to_json('opposite:'||'true'::text) as opposite )u) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                    select 
                    array_to_json(array_agg(to_json(c))) as series
                    from (
                        select 
                        case when y=1 then 'Kilómetros recorridos en Ruta' 
                            when y=2 then 'Kilómetros recorridos fuera de Ruta' 
                            when y=3 then 'Porcentaje de Kilómetros Recorridos fuera de Ruta' end as name, 
                        case 
                            when y=1 then 'column'  
                            when y=2 then 'column'  
                            when y=3 then 'spline'  
                            end as type, 
                        case when y=1
                            then 1
                            else 0 end as \"yAxis\",
                        case 
                            when y=1 then JSON_AGG(x.km_recorridos_ruta) 
                            when y=2 then JSON_AGG(x.km_recorridos_fuera_ruta) 
                            when y=3 then JSON_AGG(x.porc_km_recorridos_fuera_ruta) 
                        end as data
                                from  
                        generate_series(1,3)y 
                    )c
                )
            from(
                select 
                    id,
                    'Ruta' || ' ' || id as ruta,
                    floor(random() * 10 + 1)::int as km_recorridos_ruta,
                    floor(random() * 10 + 1)::int as km_recorridos_fuera_ruta,
                    round((random() * 10 + 1)::numeric, 2)  as porc_km_recorridos_fuera_ruta
                from generate_series(1, 10) as id
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
            where gv.afabricacion_vehiculo !=''
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

const consulta21 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.km_recorridos,
        g.porc_total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            round((sum(x.km_recorridos)/(select sum(d.km_recorridos) from (select 
                            row_number() over(order by 1),
                            placa_vehiculo,
                            round(km_recorridos/1000,2) km_recorridos
                            from 
                            giz_resumen.giz_consulta01 c1
                            where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                            order by 2
                    )d
                ) ) *100,2) || '%' porc_total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                round(km_recorridos/1000,2) km_recorridos
                from 
                giz_resumen.giz_consulta01 c1
                where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const subquery = `select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta ,
        g.km_recorridos,
        g.porc_total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            round((sum(x.km_recorridos)/(select sum(d.km_recorridos) from (select 
                            row_number() over(order by 1),
                            placa_vehiculo,
                            round(km_recorridos/1000,2) km_recorridos
                            from 
                            giz_resumen.giz_consulta01 c1
                            where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                            order by 2
                    )d
                ) ) *100,2)  porc_total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                round(km_recorridos/1000,2) km_recorridos
                from 
                giz_resumen.giz_consulta01 c1
                where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`;

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'KILÓMETROS RECORRIDOS POR LOS VEHÍCULOS EN SERVICIO' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.codigo_ruta) AS categories) t) as \"xAxis\",
                (select array_to_json(array_agg(to_json(u))) from (select to_json(t) from(select to_json(t)as title from(select case when y=1 then 'Kilometros Recorridos' else 'Porcentaje Total' end as text from generate_series(1,2)y ) t ) t union all select to_json('opposite:'||'true'::text) as opposite )u) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                    select 
                    array_to_json(array_agg(to_json(c))) as series
                    from (
                     select 
                     case when y=1	
                         then 'Kilometros Recorridos' 
                         else 'Porcentaje Total' end as name, 
                     case when y=1 
                         then 'column'  
                         else 'spline'  end as type, 
                     case when y=1
                         then 1
                         else 0 end as \"yAxis\",
                     case when y=1
                         then JSON_AGG(x.km_recorridos) 
                         else JSON_AGG(x.porc_total) end as data
                     from  
                     generate_series(1,2)y 
                   )c
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

const consulta24 = async (req, res) => {
    try {
        const detalle = await pg.query(`
        select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta,
        g.km_recorridos,
        g.porc_total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            round((sum(x.km_recorridos)/(select sum(d.km_recorridos) from (select 
                            row_number() over(order by 1),
                            placa_vehiculo,
                            round(km_recorridos/1000,2) km_recorridos
                            from 
                            giz_resumen.giz_consulta01 c1
                            where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                            order by 2
                    )d
                ) ) *100,2) || '%' porc_total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                round(km_recorridos/1000,2) km_recorridos
                from 
                giz_resumen.giz_consulta01 c1
                where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`, []);

        const subquery = `select 
        row_number() over(order by 1) id,
        gett.razon_social_empresa,
        gr.codigo_ruta ,
        g.km_recorridos,
        g.porc_total
        from(
            select
            row_number() over(order by 1) id,
            x.id_ett ,
            x.id_ruta,
            (sum(x.km_recorridos)) km_recorridos,
            round((sum(x.km_recorridos)/(select sum(d.km_recorridos) from (select 
                            row_number() over(order by 1),
                            placa_vehiculo,
                            round(km_recorridos/1000,2) km_recorridos
                            from 
                            giz_resumen.giz_consulta01 c1
                            where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                            order by 2
                    )d
                ) ) *100,2)  porc_total
            from 
            (	
                select 
                row_number() over(order by 1),
                id_ett,
                id_ruta,
                placa_vehiculo,
                round(km_recorridos/1000,2) km_recorridos
                from 
                giz_resumen.giz_consulta01 c1
                where c1.id_ett='${req.params.empresaId}' and to_char(fecha,'dd-mm-yyyy') between '${req.params.inicio}' and '${req.params.final}'
                order by 2
            )x
            group by 
            x.id_ett,
            x.id_ruta
            order by 
            3 desc
        )g inner join giz.giz_ett gett on gett.id_ett= g.id_ett inner join giz.giz_ruta gr on g.id_ruta=gr.id_ruta`;

        const chart = await pg.query(`
        select
            row_to_json(x) as options
        FROM(
            select
                (select row_to_json(t) from(select 'KILÓMETROS RECORRIDOS POR LOS VEHÍCULOS EN SERVICIO' as text) t) as title,
                (select row_to_json(t) from(select false as enabled) t) as credits,
                (select row_to_json(t) FROM(select json_agg(x.codigo_ruta) AS categories) t) as \"xAxis\",
                (select array_to_json(array_agg(to_json(u))) from (select to_json(t) from(select to_json(t)as title from(select case when y=1 then 'Kilometros Recorridos' else 'Porcentaje Total' end as text from generate_series(1,2)y ) t ) t union all select to_json('opposite:'||'true'::text) as opposite )u) as \"yAxis\",
                (select row_to_json(t) from(select true as enabled) t) as exporting,
                (               
                    select 
                    array_to_json(array_agg(to_json(c))) as series
                    from (
                     select 
                     case when y=1	
                         then 'Kilometros Recorridos' 
                         else 'Porcentaje Total' end as name, 
                     case when y=1 
                         then 'column'  
                         else 'spline'  end as type, 
                     case when y=1
                         then 1
                         else 0 end as \"yAxis\",
                     case when y=1
                         then JSON_AGG(x.km_recorridos) 
                         else JSON_AGG(x.porc_total) end as data
                     from  
                     generate_series(1,2)y 
                   )c
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


