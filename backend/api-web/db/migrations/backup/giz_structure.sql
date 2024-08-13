--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.5
-- Dumped by pg_dump version 9.5.5

-- Started on 2021-10-11 13:24:08



--
-- TOC entry 9 (class 2615 OID 391752)
-- Name: giz; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA giz;


ALTER SCHEMA giz OWNER TO postgres;

SET search_path = giz, pg_catalog;

--
-- TOC entry 249 (class 1255 OID 396518)
-- Name: fi_transmision(numeric, numeric, numeric, numeric, character varying, integer, character varying, integer); Type: FUNCTION; Schema: giz; Owner: postgres
--

CREATE FUNCTION fi_transmision(vi_latitud numeric, vi_longitud numeric, vi_velocidad numeric, vi_orientacion numeric, vi_fecha_emv character varying, vi_id_emv integer, vi_placa_vehiculo character varying, vi_id_evento integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
 INSERT INTO giz_test.giz_transmision( 
 latitud, 
 longitud, 
 velocidad, 
 orientacion, 
 fecha_emv, 
 id_emv, 
 placa_vehiculo, 
 id_evento)
 VALUES (vi_latitud, vi_longitud, vi_velocidad, vi_orientacion, to_timestamp(vi_fecha_emv, 'DD/MM/YYYY HH:MI:SS'), vi_id_emv, vi_placa_vehiculo, vi_id_evento); 

 update 
  giz_test.giz_vehiculo
 set
  latitud = vi_latitud,
  longitud = vi_longitud,
  velocidad = vi_velocidad,
  orientacion = vi_orientacion,
  fecha_emv = to_timestamp(vi_fecha_emv, 'DD/MM/YYYY HH:MI:SS'),
  id_evento = vi_id_evento
 where
  id_emv = vi_id_emv and
  placa_vehiculo = vi_placa_vehiculo;

 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$$;


ALTER FUNCTION giz.fi_transmision(vi_latitud numeric, vi_longitud numeric, vi_velocidad numeric, vi_orientacion numeric, vi_fecha_emv character varying, vi_id_emv integer, vi_placa_vehiculo character varying, vi_id_evento integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 225 (class 1259 OID 391967)
-- Name: giz_acceso; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_acceso (
    login_usuario character varying(255) NOT NULL,
    id_municipalidad character varying(6) NOT NULL
);


ALTER TABLE giz_acceso OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 391824)
-- Name: giz_acciones; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_acciones (
    id_opcion integer NOT NULL,
    id_accion integer NOT NULL,
    nombre_accion character varying(100) NOT NULL,
    glosa_accion character varying(100) NOT NULL,
    ruta_accion character varying(100) NOT NULL
);


ALTER TABLE giz_acciones OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 391931)
-- Name: giz_alertas; Type: TABLE; Schema: giz; Owner: postgres
--

-- CREATE TABLE giz_alertas (
--     id_alertas integer NOT NULL,
--     nombre_alerta character varying(100) NOT NULL,
--     titulo_alerta character varying(100) NOT NULL,
--     descipcion_alerta character varying(1000) NOT NULL,
--     glosa_alerta character varying(50) NOT NULL,
--     accion_alerta character varying(20) NOT NULL
-- );

CREATE TABLE giz.giz_alertas
(
  id_alertas serial NOT NULL DEFAULT nextval('giz.giz_alertas_id_alertas_seq'::regclass),
  nombre_alerta character varying(100) NOT NULL,
  titulo_alerta character varying(100) NOT NULL,
  descripcion_alerta character varying(200) NOT NULL,
  glosa_alerta character varying(50) NOT NULL,
  accion_alerta character varying(20)
);

ALTER TABLE giz_alertas OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 391794)
-- Name: giz_clasificacion; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_clasificacion (
    id_clasificacion integer NOT NULL,
    nombre_clasificacion character varying(200) NOT NULL,
    cod_color character varying(6) NOT NULL,
    color integer NOT NULL
);


ALTER TABLE giz_clasificacion OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 391926)
-- Name: giz_concesion; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_concesion (
    id_concesion integer NOT NULL,
    id_municipalidad character varying(6) NOT NULL,
    id_ett integer NOT NULL,
    id_ruta integer NOT NULL,
    id_estado_concesion integer NOT NULL
);


ALTER TABLE giz_concesion OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 391871)
-- Name: giz_departamento; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_departamento (
    id_departamento character varying(2) NOT NULL,
    nombre_dpto character varying(50) NOT NULL,
    geom public.geometry
);


ALTER TABLE giz_departamento OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 391884)
-- Name: giz_distrito; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_distrito (
    id_distrito character varying(2) NOT NULL,
    id_provincia character varying(2) NOT NULL,
    id_departamento character varying(2) NOT NULL,
    geom public.geometry,
    nombre_distrito text
);


ALTER TABLE giz_distrito OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 391829)
-- Name: giz_emv; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE SEQUENCE giz.giz_emv_id_emv_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 4
  CACHE 1;
ALTER TABLE giz.giz_emv_id_emv_seq
  OWNER TO postgres;


CREATE TABLE giz_emv (
    id_emv integer NOT NULL DEFAULT nextval('giz.giz_emv_id_emv_seq'::regclass),
    razon_social character varying(200) NOT NULL,
    glosa_empresa character varying(100),
    ruc character varying(11) NOT NULL,
    direccion character varying(200),
    id_estado_empresa integer NOT NULL,
    fecha_registro timestamp without time zone,
    fecha_actualizacion character varying(50) NOT NULL,
    token character varying(200),
    ip character varying(15),
    login_usuario character varying(255),
    password_usuario character varying(255),
    correo character varying(50)
);


ALTER TABLE giz_emv OWNER TO postgres;
ALTER TABLE giz.giz_emv ALTER COLUMN fecha_actualizacion DROP NOT NULL;
ALTER TABLE giz.giz_emv ALTER COLUMN fecha_registro TYPE date USING fecha_registro::date;
ALTER TABLE giz.giz_emv ALTER COLUMN fecha_registro SET DEFAULT now();

ALTER TABLE giz.giz_emv ALTER COLUMN fecha_actualizacion TYPE date USING fecha_actualizacion::date;
ALTER TABLE giz.giz_emv ALTER COLUMN fecha_actualizacion SET DEFAULT now();


--
-- TOC entry 193 (class 1259 OID 391779)
-- Name: giz_estado_concesion; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estado_concesion (
    id_estado_concesion integer NOT NULL,
    nombre character varying(200) NOT NULL,
    glosa character varying(50) NOT NULL
);


ALTER TABLE giz_estado_concesion OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 391809)
-- Name: giz_estado_empresa; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estado_empresa (
    id_estado_empresa integer NOT NULL,
    nombre_estado_empresa character varying(200) NOT NULL,
    glosa_estado_empresa character varying(100) NOT NULL
);


ALTER TABLE giz_estado_empresa OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 391784)
-- Name: giz_estado_ett; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estado_ett (
    id_estado_ett integer NOT NULL,
    nombre_estado_ett character varying(20) NOT NULL
);


ALTER TABLE giz_estado_ett OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 391814)
-- Name: giz_estado_opcion; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estado_opcion (
    id_estado integer NOT NULL,
    nombre_estado_opcion character varying(50) NOT NULL
);


ALTER TABLE giz_estado_opcion OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 391804)
-- Name: giz_estado_vehiculo; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estado_vehiculo (
    id_estado_vehiculo integer NOT NULL,
    nombre_estado_vehiculo character varying(200) NOT NULL,
    glosa_estado_vehiculo character varying(20) NOT NULL
);


ALTER TABLE giz_estado_vehiculo OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 391949)
-- Name: giz_estadousuario; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estadousuario (
    id_estadousuario integer NOT NULL,
    nombre_estadusuario character varying(200) NOT NULL,
    glosa_estadousuario character varying(20) NOT NULL,
    estado character varying(1) NOT NULL
);


ALTER TABLE giz_estadousuario OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 391897)
-- Name: giz_ett; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE SEQUENCE giz.giz_eett_id_eett_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE giz.giz_eett_id_eett_seq
  OWNER TO postgres;

CREATE TABLE giz_ett (
    id_municipalidad character varying(6) NOT NULL,
    id_ett integer NOT NULL DEFAULT nextval('giz.giz_eett_id_eett_seq'::regclass),
    ruc_ett character varying(11),
    razonsocial_empresa character varying(1000) NOT NULL,
    direccion character varying(100),
    fecha_registro character varying(50) DEFAULT to_char(now(), 'dd-mm-yyyy hh24:mm'::text),
    id_estado_ett integer NOT NULL,
    telefono character varying(200),
    correo character varying(200)
);


ALTER TABLE giz_ett OWNER TO postgres;
ALTER TABLE giz.giz_ett RENAME COLUMN razonsocial_empresa TO razon_social_empresa;
--
-- TOC entry 192 (class 1259 OID 391774)
-- Name: giz_eventos; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_eventos (
    id_eventos integer NOT NULL,
    nombre_evento character varying(200) NOT NULL,
    glosa character varying(50) NOT NULL
);


ALTER TABLE giz_eventos OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 391913)
-- Name: giz_flotavehiculos; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_flotavehiculos (
    id_municipalidad character varying(6) NOT NULL,
    id_ett integer NOT NULL,
    placa_vehiculo character varying(10) NOT NULL,
    id_ruta integer
);


ALTER TABLE giz_flotavehiculos OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 391847)
-- Name: giz_hex_log_registros; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_hex_log_registros (
    gid character varying(50) NOT NULL,
    id_transmision integer NOT NULL
);


ALTER TABLE giz_hex_log_registros OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 391799)
-- Name: giz_hexagonos; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_hexagonos (
    gid character varying(50) NOT NULL,
    id_hexagono integer NOT NULL,
    geom character varying(200) NOT NULL,
    id_clasificacion integer NOT NULL,
    id_departamento character varying(2) NOT NULL,
    id_provincia character varying(2) NOT NULL,
    id_distrito character varying(2) NOT NULL
);


ALTER TABLE giz_hexagonos OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 391861)
-- Name: giz_inicio_operacion; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_inicio_operacion (
    id_operacion integer NOT NULL,
    inicio_operacion timestamp without time zone NOT NULL,
    fin_operacion timestamp without time zone NOT NULL,
    placa_vehiculo character varying(10) NOT NULL
);


ALTER TABLE giz_inicio_operacion OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 391765)
-- Name: giz_log; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_log (
    id_log integer NOT NULL,
    detalle_json character varying(200) NOT NULL,
    fecha_registro timestamp without time zone NOT NULL,
    tabla character varying NOT NULL,
    id_usuario integer NOT NULL
);


ALTER TABLE giz_log OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 391763)
-- Name: giz_log_id_log_seq; Type: SEQUENCE; Schema: giz; Owner: postgres
--

CREATE SEQUENCE giz_log_id_log_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE giz_log_id_log_seq OWNER TO postgres;

--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 190
-- Name: giz_log_id_log_seq; Type: SEQUENCE OWNED BY; Schema: giz; Owner: postgres
--

ALTER SEQUENCE giz_log_id_log_seq OWNED BY giz_log.id_log;


--
-- TOC entry 213 (class 1259 OID 391892)
-- Name: giz_municipalidad; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_municipalidad (
    id_municipalidad character varying(6) NOT NULL,
    id_distrito character varying(2),
    id_provincia character varying(2) NOT NULL,
    id_departamento character varying(2) NOT NULL,
    id_tipo_municipalidad integer,
    nombre_municipalidad character varying(100) NOT NULL,
    nombre_corto character varying(50),
    glosa_municipalidad character varying(30)
);


ALTER TABLE giz_municipalidad OWNER TO postgres;
--
-- TOC entry 201 (class 1259 OID 391819)
-- Name: giz_opcion; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_opcion (
    id_opcion integer NOT NULL,
    nombre_opcion character varying(20) NOT NULL,
    ruta_opcion character varying(50) NOT NULL,
    orden_opcion character varying(10) NOT NULL,
    id_estado integer NOT NULL,
    parent_id_opcion integer NOT NULL
);


ALTER TABLE giz_opcion OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 391918)
-- Name: giz_paradero; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_paradero (
    id_paradero integer NOT NULL,
    id_municipalidad character varying(6) NOT NULL,
    id_ruta integer NOT NULL,
    nombre_paradero character varying(100) NOT NULL,
    glosa_paradero character varying(50) NOT NULL,
    geom public.geometry NOT NULL,
    sentido character varying(4)
);


ALTER TABLE giz_paradero OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 391944)
-- Name: giz_parametros; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz.giz_parametros
(
    id_parametro serial,
    nombre_parametro character varying(100) COLLATE pg_catalog."default" NOT NULL,
    glosa_parametro character varying(50) COLLATE pg_catalog."default" NOT NULL,
    valor_parametro character varying(100) COLLATE pg_catalog."default" NOT NULL,
    estado_parametro character varying(1) COLLATE pg_catalog."default" NOT NULL DEFAULT 'A',
    CONSTRAINT giz_parametros_pk PRIMARY KEY (id_parametro)
);


ALTER TABLE giz_parametros OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 391758)
-- Name: giz_patio; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_patio (
    id_patio integer NOT NULL,
    nombre_patio character varying(200) NOT NULL,
    glosa_patio character varying(100) NOT NULL,
    latitud character varying(10) NOT NULL,
    longitud character varying(10) NOT NULL
);


ALTER TABLE giz_patio OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 391789)
-- Name: giz_persona; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE SEQUENCE giz.giz_persona_id_persona_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE giz.giz_persona_id_persona_seq
  OWNER TO postgres;


CREATE TABLE giz_persona (
     id_persona integer NOT NULL DEFAULT nextval('giz.giz_persona_id_persona_seq'::regclass),
  nombre character varying(50) NOT NULL,
  apellido_paterno character varying(50) NOT NULL,
  apellido_materno character varying(50) NOT NULL,
  nombres_completos character varying(150) NOT NULL,
  nro_doc_identidad character varying(20) NOT NULL,
  tipo_doc_identidad character varying(20),
  fecha_registro character varying(50),
  correo character varying(100),
  fecha_actualizacion character varying(50),
  ultimo_acceso character varying(50),
  CONSTRAINT giz_persona_pk PRIMARY KEY (id_persona)
);


ALTER TABLE giz_persona OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 391879)
-- Name: giz_provincia; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_provincia (
    id_provincia character varying(2) NOT NULL,
    id_departamento character varying(2) NOT NULL,
    nombre_provincia text,
    geom public.geometry
);


ALTER TABLE giz_provincia OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 391954)
-- Name: giz_rol; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_rol (
    id_rol integer NOT NULL,
    nombre_rol character varying(100) NOT NULL,
    glosa_rol character varying(20) NOT NULL,
    estado character varying(1) NOT NULL
);


ALTER TABLE giz_rol OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 391905)
-- Name: giz_ruta; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE SEQUENCE giz.giz_ruta_id_ruta_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 22
  CACHE 1;
ALTER TABLE giz.giz_ruta_id_ruta_seq
  OWNER TO postgres;


CREATE TABLE giz_ruta (
    id_municipalidad character varying(6) NOT NULL,
    id_ruta integer NOT NULL DEFAULT nextval('giz.giz_ruta_id_ruta_seq'::regclass),
    id_patio integer,
    codigo_ruta character varying(200) NOT NULL,
    geom public.geometry,
    nombre_ruta character varying(100) NOT NULL,
    glosa_ruta character varying(50),
    detalle_ruta character varying,
     geom21 public.geometry,
     sentido character varying(10)
);


ALTER TABLE giz_ruta OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 391753)
-- Name: giz_tipo_vehiculo; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_tipo_vehiculo (
    id_tipo_vehiculo integer NOT NULL,
    nombre_tipo character varying(200) NOT NULL,
    glosa character varying(50) NOT NULL
);


ALTER TABLE giz_tipo_vehiculo OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 391866)
-- Name: giz_tipomunicipalidad; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_tipomunicipalidad (
    id_tipo_municipalidad integer NOT NULL,
    nombre_tipomunicipalidad character varying(200) NOT NULL,
    glosa_tipomuncipalidad character varying(20) NOT NULL
);


ALTER TABLE giz_tipomunicipalidad OWNER TO postgres;
--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_transmision; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_transmision (
    id_transmision integer,
    latitud numeric(22,2),
    longitud numeric(22,2),
    velocidad smallint,
    orientacion smallint,
    fecha_emv timestamp without time zone,
    fecha_registro timestamp without time zone DEFAULT now(),
    id_emv integer,
    placa_vehiculo character varying(10),
    id_evento integer
);


ALTER TABLE giz_transmision OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 391837)
-- Name: giz_transmision_id_transmision_seq; Type: SEQUENCE; Schema: giz; Owner: postgres
--

CREATE SEQUENCE giz_transmision_id_transmision_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE giz_transmision_id_transmision_seq OWNER TO postgres;

--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 204
-- Name: giz_transmision_id_transmision_seq; Type: SEQUENCE OWNED BY; Schema: giz; Owner: postgres
--

ALTER SEQUENCE giz_transmision_id_transmision_seq OWNED BY giz_transmision.id_transmision;


--
-- TOC entry 224 (class 1259 OID 391959)
-- Name: giz_usuario; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_usuario (
    login_usuario character varying(255) NOT NULL,
    password_usuario character varying(255) NOT NULL,
    id_estadousuario integer NOT NULL,
    id_persona integer NOT NULL
);


ALTER TABLE giz_usuario OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 391972)
-- Name: giz_usuario_opcion; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_usuario_opcion (
    id_usuario_opcion integer NOT NULL,
    login_usuario character varying(255) NOT NULL,
    id_opcion integer NOT NULL
);


ALTER TABLE giz_usuario_opcion OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 391977)
-- Name: giz_usuario_rol; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_usuario_rol (
    login_usuario character varying(255) NOT NULL,
    id_rol integer NOT NULL
);


ALTER TABLE giz_usuario_rol OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 391852)
-- Name: giz_vehiculo; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_vehiculo (
    placa_vehiculo character varying(10) NOT NULL,
    afabricacion_vehiculo character varying(4),
    id_estado_vehiculo integer,
    codigo_soat character varying(50),
    vencimiento_soat date,
    id_tipo_vehiculo integer,
    latitud numeric(22,2),
    longitud numeric(22,2),
    velocidad smallint,
    orientacion smallint,
    fecha_emv date,
    fecha_registro timestamp without time zone DEFAULT now(),
    id_emv integer,
    id_evento integer
);


ALTER TABLE giz_vehiculo OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 391939)
-- Name: giz_vehiculo_alertas; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_vehiculo_alertas (
    id_alertas serial NOT NULL,
    placa_vehiculo character varying(10) NOT NULL,
    fecha_alerta date NOT NULL,
    accion character varying(200) NOT NULL
);



ALTER TABLE giz_vehiculo_alertas OWNER TO postgres;

--
-- TOC entry 3227 (class 2604 OID 391768)
-- Name: id_log; Type: DEFAULT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_log ALTER COLUMN id_log SET DEFAULT nextval('giz_log_id_log_seq'::regclass);


--
-- TOC entry 3228 (class 2604 OID 391842)
-- Name: id_transmision; Type: DEFAULT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_transmision ALTER COLUMN id_transmision SET DEFAULT nextval('giz_transmision_id_transmision_seq'::regclass);


--
-- TOC entry 3303 (class 2606 OID 391971)
-- Name: giz_acceso_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_acceso
    ADD CONSTRAINT giz_acceso_pk PRIMARY KEY (login_usuario, id_municipalidad);


--
-- TOC entry 3258 (class 2606 OID 391828)
-- Name: giz_acciones_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_acciones
    ADD CONSTRAINT giz_acciones_pk PRIMARY KEY (id_opcion, id_accion);


--
-- TOC entry 3291 (class 2606 OID 391938)
-- Name: giz_alertas_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_alertas
    ADD CONSTRAINT giz_alertas_pk PRIMARY KEY (id_alertas);


--
-- TOC entry 3246 (class 2606 OID 391798)
-- Name: giz_clasificacion_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_clasificacion
    ADD CONSTRAINT giz_clasificacion_pk PRIMARY KEY (id_clasificacion);


--
-- TOC entry 3289 (class 2606 OID 391930)
-- Name: giz_concesion_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_concesion
    ADD CONSTRAINT giz_concesion_pk PRIMARY KEY (id_concesion, id_municipalidad, id_ett, id_ruta);


--
-- TOC entry 3271 (class 2606 OID 391878)
-- Name: giz_departamento_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_departamento
    ADD CONSTRAINT giz_departamento_pk PRIMARY KEY (id_departamento);


--
-- TOC entry 3277 (class 2606 OID 391891)
-- Name: giz_distrito_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_distrito
    ADD CONSTRAINT giz_distrito_pk PRIMARY KEY (id_distrito, id_provincia, id_departamento);


--
-- TOC entry 3260 (class 2606 OID 391836)
-- Name: giz_emv_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_emv
    ADD CONSTRAINT giz_emv_pk PRIMARY KEY (id_emv);


--
-- TOC entry 3240 (class 2606 OID 391783)
-- Name: giz_estado_concesion_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_estado_concesion
    ADD CONSTRAINT giz_estado_concesion_pk PRIMARY KEY (id_estado_concesion);


--
-- TOC entry 3252 (class 2606 OID 391813)
-- Name: giz_estado_empresa_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_estado_empresa
    ADD CONSTRAINT giz_estado_empresa_pk PRIMARY KEY (id_estado_empresa);


--
-- TOC entry 3242 (class 2606 OID 391788)
-- Name: giz_estado_ett_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_estado_ett
    ADD CONSTRAINT giz_estado_ett_pk PRIMARY KEY (id_estado_ett);


--
-- TOC entry 3254 (class 2606 OID 391818)
-- Name: giz_estado_opcion_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_estado_opcion
    ADD CONSTRAINT giz_estado_opcion_pk PRIMARY KEY (id_estado);


--
-- TOC entry 3250 (class 2606 OID 391808)
-- Name: giz_estado_vehiculo_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_estado_vehiculo
    ADD CONSTRAINT giz_estado_vehiculo_pk PRIMARY KEY (id_estado_vehiculo);


--
-- TOC entry 3297 (class 2606 OID 391953)
-- Name: giz_estadousuario_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_estadousuario
    ADD CONSTRAINT giz_estadousuario_pk PRIMARY KEY (id_estadousuario);


--
-- TOC entry 3281 (class 2606 OID 391904)
-- Name: giz_ett_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_ett
    ADD CONSTRAINT giz_ett_pk PRIMARY KEY (id_municipalidad, id_ett);


--
-- TOC entry 3238 (class 2606 OID 391778)
-- Name: giz_eventos_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_eventos
    ADD CONSTRAINT giz_eventos_pk PRIMARY KEY (id_eventos);


--
-- TOC entry 3285 (class 2606 OID 391917)
-- Name: giz_flotavehiculos_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_flotavehiculos
    ADD CONSTRAINT giz_flotavehiculos_pk PRIMARY KEY (id_municipalidad, id_ett, placa_vehiculo);


--
-- TOC entry 3262 (class 2606 OID 391851)
-- Name: giz_hex_log_registros_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_hex_log_registros
    ADD CONSTRAINT giz_hex_log_registros_pk PRIMARY KEY (gid, id_transmision);


--
-- TOC entry 3248 (class 2606 OID 391803)
-- Name: giz_hexagonos_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_hexagonos
    ADD CONSTRAINT giz_hexagonos_pk PRIMARY KEY (gid);


--
-- TOC entry 3266 (class 2606 OID 391865)
-- Name: giz_inicio_operacion_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_inicio_operacion
    ADD CONSTRAINT giz_inicio_operacion_pk PRIMARY KEY (id_operacion);


--
-- TOC entry 3236 (class 2606 OID 391773)
-- Name: giz_log_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_log
    ADD CONSTRAINT giz_log_pk PRIMARY KEY (id_log);


--
-- TOC entry 3279 (class 2606 OID 391896)
-- Name: giz_muncipalidad_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_municipalidad
    ADD CONSTRAINT giz_muncipalidad_pk PRIMARY KEY (id_municipalidad);


--
-- TOC entry 3256 (class 2606 OID 391823)
-- Name: giz_opcion_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_opcion
    ADD CONSTRAINT giz_opcion_pk PRIMARY KEY (id_opcion);


--
-- TOC entry 3287 (class 2606 OID 391925)
-- Name: giz_paradero_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_paradero
    ADD CONSTRAINT giz_paradero_pk PRIMARY KEY (id_paradero, id_municipalidad, id_ruta);


--
-- TOC entry 3295 (class 2606 OID 391948)
-- Name: giz_parametros_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--


--
-- TOC entry 3234 (class 2606 OID 391762)
-- Name: giz_patio_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_patio
    ADD CONSTRAINT giz_patio_pk PRIMARY KEY (id_patio);


--
-- TOC entry 3244 (class 2606 OID 391793)
-- Name: giz_persona_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--


--
-- TOC entry 3273 (class 2606 OID 391883)
-- Name: giz_provincia_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_provincia
    ADD CONSTRAINT giz_provincia_pk PRIMARY KEY (id_provincia, id_departamento);


--
-- TOC entry 3299 (class 2606 OID 391958)
-- Name: giz_rol_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_rol
    ADD CONSTRAINT giz_rol_pk PRIMARY KEY (id_rol);


--
-- TOC entry 3283 (class 2606 OID 391912)
-- Name: giz_ruta_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_ruta
    ADD CONSTRAINT giz_ruta_pk PRIMARY KEY (id_municipalidad, id_ruta);


--
-- TOC entry 3232 (class 2606 OID 391757)
-- Name: giz_tipo_vehiculo_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_tipo_vehiculo
    ADD CONSTRAINT giz_tipo_vehiculo_pk PRIMARY KEY (id_tipo_vehiculo);


--
-- TOC entry 3268 (class 2606 OID 391870)
-- Name: giz_tipomunicipalidad_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_tipomunicipalidad
    ADD CONSTRAINT giz_tipo_municipalidad_pk PRIMARY KEY (id_tipo_municipalidad);


--
-- TOC entry 3305 (class 2606 OID 391976)
-- Name: giz_usuario_opcion_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_usuario_opcion
    ADD CONSTRAINT giz_usuario_opcion_pk PRIMARY KEY (id_usuario_opcion, login_usuario, id_opcion);


--
-- TOC entry 3301 (class 2606 OID 391966)
-- Name: giz_usuario_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_usuario
    ADD CONSTRAINT giz_usuario_pk PRIMARY KEY (login_usuario);


--
-- TOC entry 3307 (class 2606 OID 391981)
-- Name: giz_usuario_rol_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_usuario_rol
    ADD CONSTRAINT giz_usuario_rol_pk PRIMARY KEY (login_usuario, id_rol);


--
-- TOC entry 3293 (class 2606 OID 391943)
-- Name: giz_vehiculo_alertas_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_vehiculo_alertas
    ADD CONSTRAINT giz_vehiculo_alertas_pk PRIMARY KEY (id_alertas, placa_vehiculo);


--
-- TOC entry 3264 (class 2606 OID 391860)
-- Name: giz_vehiculo_pk; Type: CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_vehiculo
    ADD CONSTRAINT giz_vehiculo_pk PRIMARY KEY (placa_vehiculo);


--
-- TOC entry 3269 (class 1259 OID 396516)
-- Name: departamento_geom_idx; Type: INDEX; Schema: giz; Owner: postgres
--

CREATE INDEX departamento_geom_idx ON giz_departamento USING gist (geom);


--
-- TOC entry 3275 (class 1259 OID 396517)
-- Name: distrito_geom_idx; Type: INDEX; Schema: giz; Owner: postgres
--

CREATE INDEX distrito_geom_idx ON giz_distrito USING gist (geom);


--
-- TOC entry 3274 (class 1259 OID 396515)
-- Name: provincia_geom_idx; Type: INDEX; Schema: giz; Owner: postgres
--

CREATE INDEX provincia_geom_idx ON giz_provincia USING gist (geom);


--
-- TOC entry 3333 (class 2606 OID 392127)
-- Name: giz_alertas_giz_vehiculo_alertas_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_vehiculo_alertas
    ADD CONSTRAINT giz_alertas_giz_vehiculo_alertas_fk FOREIGN KEY (id_alertas) REFERENCES giz_alertas(id_alertas);


--
-- TOC entry 3308 (class 2606 OID 392007)
-- Name: giz_clasificacion_giz_hexagonos_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_hexagonos
    ADD CONSTRAINT giz_clasificacion_giz_hexagonos_fk FOREIGN KEY (id_clasificacion) REFERENCES giz_clasificacion(id_clasificacion);


--
-- TOC entry 3318 (class 2606 OID 392072)
-- Name: giz_departamento_giz_provincia_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_provincia
    ADD CONSTRAINT giz_departamento_giz_provincia_fk FOREIGN KEY (id_departamento) REFERENCES giz_departamento(id_departamento);


--
-- TOC entry 3313 (class 2606 OID 392047)
-- Name: giz_emv_giz_transmision_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_transmision
    ADD CONSTRAINT giz_emv_giz_transmision_fk FOREIGN KEY (id_emv) REFERENCES giz_emv(id_emv);


--
-- TOC entry 3329 (class 2606 OID 391992)
-- Name: giz_estado_concesion_giz_concesion_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_concesion
    ADD CONSTRAINT giz_estado_concesion_giz_concesion_fk FOREIGN KEY (id_estado_concesion) REFERENCES giz_estado_concesion(id_estado_concesion);


--
-- TOC entry 3312 (class 2606 OID 392022)
-- Name: giz_estado_empresa_giz_emv_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_emv
    ADD CONSTRAINT giz_estado_empresa_giz_emv_fk FOREIGN KEY (id_estado_empresa) REFERENCES giz_estado_empresa(id_estado_empresa);


--
-- TOC entry 3321 (class 2606 OID 391997)
-- Name: giz_estado_ett_giz_ett_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_ett
    ADD CONSTRAINT giz_estado_ett_giz_ett_fk FOREIGN KEY (id_estado_ett) REFERENCES giz_estado_ett(id_estado_ett);


--
-- TOC entry 3309 (class 2606 OID 392027)
-- Name: giz_estado_opcion_giz_opcion_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_opcion
    ADD CONSTRAINT giz_estado_opcion_giz_opcion_fk FOREIGN KEY (id_estado) REFERENCES giz_estado_opcion(id_estado);


--
-- TOC entry 3316 (class 2606 OID 392017)
-- Name: giz_estado_vehiculo_giz_vehiculo_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_vehiculo
    ADD CONSTRAINT giz_estado_vehiculo_giz_vehiculo_fk FOREIGN KEY (id_estado_vehiculo) REFERENCES giz_estado_vehiculo(id_estado_vehiculo);


--
-- TOC entry 3335 (class 2606 OID 392132)
-- Name: giz_estadousuario_giz_usuario_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_usuario
    ADD CONSTRAINT giz_estadousuario_giz_usuario_fk FOREIGN KEY (id_estadousuario) REFERENCES giz_estadousuario(id_estadousuario);


--
-- TOC entry 3330 (class 2606 OID 392102)
-- Name: giz_ett_giz_concesion_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_concesion
    ADD CONSTRAINT giz_ett_giz_concesion_fk FOREIGN KEY (id_municipalidad, id_ett) REFERENCES giz_ett(id_municipalidad, id_ett);


--
-- TOC entry 3326 (class 2606 OID 392107)
-- Name: giz_ett_giz_flotavehiculos_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_flotavehiculos
    ADD CONSTRAINT giz_ett_giz_flotavehiculos_fk FOREIGN KEY (id_municipalidad, id_ett) REFERENCES giz_ett(id_municipalidad, id_ett);


--
-- TOC entry 3314 (class 2606 OID 392012)
-- Name: giz_hexagonos_giz_hex_log_registros_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_hex_log_registros
    ADD CONSTRAINT giz_hexagonos_giz_hex_log_registros_fk FOREIGN KEY (gid) REFERENCES giz_hexagonos(gid);


--
-- TOC entry 3336 (class 2606 OID 392097)
-- Name: giz_muncipalidad_giz_acceso_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_acceso
    ADD CONSTRAINT giz_muncipalidad_giz_acceso_fk FOREIGN KEY (id_municipalidad) REFERENCES giz_municipalidad(id_municipalidad);


--
-- TOC entry 3322 (class 2606 OID 392092)
-- Name: giz_muncipalidad_giz_ett_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_ett
    ADD CONSTRAINT giz_muncipalidad_giz_ett_fk FOREIGN KEY (id_municipalidad) REFERENCES giz_municipalidad(id_municipalidad);


--
-- TOC entry 3324 (class 2606 OID 392087)
-- Name: giz_muncipalidad_giz_ruta_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_ruta
    ADD CONSTRAINT giz_muncipalidad_giz_ruta_fk FOREIGN KEY (id_municipalidad) REFERENCES giz_municipalidad(id_municipalidad);


--
-- TOC entry 3311 (class 2606 OID 392037)
-- Name: giz_opcion_giz_acciones_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_acciones
    ADD CONSTRAINT giz_opcion_giz_acciones_fk FOREIGN KEY (id_opcion) REFERENCES giz_opcion(id_opcion);


--
-- TOC entry 3310 (class 2606 OID 392042)
-- Name: giz_opcion_giz_opcion_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_opcion
    ADD CONSTRAINT giz_opcion_giz_opcion_fk FOREIGN KEY (parent_id_opcion) REFERENCES giz_opcion(id_opcion);


--
-- TOC entry 3338 (class 2606 OID 392032)
-- Name: giz_opcion_giz_usuario_opcion_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_usuario_opcion
    ADD CONSTRAINT giz_opcion_giz_usuario_opcion_fk FOREIGN KEY (id_opcion) REFERENCES giz_opcion(id_opcion);


--
-- TOC entry 3323 (class 2606 OID 391987)
-- Name: giz_patio_giz_ruta_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_ruta
    ADD CONSTRAINT giz_patio_giz_ruta_fk FOREIGN KEY (id_patio) REFERENCES giz_patio(id_patio);


--
-- TOC entry 3334 (class 2606 OID 392002)
-- Name: giz_personal_giz_usuario_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_usuario
    ADD CONSTRAINT giz_personal_giz_usuario_fk FOREIGN KEY (id_persona) REFERENCES giz_persona(id_persona);


--
-- TOC entry 3319 (class 2606 OID 392077)
-- Name: giz_provincia_giz_distrito_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_distrito
    ADD CONSTRAINT giz_provincia_giz_distrito_fk FOREIGN KEY (id_provincia, id_departamento) REFERENCES giz_provincia(id_provincia, id_departamento);


--
-- TOC entry 3340 (class 2606 OID 392137)
-- Name: giz_rol_giz_usuario_rol_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_usuario_rol
    ADD CONSTRAINT giz_rol_giz_usuario_rol_fk FOREIGN KEY (id_rol) REFERENCES giz_rol(id_rol);


--
-- TOC entry 3331 (class 2606 OID 392112)
-- Name: giz_ruta_giz_concesion_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_concesion
    ADD CONSTRAINT giz_ruta_giz_concesion_fk FOREIGN KEY (id_municipalidad, id_ruta) REFERENCES giz_ruta(id_municipalidad, id_ruta);


--
-- TOC entry 3327 (class 2606 OID 392122)
-- Name: giz_ruta_giz_flotavehiculos_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_flotavehiculos
    ADD CONSTRAINT giz_ruta_giz_flotavehiculos_fk FOREIGN KEY (id_municipalidad, id_ruta) REFERENCES giz_ruta(id_municipalidad, id_ruta);


--
-- TOC entry 3328 (class 2606 OID 392117)
-- Name: giz_ruta_giz_paradero_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_paradero
    ADD CONSTRAINT giz_ruta_giz_paradero_fk FOREIGN KEY (id_municipalidad, id_ruta) REFERENCES giz_ruta(id_municipalidad, id_ruta);


--
-- TOC entry 3315 (class 2606 OID 391982)
-- Name: giz_tipo_vehiculo_giz_vehiculo_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_vehiculo
    ADD CONSTRAINT giz_tipo_vehiculo_giz_vehiculo_fk FOREIGN KEY (id_tipo_vehiculo) REFERENCES giz_tipo_vehiculo(id_tipo_vehiculo);


--
-- TOC entry 3320 (class 2606 OID 392067)
-- Name: giz_tipomunicipalidad_giz_muncipalidad_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_municipalidad
    ADD CONSTRAINT giz_tipo_municipalidad_giz_muncipalidad_fk FOREIGN KEY (id_tipo_municipalidad) REFERENCES giz_tipomunicipalidad(id_tipo_municipalidad);


--
-- TOC entry 3337 (class 2606 OID 392152)
-- Name: giz_usuario_giz_acceso_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_acceso
    ADD CONSTRAINT giz_usuario_giz_acceso_fk FOREIGN KEY (login_usuario) REFERENCES giz_usuario(login_usuario);


--
-- TOC entry 3339 (class 2606 OID 392147)
-- Name: giz_usuario_giz_usuario_opcion_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_usuario_opcion
    ADD CONSTRAINT giz_usuario_giz_usuario_opcion_fk FOREIGN KEY (login_usuario) REFERENCES giz_usuario(login_usuario);


--
-- TOC entry 3341 (class 2606 OID 392142)
-- Name: giz_usuario_giz_usuario_rol_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_usuario_rol
    ADD CONSTRAINT giz_usuario_giz_usuario_rol_fk FOREIGN KEY (login_usuario) REFERENCES giz_usuario(login_usuario);


--
-- TOC entry 3325 (class 2606 OID 392052)
-- Name: giz_vehiculo_giz_flotavehiculos_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_flotavehiculos
    ADD CONSTRAINT giz_vehiculo_giz_flotavehiculos_fk FOREIGN KEY (placa_vehiculo) REFERENCES giz_vehiculo(placa_vehiculo);


--
-- TOC entry 3317 (class 2606 OID 392062)
-- Name: giz_vehiculo_giz_inicio_operacion_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_inicio_operacion
    ADD CONSTRAINT giz_vehiculo_giz_inicio_operacion_fk FOREIGN KEY (placa_vehiculo) REFERENCES giz_vehiculo(placa_vehiculo);


--
-- TOC entry 3332 (class 2606 OID 392057)
-- Name: giz_vehiculo_giz_vehiculo_alertas_fk; Type: FK CONSTRAINT; Schema: giz; Owner: postgres
--

ALTER TABLE ONLY giz_vehiculo_alertas
    ADD CONSTRAINT giz_vehiculo_giz_vehiculo_alertas_fk FOREIGN KEY (placa_vehiculo) REFERENCES giz_vehiculo(placa_vehiculo);


CREATE OR REPLACE FUNCTION giz.fi_transmision(
	vi_latitud numeric,
	vi_longitud numeric,
	vi_velocidad numeric,
	vi_orientacion numeric,
	vi_fecha_emv character varying,
	vi_id_emv integer,
	vi_placa_vehiculo character varying,
	vi_id_evento integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    
AS $BODY$
BEGIN
 INSERT INTO giz_test.giz_transmision( 
 latitud, 
 longitud, 
 velocidad, 
 orientacion, 
 fecha_emv, 
 id_emv, 
 placa_vehiculo, 
 id_evento)
 VALUES (vi_latitud, vi_longitud, vi_velocidad, vi_orientacion, to_timestamp(vi_fecha_emv, 'DD/MM/YYYY HH:MI:SS'), vi_id_emv, vi_placa_vehiculo, vi_id_evento); 

 update 
  giz_test.giz_vehiculo
 set
  latitud = vi_latitud,
  longitud = vi_longitud,
  velocidad = vi_velocidad,
  orientacion = vi_orientacion,
  fecha_emv = to_timestamp(vi_fecha_emv, 'DD/MM/YYYY HH:MI:SS'),
  id_evento = vi_id_evento
 where
  id_emv = vi_id_emv and
  placa_vehiculo = vi_placa_vehiculo;

 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;


CREATE TYPE giz.transmisiones as (latitud numeric, longitud numeric, velocidad smallint, orientacion smallint, fecha_emv character varying, id_emv integer, placa_vehiculo character varying, id_evento integer);

CREATE OR REPLACE FUNCTION giz.fi_transmision_v2(
	transmisiones giz.transmisiones[])
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    
AS $BODY$
DECLARE
 trx giz.transmisiones;
BEGIN 
 FOREACH trx IN array transmisiones 
 LOOP
  BEGIN
   INSERT INTO giz_test.giz_transmision(latitud, longitud, velocidad, orientacion, fecha_emv, id_emv, placa_vehiculo, id_evento)
   VALUES (trx.latitud, trx.longitud, trx.velocidad, trx.orientacion, to_timestamp(trx.fecha_emv, 'DD/MM/YYYY HH:MI:SS'), trx.id_emv, trx.placa_vehiculo, trx.id_evento);
   
   UPDATE 
    giz_test.giz_vehiculo
   SET
    latitud = trx.latitud,
    longitud = trx.longitud,
    velocidad = trx.velocidad,
    orientacion = trx.orientacion,
    fecha_emv = to_timestamp(trx.fecha_emv, 'DD/MM/YYYY HH:MI:SS'),
    id_evento = trx.id_evento
   WHERE
    id_emv = trx.id_emv and
    placa_vehiculo = trx.placa_vehiculo;
	
  EXCEPTION WHEN OTHERS THEN
   RAISE NOTICE 'ERROR INSERT';
   --SAVE INTO LOG TABLE
  END;  
 END LOOP;
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;