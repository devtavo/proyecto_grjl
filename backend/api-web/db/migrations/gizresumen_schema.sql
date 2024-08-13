--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.2
-- Dumped by pg_dump version 9.5.5

-- Started on 2021-11-15 13:41:03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;


--
-- TOC entry 9 (class 2615 OID 608189)
-- Name: giz_resumen; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA giz_resumen;


ALTER SCHEMA giz_resumen OWNER TO postgres;

SET search_path = giz_resumen, pg_catalog;

--
-- TOC entry 1384 (class 1255 OID 669858)
-- Name: fi_data_reporte01(); Type: FUNCTION; Schema: giz_resumen; Owner: postgres
--

CREATE FUNCTION fi_data_reporte01() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
 
insert into giz_resumen.giz_reporte01 
select
x.fecha,
x.id_municipalidad,
x.id_ett,
x.id_ruta,
x.placa_vehiculo,
x.salidas_12,
(x.salidas_12-x.viajes_completos_12) viajes_incompletos_12,
case when (x.salidas_12-x.viajes_completos_12)>0 then x.salidas_12-x.viajes_completos_12 else x.salidas_12 end as viajes_completos_12,

x.salidas_21,
(x.salidas_21-x.viajes_completos_21) viajes_incompletos_21,
case when (x.salidas_21-x.viajes_completos_21)>0 then x.salidas_21-x.viajes_completos_21 else x.salidas_21 end as viajes_completos_21,

case when x.salidas_12=0 then 0 else  (x.viajes_completos_12::decimal/x.salidas_12::decimal) end as p_viajes_completos_12,
case when x.salidas_21=0 then 0 else  (x.viajes_completos_21::decimal/x.salidas_21::decimal) end as p_viajes_completos_21


from (	
	select
	now() fecha,
	gf.id_municipalidad ,
	gf.id_ett,
	coalesce(gf.id_ruta,0)id_ruta,
	tst.placa_vehiculo, 
	coalesce((select count(*) from (select
	 ts.placa_vehiculo, 
	 ts.id_transmision,
	 ts.latitud,
	 ts.longitud,
	 ts.fecha_registro,
	 pd.id_ruta,
	 pd.geom ,
	 ST_MakePoint(ts.latitud, ts.longitud),
	 ST_Distance(
	  ST_MakePoint(ts.latitud, ts.longitud),
	(select geom12 from giz.giz_ruta where codigo_ruta = 'A5')
	 )
	from giz.giz_transmision ts
	--inner join giz.giz_ruta rt ON ST_Dwithin(rt.geom12, ST_MakePoint(ts.latitud, ts.longitud), 0.001)
	inner join giz.giz_paradero pd
	ON ST_Dwithin(pd.geom, ST_MakePoint(ts.latitud, ts.longitud), 80, true) and pd.sentido = '1-2' and inicio_fin = 'I'
	where placa_vehiculo=tst.placa_vehiculo
	)x
	group by 
	placa_vehiculo),0)	salidas_12,
		coalesce((select count(*) from (select
	 ts.placa_vehiculo, 
	 ts.id_transmision,
	 ts.latitud,
	 ts.longitud,
	 ts.fecha_registro,
	 pd.id_ruta,
	 pd.geom ,
	 ST_MakePoint(ts.latitud, ts.longitud),
	 ST_Distance(
	  ST_MakePoint(ts.latitud, ts.longitud),
	(select geom12 from giz.giz_ruta where codigo_ruta = 'A5')
	 )
	from giz.giz_transmision ts
	--inner join giz.giz_ruta rt ON ST_Dwithin(rt.geom12, ST_MakePoint(ts.latitud, ts.longitud), 0.001)
	inner join giz.giz_paradero pd
	ON ST_Dwithin(pd.geom, ST_MakePoint(ts.latitud, ts.longitud), 80, true) and pd.sentido = '2-1' and inicio_fin = 'I'
	where placa_vehiculo=tst.placa_vehiculo
	)x
	group by 
	placa_vehiculo),0)	salidas_21,

	coalesce ((select count(*) from (select
	 ts.placa_vehiculo, 
	 ts.id_transmision,
	 ts.latitud,
	 ts.longitud,
	 ts.fecha_registro,
	 pd.id_ruta,
	 pd.geom ,
	 ST_MakePoint(ts.latitud, ts.longitud),
	 ST_Distance(
	  ST_MakePoint(ts.latitud, ts.longitud),
	(select geom12 from giz.giz_ruta where codigo_ruta = 'A5')
	 )
	from giz.giz_transmision ts
	--inner join giz.giz_ruta rt ON ST_Dwithin(rt.geom12, ST_MakePoint(ts.latitud, ts.longitud), 0.001)
	inner join giz.giz_paradero pd
	ON ST_Dwithin(pd.geom, ST_MakePoint(ts.latitud, ts.longitud), 80, true) and pd.sentido = '1-2' and inicio_fin = 'F'
	where placa_vehiculo=tst.placa_vehiculo
	)x
	group by 
	placa_vehiculo),0)viajes_completos_12,
		coalesce ((select count(*) from (select
	 ts.placa_vehiculo, 
	 ts.id_transmision,
	 ts.latitud,
	 ts.longitud,
	 ts.fecha_registro,
	 pd.id_ruta,
	 pd.geom ,
	 ST_MakePoint(ts.latitud, ts.longitud),
	 ST_Distance(
	  ST_MakePoint(ts.latitud, ts.longitud),
	(select geom12 from giz.giz_ruta where codigo_ruta = 'A5')
	 )
	from giz.giz_transmision ts
	--inner join giz.giz_ruta rt ON ST_Dwithin(rt.geom12, ST_MakePoint(ts.latitud, ts.longitud), 0.001)
	inner join giz.giz_paradero pd
	ON ST_Dwithin(pd.geom, ST_MakePoint(ts.latitud, ts.longitud), 80, true) and pd.sentido = '2-1' and inicio_fin = 'F'
	where placa_vehiculo=tst.placa_vehiculo
	)x
	group by 
	placa_vehiculo),0)viajes_completos_21
from giz.giz_transmision tst inner join giz.giz_flotavehiculos gf on tst.placa_vehiculo=gf.placa_vehiculo 
--where gf.id_ruta != 0 
group by 
	tst.placa_vehiculo,
	gf.id_municipalidad ,
	gf.id_ett ,
	gf.id_ruta 
	)x;
	
EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$$;


ALTER FUNCTION giz_resumen.fi_data_reporte01() OWNER TO postgres;

--
-- TOC entry 1385 (class 1255 OID 687103)
-- Name: fi_data_reporte03(); Type: FUNCTION; Schema: giz_resumen; Owner: postgres
--

CREATE FUNCTION fi_data_reporte03() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
 
insert into giz_resumen.giz_reporte03 
select 
now() fecha,
x.id_municipalidad,
x.id_ett,
x.id_ruta,
x.placa_vehiculo,
hora::integer,
count(*) cantidad,
'1-2'::text sentido,
0 buses_s_12,
0 buses_s_21,
(count(*)::decimal/60) p_transmision_12,
0.0 p_transmision_21
from(
select 
gf.id_municipalidad, 
gf.id_ett,
gf.id_ruta,
gt.placa_vehiculo,
to_char(fecha_emv,'HH24') hora,
to_char(fecha_emv,'MI') min
from giz.giz_transmision gt inner join giz.giz_flotavehiculos gf on gf.placa_vehiculo = gt.placa_vehiculo inner join giz.giz_ruta gr on gf.id_ruta=gr.id_ruta
where st_dwithin(st_makepoint(gt.latitud,gt.longitud),gr.geom12,25,true)
group by 
to_char(fecha_emv,'HH24'),
to_char(fecha_emv,'MI'),
gf.id_municipalidad, 
gf.id_ruta,
gf.id_ett,
gt.placa_vehiculo
order by 1,2
)x
group by x.id_ruta,
hora,x.id_ett,x.placa_vehiculo,id_municipalidad
order by hora;

--sentido 21
insert into giz_resumen.giz_reporte03 
select 
now() fecha,
x.id_municipalidad,
x.id_ett,
x.id_ruta,
x.placa_vehiculo,
hora::integer,
count(*) cantidad,
'2-1'::text sentido,
0 buses_s_12,
0 buses_s_21,
0.0 p_transmision_12,
(count(*)::decimal/60) p_transmision_21
from(
select 
gf.id_municipalidad, 
gf.id_ett,
gf.id_ruta,
gt.placa_vehiculo,
to_char(fecha_emv,'HH24') hora,
to_char(fecha_emv,'MI') min
from giz.giz_transmision gt inner join giz.giz_flotavehiculos gf on gf.placa_vehiculo = gt.placa_vehiculo inner join giz.giz_ruta gr on gf.id_ruta=gr.id_ruta
where st_dwithin(st_makepoint(gt.latitud,gt.longitud),gr.geom21,25,true)--aqui cambiar el sentido en el geom de la ruta y la distancia permitida
group by 
to_char(fecha_emv,'HH24'),
to_char(fecha_emv,'MI'),
gf.id_municipalidad, 
gf.id_ruta,
gf.id_ett,
gt.placa_vehiculo
order by 1,2
)x
group by x.id_ruta,
hora,x.id_ett,x.placa_vehiculo,id_municipalidad
order by hora;
	
EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$$;


ALTER FUNCTION giz_resumen.fi_data_reporte03() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 188 (class 1259 OID 608193)
-- Name: giz_reporte01; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte01 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    placa_vehiculo character varying(10),
    salida_1_2 integer,
    viajes_incompletos_1_2 integer,
    viajes_completos_1_2 integer,
    salida_2_1 integer,
    viajes_completos_2_1 integer,
    viajes_incompletos_2_1 integer,
    p_viajes_completos_1_2 numeric(4,3),
    p_viajes_incompletos_2_1 numeric(4,3)
);


ALTER TABLE giz_reporte01 OWNER TO postgres;

--
-- TOC entry 316 (class 1259 OID 678915)
-- Name: giz_reporte03; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte03 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    placa_vehiculo character varying(10),
    hora integer,
    cantidad integer,
    sentido character varying(3),
    buses_en_serv_1_2 integer,
    buses_en_serv_2_1 integer,
    porc_transmision_1_2 numeric(3,3),
    porc_transmision_2_1 numeric(3,3)
);


ALTER TABLE giz_reporte03 OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 634700)
-- Name: giz_reporte04; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte04 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    placa_vehiculo character varying(10),
    longitud integer,
    n_paradas_ruta integer,
    n_viajes_completo integer,
    v_media_ruta12 integer,
    v_media_ruta21 integer
);


ALTER TABLE giz_reporte04 OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 634703)
-- Name: giz_reporte05; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte05 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    placa_vehiculo character varying(10),
    v_con_gps integer,
    v_sin_gps integer,
    v_servicio_c_gps integer,
    p_vehiculos_servicio_c_gps integer
);


ALTER TABLE giz_reporte05 OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 634706)
-- Name: giz_reporte06; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte06 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    placa_vehiculo character varying(10),
    v_con_gps integer,
    a_boton_panico integer,
    n_vehiculos_act_btn integer,
    p_vehiculos_servicio_c_gps numeric(3,3)
);


ALTER TABLE giz_reporte06 OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 634709)
-- Name: giz_reporte07; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte07 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    sentido integer,
    placa_vehiculo character varying(10),
    longitud_rutas integer,
    n_completos_ett integer,
    n_incompletos_ett integer,
    km_recorridos_con_ett integer,
    km_recorridos_inc_ett integer,
    tot_km_recorridos_s12 integer,
    porc_km_recorridos_s12 numeric(3,3)
);


ALTER TABLE giz_reporte07 OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 634712)
-- Name: giz_reporte08; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte08 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    sentido integer,
    placa_vehiculo character varying(10),
    longitud_rutas integer,
    n_paraderos_ruta integer,
    n_viajes_detenciones_100 integer,
    n_viajes_detenciones_inc integer,
    n_detenciones_no_realizadas_paraderos integer,
    porc_viajes_detenciones_paraderos_12 numeric(3,3)
);


ALTER TABLE giz_reporte08 OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 634715)
-- Name: giz_reporte09; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte09 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    sentido integer,
    placa_vehiculo character varying(10),
    porc_viajes_completos_12 numeric(3,3),
    porc_viajes_completos_21 numeric(3,3),
    porc_transmision_gps_min_12 numeric(3,3),
    velo_media_ruta12 integer,
    velo_media_ruta21 integer,
    porc_vehiculos_servicio_gps numeric(3,3),
    porc_alertas_panico_vehi_gps numeric(3,3),
    porc_km_recorridos12 numeric(3,3),
    porc_km_recorridos21 numeric(3,3),
    porc_viajes_detenciones_paraderos12 numeric(3,3),
    porc_viajes_detenciones_paraderos21 numeric(3,3),
    porc_km_recorridos_rutas_vs_gps numeric(3,3),
    pago_subsidio integer
);


ALTER TABLE giz_reporte09 OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 634719)
-- Name: giz_reporte10; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte10 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    sentido integer,
    placa_vehiculo character varying(10),
    km_recorridos_gps integer,
    km_recorridos_ruta integer,
    porc_km_recorridos_ruta_vs_gps numeric(3,3)
);


ALTER TABLE giz_reporte10 OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 634722)
-- Name: giz_reporte11; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte11 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    sentido integer,
    placa_vehiculo character varying(10),
    tot_km_recorridos integer,
    km_recorridos_ruta integer,
    pago_subsidio integer
);


ALTER TABLE giz_reporte11 OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 634725)
-- Name: giz_reporte12; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte12 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    sentido integer,
    placa_vehiculo character varying(10),
    km_recorridos_fuera_ruta integer
);


ALTER TABLE giz_reporte12 OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 634728)
-- Name: giz_reporte14; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte14 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    sentido integer,
    placa_vehiculo character varying(10),
    tiempo_sin_transmision_gps integer
);


ALTER TABLE giz_reporte14 OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 634731)
-- Name: giz_reporte15; Type: TABLE; Schema: giz_resumen; Owner: postgres
--

CREATE TABLE giz_reporte15 (
    fecha date,
    id_municipalidad character varying(6),
    id_ett integer,
    id_ruta integer,
    sentido integer,
    placa_vehiculo character varying(10),
    tot_tiempo_acumulado_o_s integer
);


ALTER TABLE giz_reporte15 OWNER TO postgres;

-- Completed on 2021-11-15 13:41:04

--
-- PostgreSQL database dump complete
--

