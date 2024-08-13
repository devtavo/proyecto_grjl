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
    id_accion serial NOT NULL,
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
  id_alertas serial NOT NULL ,
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
    id_clasificacion serial NOT NULL,
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
    id_concesion serial NOT NULL,
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



CREATE TABLE giz_emv (
    id_emv serial NOT NULL,
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
    id_estado_concesion serial NOT NULL,
    nombre character varying(200) NOT NULL,
    glosa character varying(50) NOT NULL
);


ALTER TABLE giz_estado_concesion OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 391809)
-- Name: giz_estado_empresa; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estado_empresa (
    id_estado_empresa serial NOT NULL,
    nombre_estado_empresa character varying(200) NOT NULL,
    glosa_estado_empresa character varying(100) NOT NULL
);


ALTER TABLE giz_estado_empresa OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 391784)
-- Name: giz_estado_ett; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estado_ett (
    id_estado_ett serial NOT NULL,
    nombre_estado_ett character varying(20) NOT NULL
);


ALTER TABLE giz_estado_ett OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 391814)
-- Name: giz_estado_opcion; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estado_opcion (
    id_estado serial NOT NULL,
    nombre_estado_opcion character varying(50) NOT NULL
);


ALTER TABLE giz_estado_opcion OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 391804)
-- Name: giz_estado_vehiculo; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estado_vehiculo (
    id_estado_vehiculo serial NOT NULL,
    nombre_estado_vehiculo character varying(200) NOT NULL,
    glosa_estado_vehiculo character varying(20) NOT NULL
);


ALTER TABLE giz_estado_vehiculo OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 391949)
-- Name: giz_estadousuario; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_estadousuario (
    id_estadousuario serial NOT NULL,
    nombre_estadusuario character varying(200) NOT NULL,
    glosa_estadousuario character varying(20) NOT NULL,
    estado character varying(1) NOT NULL
);


ALTER TABLE giz_estadousuario OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 391897)
-- Name: giz_ett; Type: TABLE; Schema: giz; Owner: postgres
--


CREATE TABLE giz_ett (
    id_municipalidad character varying(6) NOT NULL,
    id_ett serial NOT NULL ,
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
    id_eventos serial NOT NULL,
    nombre_evento character varying(200) NOT NULL,
    glosa character varying(50) NOT NULL
);


ALTER TABLE giz_eventos OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 391913)
-- Name: giz_flotavehiculos; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_flotavehiculos (
    id_flota_vehiculos serial NOT NULL,
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
    id_operacion serial NOT NULL,
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
    id_log serial NOT NULL,
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
    id_opcion serial NOT NULL,
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
    id_paradero serial NOT NULL,
    id_municipalidad character varying(6) NOT NULL,
    id_ruta integer NOT NULL,
    nombre_paradero character varying(100) NOT NULL,
    glosa_paradero character varying(50) NOT NULL,
    geom public.geometry NOT NULL,
    sentido character varying(4),
      inicio_fin text,

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
    valor_parametro json COLLATE pg_catalog."default" NOT NULL,
    estado_parametro character varying(1) COLLATE pg_catalog."default" NOT NULL DEFAULT 'A',
    CONSTRAINT giz_parametros_pk PRIMARY KEY (id_parametro)
);


ALTER TABLE giz_parametros OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 391758)
-- Name: giz_patio; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_patio (
    id_patio serial NOT NULL,
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


CREATE TABLE giz_persona (
  id_persona serial NOT NULL ,
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
    id_rol serial NOT NULL,
    nombre_rol character varying(100) NOT NULL,
    glosa_rol character varying(20) NOT NULL,
    estado character varying(1) NOT NULL
);


ALTER TABLE giz_rol OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 391905)
-- Name: giz_ruta; Type: TABLE; Schema: giz; Owner: postgres
--


CREATE TABLE giz_ruta (
    id_municipalidad character varying(6) NOT NULL,
    id_ruta serial NOT NULL,
    id_patio integer,
    codigo_ruta character varying(200) NOT NULL,
    geom12 public.geometry,
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
    id_tipo_vehiculo serial NOT NULL,
    nombre_tipo character varying(200) NOT NULL,
    glosa character varying(50) NOT NULL
);


ALTER TABLE giz_tipo_vehiculo OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 391866)
-- Name: giz_tipomunicipalidad; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_tipomunicipalidad (
    id_tipo_municipalidad serial NOT NULL,
    nombre_tipomunicipalidad character varying(200) NOT NULL,
    glosa_tipomuncipalidad character varying(20) NOT NULL
);


ALTER TABLE giz_tipomunicipalidad OWNER TO postgres;
--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_transmision; Type: TABLE; Schema: giz; Owner: postgres
--

CREATE TABLE giz_transmision (
    id_transmision serial,
    latitud numeric(22,20),
    longitud numeric(22,20),
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
    id_usuario_opcion serial NOT NULL,
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
    latitud numeric(22,20),
    longitud numeric(22,20),
    velocidad smallint,
    orientacion smallint,
    fecha_emv date,
    fecha_registro timestamp without time zone DEFAULT now(),
    id_emv integer,
    id_evento integer,
    fecha_registro_vehiculo timestamp without time zone DEFAULT now()
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

-- ALTER TABLE ONLY giz_log ALTER COLUMN id_log SET DEFAULT nextval('giz_log_id_log_seq'::regclass);


--
-- TOC entry 3228 (class 2604 OID 391842)
-- Name: id_transmision; Type: DEFAULT; Schema: giz; Owner: postgres
--

-- ALTER TABLE ONLY giz_transmision ALTER COLUMN id_transmision SET DEFAULT nextval('giz_transmision_id_transmision_seq'::regclass);


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
   INSERT INTO giz.giz_transmision(latitud, longitud, velocidad, orientacion, fecha_emv, id_emv, placa_vehiculo, id_evento)
   VALUES (trx.latitud, trx.longitud, trx.velocidad, trx.orientacion, to_timestamp(trx.fecha_emv, 'DD/MM/YYYY HH24:MI:SS'), trx.id_emv, trx.placa_vehiculo, trx.id_evento);
   
   UPDATE 
    giz.giz_vehiculo
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

CREATE OR REPLACE FUNCTION giz.fs_alerta1(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_unidades integer := 0;
 v_metros integer := 0;
 v_velocidad integer := 0;
 v_vertices_geojson geometry;
BEGIN
 select 
  (valor_parametro->> 'unidades')::integer,
  (valor_parametro->> 'metros')::integer,
  (valor_parametro->> 'velocidad')::integer INTO v_unidades, v_metros, v_velocidad
 from giz.giz_parametros where glosa_parametro = 'alerta1'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
 from(
  select (ST_DumpPoints(ST_GeomFromGeoJSON(vi_geojson))).geom
 ) r
 inner join giz.giz_transmision t on ST_DWithin(ST_MakePoint(t.longitud, t.latitud), r.geom, v_metros, true)
 where
  t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
  t.velocidad <= v_velocidad
 group by
  r.geom
 having 
  count(*) > v_unidades;
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta2(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_metros integer := 0;
 v_velocidad integer := 0;
BEGIN
 select 
  (valor_parametro->> 'metros')::integer,
  (valor_parametro->> 'velocidad')::integer INTO v_metros, v_velocidad
 from giz.giz_parametros where glosa_parametro = 'alerta2'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
 from giz.giz_transmision t
 where
  t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
  ST_DWithin(ST_MakePoint(t.longitud, t.latitud), ST_GeomFromGeoJSON(vi_geojson), v_metros, true) and
  t.velocidad > v_velocidad;
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta3(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_cod_alerta integer := 0;
 v_metros integer := 0;
BEGIN
 select 
  (valor_parametro->> 'codAlerta')::integer,
  (valor_parametro->> 'metros')::integer INTO v_cod_alerta, v_metros
 from giz.giz_parametros where glosa_parametro = 'alerta'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
from giz.giz_transmision t
where
 id_evento = v_cod_alerta and
 t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
 ST_DWithin(ST_MakePoint(t.longitud, t.latitud), ST_GeomFromGeoJSON(vi_geojson), v_metros, true);
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta4(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_cod_alerta integer := 0;
 v_metros integer := 0;
BEGIN
 select 
  (valor_parametro->> 'codAlerta')::integer,
  (valor_parametro->> 'metros')::integer INTO v_cod_alerta, v_metros
 from giz.giz_parametros where glosa_parametro = 'alerta3'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
from giz.giz_transmision t
where
 id_evento = v_cod_alerta and
 t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
 ST_DWithin(ST_MakePoint(t.longitud, t.latitud), ST_GeomFromGeoJSON(vi_geojson), v_metros, true);
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta5(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_metros integer := 0;
 v_distancia integer := 0;
BEGIN
 select 
  (valor_parametro->> 'metros')::integer,
  (valor_parametro->> 'distancia')::integer INTO v_metros, v_distancia
 from giz.giz_parametros where glosa_parametro = 'alerta5'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
 from giz.giz_transmision t
 where
  t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
  ST_DWithin(ST_MakePoint(t.longitud, t.latitud), ST_GeomFromGeoJSON(vi_geojson), v_metros, true) and
  ST_Distance(
   ST_GeomFromGeoJSON(vi_geojson),
   ST_MakePoint(t.longitud, t.latitud),
   true
  )::integer > v_distancia
 group by 
  ST_MakePoint(t.longitud, t.latitud);
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta6(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_metros integer := 0;
 v_segundos integer := 0;
BEGIN
 select 
  (valor_parametro->> 'metros')::integer,
  (valor_parametro->> 'segundos')::integer INTO v_metros, v_segundos
 from giz.giz_parametros where glosa_parametro = 'alerta6'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
 from(
  select
   t.placa_vehiculo,
   to_char(t.fecha_emv, 'hh:mi'),
   EXTRACT(EPOCH FROM (max(t.fecha_emv) - min(t.fecha_emv))) as segundos,
   t.latitud,
   t.longitud
  from giz.giz_transmision t
  where
   t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
   ST_DWithin(ST_MakePoint(t.longitud, t.latitud), ST_GeomFromGeoJSON(vi_geojson), v_metros, true)
  group by
   t.placa_vehiculo,
   to_char(t.fecha_emv, 'hh:mi'),
   t.latitud,
   t.longitud
  having count(*) > 1
  order by
   to_char(t.fecha_emv, 'hh:mi')
 ) t
 where
  t.segundos > v_segundos;
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta9(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_metros integer := 0;
 v_velocidad integer := 0;
BEGIN
 select 
  (valor_parametro->> 'metros')::integer,
  (valor_parametro->> 'velocidad')::integer INTO v_metros, v_velocidad
 from giz.giz_parametros where glosa_parametro = 'alerta9'; 

 return query
 select 
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
 from giz.giz_transmision t
 left join(
  select ST_GeomFromGeoJSON('{ "type": "LineString", "coordinates": [ [ -71.545408576, -16.341805294 ], [ -71.544424838, -16.341953745 ], [ -71.54391128, -16.342008181 ], [ -71.543312293, -16.342077543 ], [ -71.542381204, -16.342181325 ], [ -71.542439852, -16.34264787 ], [ -71.542512524, -16.343177836 ], [ -71.540688201, -16.343384178 ], [ -71.541871541, -16.354895682 ], [ -71.543526688, -16.354648622 ], [ -71.543656451, -16.356633671 ], [ -71.543790901, -16.358454831 ], [ -71.543877534, -16.360049087 ], [ -71.543960285, -16.361235728 ], [ -71.544042788, -16.362829385 ], [ -71.544104565, -16.36407795 ], [ -71.544161897, -16.365241114 ], [ -71.544210875, -16.36596254 ], [ -71.544108619, -16.366833998 ], [ -71.544043959, -16.367230029 ], [ -71.544304235, -16.368061339 ], [ -71.544396541, -16.368321356 ], [ -71.54456753, -16.368906518 ], [ -71.544599939, -16.369393752 ], [ -71.544587635, -16.37006542 ], [ -71.544567335, -16.370500861 ], [ -71.544532608, -16.371394317 ], [ -71.544457881, -16.371963764 ], [ -71.544428847, -16.373061534 ], [ -71.544431283, -16.373743046 ], [ -71.544511405, -16.374501154 ], [ -71.54470388, -16.376018746 ], [ -71.544723836, -16.376622747 ], [ -71.54469096, -16.377501021 ], [ -71.544690505, -16.378479794 ], [ -71.544698144, -16.378819278 ], [ -71.544710239, -16.379088109 ], [ -71.544805881, -16.379518391 ], [ -71.545022947, -16.380320957 ], [ -71.545199108, -16.38102492 ], [ -71.545372468, -16.381633765 ], [ -71.545597219, -16.382442983 ], [ -71.5458066, -16.383154649 ], [ -71.546002886, -16.383885165 ], [ -71.546217034, -16.384609963 ], [ -71.546377779, -16.38523102 ], [ -71.546812579, -16.386770283 ], [ -71.547024721, -16.387528772 ], [ -71.547325637, -16.388626364 ], [ -71.547536727, -16.389289762 ], [ -71.547649394, -16.389610465 ], [ -71.548034555, -16.390406805 ], [ -71.548455755, -16.391331684 ], [ -71.548824822, -16.392146322 ], [ -71.549046538, -16.39261845 ], [ -71.549211728, -16.392979902 ], [ -71.549250007, -16.393323592 ], [ -71.549207875, -16.393653264 ], [ -71.548880547, -16.394308851 ], [ -71.548505882, -16.395034323 ], [ -71.548344009, -16.395314823 ], [ -71.547843102, -16.394915074 ], [ -71.547583586, -16.394726707 ], [ -71.547166302, -16.39495329 ], [ -71.546637265, -16.395239596 ], [ -71.546049824, -16.395545372 ], [ -71.545387405, -16.395882244 ], [ -71.544982551, -16.396111755 ], [ -71.545116362, -16.396403839 ], [ -71.545408565, -16.397150234 ], [ -71.54567347, -16.397794129 ], [ -71.545862051, -16.398239647 ], [ -71.546345252, -16.399500359 ], [ -71.546460045, -16.399911424 ], [ -71.546481465, -16.400346715 ], [ -71.546661834, -16.400821367 ], [ -71.546837968, -16.4013161 ], [ -71.547020893, -16.401821591 ], [ -71.547200247, -16.402312319 ], [ -71.547344309, -16.40273647 ], [ -71.547537385, -16.403298623 ], [ -71.547700689, -16.403664687 ], [ -71.547721426, -16.403765568 ], [ -71.547079406, -16.403987129 ], [ -71.54666199, -16.404122017 ], [ -71.546327697, -16.404238194 ], [ -71.546015706, -16.40430685 ], [ -71.545672654, -16.404225683 ], [ -71.545505342, -16.403999927 ], [ -71.5453272, -16.403758815 ], [ -71.545277374, -16.403691924 ], [ -71.545046902, -16.403590505 ], [ -71.544814387, -16.403576231 ], [ -71.544432216, -16.403714703 ], [ -71.543992433, -16.40393246 ], [ -71.543542147, -16.404144442 ], [ -71.543010724, -16.404419657 ], [ -71.542989302, -16.404518434 ], [ -71.542964914, -16.404681909 ], [ -71.54284841, -16.404776795 ], [ -71.542637915, -16.404776204 ], [ -71.542285065, -16.405624109 ], [ -71.542090539, -16.406131665 ], [ -71.541949768, -16.406469171 ], [ -71.541920106, -16.406656386 ], [ -71.541936081, -16.406842332 ], [ -71.542076964, -16.40712047 ], [ -71.542178468, -16.407350762 ], [ -71.542264568, -16.407647153 ], [ -71.542298936, -16.407814243 ], [ -71.542240127, -16.40796652 ], [ -71.542050864, -16.408130014 ], [ -71.541640624, -16.40843472 ], [ -71.541178611, -16.408787699 ], [ -71.54022743, -16.409489318 ], [ -71.540383904, -16.409678287 ], [ -71.540242006, -16.410099296 ], [ -71.539857001, -16.410475302 ], [ -71.539491721, -16.410595177 ], [ -71.539254157, -16.410839185 ], [ -71.539009756, -16.411489949 ], [ -71.539160025, -16.41278882 ], [ -71.538991918, -16.41346076 ], [ -71.538885675, -16.413572011 ], [ -71.540406823, -16.413968504 ], [ -71.540304806, -16.414422855 ], [ -71.540468315, -16.414644126 ], [ -71.540925173, -16.4151048 ], [ -71.5414088, -16.415354593 ], [ -71.541817788, -16.415621858 ], [ -71.541563608, -16.415852786 ], [ -71.540246674, -16.417709741 ], [ -71.539268402, -16.418523518 ], [ -71.538140051, -16.420174514 ], [ -71.538100165, -16.420660389 ], [ -71.537481066, -16.422709268 ], [ -71.537322742, -16.423988435 ], [ -71.537548663, -16.424730604 ], [ -71.541531273, -16.42312182 ], [ -71.543423105, -16.422915479 ], [ -71.543916808, -16.422628167 ], [ -71.544343726, -16.422337077 ] ] }') as geom
 ) p on ST_DWithin(ST_MakePoint(t.longitud, t.latitud), p.geom, v_metros, true)
 where
  t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
  t.velocidad <= v_velocidad and
  p.geom is null 
 group by
  ST_MakePoint(t.longitud, t.latitud);
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta10(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_metros integer := 0;
 v_minutos integer := 0;
BEGIN
 select 
  (valor_parametro->> 'metros')::integer,
  (valor_parametro->> 'minutos')::integer INTO v_metros, v_minutos
 from giz.giz_parametros where glosa_parametro = 'alerta10'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
 from(
  select
   t.longitud, 
   t.latitud,
   t.placa_vehiculo,
   t.fecha_emv,
   lead(t.fecha_emv) OVER (partition by t.placa_vehiculo ORDER BY t.fecha_emv) as siguiente_fecha
  from giz.giz_transmision t
  where
   t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
   ST_DWithin(ST_MakePoint(t.longitud, t.latitud), ST_GeomFromGeoJSON(vi_geojson), v_metros, true)
  group by
   t.longitud, 
   t.latitud,
   t.placa_vehiculo,
   t.fecha_emv
  order by
   t.fecha_emv
 ) t
 where
  t.siguiente_fecha is not null and
  EXTRACT(EPOCH FROM (t.siguiente_fecha - t.fecha_emv)) / 60 > v_minutos;
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta12(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_cod_alerta integer := 0;
 v_metros integer := 0;
BEGIN
 select 
  (valor_parametro->> 'codAlerta')::integer,
  (valor_parametro->> 'metros')::integer INTO v_cod_alerta, v_metros
 from giz.giz_parametros where glosa_parametro = 'alerta12'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
from giz.giz_transmision t
where
 id_evento = v_cod_alerta and
 t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
 ST_DWithin(ST_MakePoint(t.longitud, t.latitud), ST_GeomFromGeoJSON(vi_geojson), v_metros, true);
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta13(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_cod_alerta integer := 0;
 v_metros integer := 0;
BEGIN
 select 
  (valor_parametro->> 'codAlerta')::integer,
  (valor_parametro->> 'metros')::integer INTO v_cod_alerta, v_metros
 from giz.giz_parametros where glosa_parametro = 'alerta13'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
 from giz.giz_transmision t
 where
  id_evento = v_cod_alerta and
  t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
  ST_DWithin(ST_MakePoint(t.longitud, t.latitud), ST_GeomFromGeoJSON(vi_geojson), v_metros, true);
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta14(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_metros integer := 0;
BEGIN
 select 
  (valor_parametro->> 'metros')::integer INTO  v_metros
 from giz.giz_parametros where glosa_parametro = 'alerta14'; 

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(t.longitud, t.latitud)))::json as geojson
 from giz.giz_transmision t
 where
  t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
  ST_DWithin(
   ST_MakePoint(t.longitud, t.latitud),
   ST_Union(
    ST_StartPoint(ST_GeomFromGeoJSON(vi_geojson)),
    ST_EndPoint(ST_GeomFromGeoJSON(vi_geojson))
   ),
   v_metros, 
   true)
 group by
  placa_vehiculo;
  
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

CREATE OR REPLACE FUNCTION giz.fs_alerta15(
	vi_geojson text,
	vi_fecha_inicio character varying,
	vi_fecha_fin character varying)
    RETURNS TABLE(geojson json) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
    
AS $BODY$
DECLARE
 v_metros integer := 0;
BEGIN
 select
  (valor_parametro->> 'metros')::integer INTO  v_metros
 from giz.giz_parametros where glosa_parametro = 'alerta15';

 return query
 select
  ST_AsGeoJSON(ST_Union(ST_MakePoint(x.longitud, x.latitud)))::json as geojson
 from(
 select
  t.id_transmision,
  t.id_evento,
  lead(t.id_evento) OVER (partition by t.placa_vehiculo ORDER BY t.fecha_emv) as siguiente_evento,
  t.longitud,
  t.latitud
 from giz.giz_transmision t
 where  
  t.fecha_emv between to_timestamp(vi_fecha_inicio, 'dd/mm/yyyy HH24:MI:SS') and to_timestamp(vi_fecha_fin, 'dd/mm/yyyy HH24:MI:SS') and
  ST_DWithin(ST_MakePoint(t.longitud, t.latitud), ST_GeomFromGeoJSON(vi_geojson), 1000, true)
 ) x
 where
  x.id_evento != 1 and
  x.siguiente_evento = 1;
 
 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$;

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_conductor; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz.giz_conductor
(
    id_conductor serial NOT NULL,
    id_persona integer NOT NULL,
    numero_licencia character varying(10) COLLATE pg_catalog."default",
    clase character varying(1) COLLATE pg_catalog."default",
    categoria character varying(50) COLLATE pg_catalog."default",
    fecha_expedicion date,
    fecha_revalidacion date,
    CONSTRAINT giz_conductor_pkey PRIMARY KEY (id_conductor)
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_sancion_administrativa; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz.giz_sancion_administrativa
(
    id_sancion_administrativa serial NOT NULL,
    fecha_documento date,
    descripcion_sancion text COLLATE pg_catalog."default",
    importe numeric,
    placa character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT giz_sancion_administrativa_pkey PRIMARY KEY (id_sancion_administrativa)
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_consulta4; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_consulta4
(
    fecha_emv date,
    id_ett integer,
    razon_social_empresa character varying(200),
    id_ruta integer,
    glosa_ruta character varying(50),
    placa_vehiculo character varying(10),
    km_en_ruta double precision,
    km_fuera_ruta double precision,
    porc_fuera_ruta double precision
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_consulta10; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_consulta10
(
    fecha_emv date,
    id_ett integer,
    razon_social_empresa character varying(200),
    id_ruta integer,
    glosa_ruta character varying(50),
    placa_vehiculo character varying(10),
    detencion bigint,
    no_detencion bigint,
    porc_no_detencion numeric
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_consulta6; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_consulta6
(
    fecha_emv date,
    id_ett integer,
    razon_social_empresa character varying(200),
    id_ruta integer,
    glosa_ruta character varying(50),
    placa_vehiculo character varying(10),
    detencion bigint,
    no_detencion bigint,
    porc_no_detencion numeric
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_consulta18; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_consulta18
(
  fecha_emv date,
  id_ett integer,
  razon_social_empresa character varying(1000),
  id_ruta integer,
  glosa_ruta character varying(50),
  placa_vehiculo character varying(10),
  min_fecha timestamp without time zone,
  max_fecha timestamp without time zone,
  tiempo interval
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_consulta8; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_consulta8
(
  fecha_emv date,
  id_ett integer,
  razon_social_empresa character varying(1000),
  id_ruta integer,
  glosa_ruta character varying(50),
  placa_vehiculo character varying(10),
  dia_semana integer
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_consulta9; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_consulta9
(
  fecha_emv date,
  id_ett integer,
  razon_social_empresa character varying(1000),
  id_ruta integer,
  glosa_ruta character varying(50),
  placa_vehiculo character varying(10),
  hora_dia integer
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_consulta12; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_consulta12
(
  fecha_emv date,
  id_ett integer,
  razon_social_empresa character varying(1000),
  id_ruta integer,
  glosa_ruta character varying(50),
  placa_vehiculo character varying(10),
  velocidad integer
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_consulta22; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_consulta22
(
  fecha_emv timestamp without time zone,
  id_ett integer,
  razon_social_empresa character varying(1000),
  id_ruta integer,
  glosa_ruta character varying(50),
  placa_vehiculo character varying(10)
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_consulta14; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_consulta14
(
  fecha_emv timestamp without time zone,
  id_ett integer,
  razon_social_empresa character varying(1000),
  id_ruta integer,
  glosa_ruta character varying(50),
  placa_vehiculo character varying(10),
  geom geometry
)

--
-- TOC entry 205 (class 1259 OID 391839)
-- Name: giz_alertas; Type: TABLE; Schema: giz; Owner: postgres
--
CREATE TABLE giz_resumen.giz_alertas
(
  fecha_emv date,
  id_ett integer,
  razon_social_empresa character varying(1000),
  id_ruta integer,
  glosa_ruta character varying(50),
  placa_vehiculo character varying(10),
  velocidad smallint,
  geom geometry,
  ruta geometry,
  distancia double precision
)


CREATE OR REPLACE FUNCTION giz_resumen.fi_consulta4(vi_fecha character varying)
  RETURNS void AS
$BODY$
BEGIN
--EN RUTA
drop table if exists temp_consulta4;
create table temp_consulta4 as
(select
	x.fecha_emv,
	x.id_ett, 
	x.razon_social_empresa,
	x.id_ruta,
	x.glosa_ruta,
	x.placa_vehiculo,
	sum(ST_Length(ST_GeographyFromText(ST_AsText(ST_LineSubstring( 
		ruta,
		ST_LineLocatePoint(ruta, ST_ClosestPoint(ruta, curr_geom)),
		ST_LineLocatePoint(ruta, ST_ClosestPoint(ruta, next_geom))
	))))) as distancia,
	'EN_RUTA' as comentario
from(
	select
		t.fecha_emv::date,
		e.id_ett, 
		e.razon_social_empresa,
		r.id_ruta,
		r.glosa_ruta,
		t.placa_vehiculo,
		ST_MakePoint(t.longitud, t.latitud) as curr_geom,
		LEAD(ST_MakePoint(t.longitud, t.latitud), 1) OVER ( ORDER BY ST_LineLocatePoint(r.geom12, ST_MakePoint(t.longitud, t.latitud))) as next_geom,
		r.geom12 as ruta,		
		ST_Distance(r.geom12, ST_MakePoint(t.longitud, t.latitud), true) as distancia,
		'1-2' as sentido_ruta
	from giz.giz_transmision t
	inner join giz.giz_ruta r on ST_Dwithin(r.geom12, ST_MakePoint(t.longitud, t.latitud), 100, true)
	inner join giz.giz_flotavehiculos f on f.placa_vehiculo = replace(t.placa_vehiculo, '-', '')
	inner join giz.giz_ett e on e.id_ett = f.id_ett
	where
		t.fecha_emv::date = to_date(vi_fecha, 'dd/mm/yyyy') and
		ST_Distance(r.geom12, ST_MakePoint(t.longitud, t.latitud), true) <= 10
	group by
		t.fecha_emv::date,
		e.id_ett, 
		e.razon_social_empresa,
		r.id_ruta,
		r.glosa_ruta,
		t.placa_vehiculo,
		r.geom12,
		ST_MakePoint(t.longitud, t.latitud)		
	order by 
		t.placa_vehiculo,
		ST_LineLocatePoint(r.geom12, ST_MakePoint(t.longitud, t.latitud))
) x
group by
	x.fecha_emv,
	x.id_ett, 
	x.razon_social_empresa,
	x.id_ruta,
	x.glosa_ruta,
	x.placa_vehiculo)
union all
--FUERA DE RUTA
(select
	x.fecha_emv,
	x.id_ett, 
	x.razon_social_empresa,
	x.id_ruta,
	x.glosa_ruta,
	x.placa_vehiculo,
	sum(distancia) as distancia,
	'FUERA_DE_RUTA' as comentario
from(
	select
		t.fecha_emv::date as fecha_emv,
		e.id_ett, 
		e.razon_social_empresa,
		r.id_ruta,
		r.glosa_ruta,
		t.placa_vehiculo,
		ST_MakePoint(t.longitud, t.latitud) as geom,
		r.geom12 as ruta,
		ST_Distance(r.geom12, ST_MakePoint(t.longitud, t.latitud), true) as distancia,
		'1-2' as sentido_ruta
	from giz.giz_transmision t
	inner join giz.giz_ruta r on ST_Dwithin(r.geom12, ST_MakePoint(t.longitud, t.latitud), 100, true)
	inner join giz.giz_flotavehiculos f on f.placa_vehiculo = replace(t.placa_vehiculo, '-', '')
	inner join giz.giz_ett e on e.id_ett = f.id_ett
	where
		t.fecha_emv::date = to_date(vi_fecha, 'dd/mm/yyyy') and
		ST_Distance(r.geom12, ST_MakePoint(t.longitud, t.latitud), true) > 10
	group by
		t.fecha_emv::date,
		e.id_ett, 
		e.razon_social_empresa,
		r.id_ruta,
		r.glosa_ruta,
		t.placa_vehiculo,
		r.geom12,
		ST_MakePoint(t.longitud, t.latitud)
	order by 
		t.placa_vehiculo,
		t.fecha_emv::date
) x
group by
	x.fecha_emv,
	x.id_ett, 
	x.razon_social_empresa,
	x.id_ruta,
	x.glosa_ruta,
	x.placa_vehiculo);
	

--CREATE TABLE RESUMEN
insert into giz_resumen.giz_consulta4
select
	fecha_emv,
	id_ett,
	razon_social_empresa,
	id_ruta,
	glosa_ruta,
	placa_vehiculo,
	km_en_ruta,
	km_fuera_ruta,
	(km_fuera_ruta / (km_en_ruta + km_fuera_ruta)) * 100 as porc_fuera_ruta
from(
	select
		t.fecha_emv,
		t.id_ett,
		t.razon_social_empresa,		
		t.id_ruta,
		t.glosa_ruta,
		t.placa_vehiculo,
		(select distancia / 1000 from temp_consulta4 where placa_vehiculo = t.placa_vehiculo and comentario = 'EN_RUTA') as km_en_ruta,
		(select distancia / 1000 from temp_consulta4 where placa_vehiculo = t.placa_vehiculo and comentario = 'FUERA_DE_RUTA') as km_fuera_ruta
	from temp_consulta4 t
	where
	 t.fecha_emv = to_date(vi_fecha, 'dd/mm/yyyy')
	group by 
		t.fecha_emv,
		t.placa_vehiculo,
		t.id_ett,
		t.razon_social_empresa,		
		t.id_ruta,
		t.glosa_ruta,
		t.placa_vehiculo
) x;
EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

CREATE OR REPLACE FUNCTION giz_resumen.fi_consulta10(vi_fecha character varying)
  RETURNS void AS
$BODY$
BEGIN
drop table if exists temp_consulta10;
create table temp_consulta10 as
(select
	t.fecha_emv::date,
	e.id_ett, 
	e.razon_social_empresa,
	r.id_ruta,
	r.glosa_ruta,
	t.placa_vehiculo,
	count(*) as detencion_paradero,
	'TOTAL_PARADEROS' as comentario
from giz.giz_transmision t
inner join giz.giz_ruta r on ST_Dwithin(r.geom12, ST_MakePoint(t.longitud, t.latitud), 50, true)
inner join giz.giz_paradero p on p.id_ruta = r.id_ruta
inner join giz.giz_flotavehiculos f on f.placa_vehiculo = replace(t.placa_vehiculo, '-', '')
inner join giz.giz_ett e on e.id_ett = f.id_ett
where
	t.fecha_emv::date = to_date(vi_fecha, 'dd/mm/yyyy') and
	ST_Distance(p.geom, ST_MakePoint(t.longitud, t.latitud), true) <= 10 and 
	t.velocidad = 0
group by 
	t.fecha_emv::date,
	e.id_ett, 
	e.razon_social_empresa,
	r.id_ruta,
	r.glosa_ruta,
	t.placa_vehiculo,
	r.id_ruta)
union all
(select
	t.fecha_emv::date,
	e.id_ett, 
	e.razon_social_empresa,
	r.id_ruta,
	r.glosa_ruta,
	t.placa_vehiculo,
	count(*) as detencion_paradero,
	'NO_DETENCION_PARADEROS' as comentario
from giz.giz_transmision t
inner join giz.giz_ruta r on ST_Dwithin(r.geom12, ST_MakePoint(t.longitud, t.latitud), 50, true)
inner join giz.giz_paradero p on p.id_ruta = r.id_ruta
inner join giz.giz_flotavehiculos f on f.placa_vehiculo = replace(t.placa_vehiculo, '-', '')
inner join giz.giz_ett e on e.id_ett = f.id_ett
where
	t.fecha_emv::date = to_date(vi_fecha, 'dd/mm/yyyy') and
	ST_Distance(p.geom, ST_MakePoint(t.longitud, t.latitud), true) <= 10 and 
	t.velocidad > 0
group by 
	t.fecha_emv::date,
	e.id_ett, 
	e.razon_social_empresa,
	r.id_ruta,
	r.glosa_ruta,
	t.placa_vehiculo,
	r.id_ruta);

insert into giz_resumen.giz_consulta10
select
	fecha_emv,
	id_ett,
	razon_social_empresa,
	id_ruta,
	glosa_ruta,
	placa_vehiculo,
	detencion,
	no_detencion,
	(no_detencion / detencion::numeric) * 100 as porc_no_detencion
from(
	select
		t.fecha_emv,
		t.id_ett,
		t.razon_social_empresa,		
		t.id_ruta,
		t.glosa_ruta,
		t.placa_vehiculo,
		(select detencion_paradero from temp_consulta10 where placa_vehiculo = t.placa_vehiculo and comentario = 'TOTAL_PARADEROS') as detencion,
		(select detencion_paradero from temp_consulta10 where placa_vehiculo = t.placa_vehiculo and comentario = 'NO_DETENCION_PARADEROS') as no_detencion
	from temp_consulta10 t
	where
		t.fecha_emv = to_date(vi_fecha, 'dd/mm/yyyy')
	group by 
		t.fecha_emv,
		t.placa_vehiculo,
		t.id_ett,
		t.razon_social_empresa,		
		t.id_ruta,
		t.glosa_ruta,
		t.placa_vehiculo
) x;

 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION giz_resumen.fi_consulta10(character varying)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION giz_resumen.fi_consulta18(vi_fecha character varying)
  RETURNS void AS
$BODY$
BEGIN
insert into giz_resumen.giz_consulta18
select
 t.fecha_emv::date,
 e.id_ett, 
 e.razon_social_empresa,
 r.id_ruta,
 r.glosa_ruta,
 t.placa_vehiculo,
 min(t.fecha_emv) as min_fecha,
 max(t.fecha_emv) as max_fecha,
 age(max(t.fecha_emv), min(t.fecha_emv)) as tiempo
from giz.giz_transmision t
inner join giz.giz_flotavehiculos f on f.placa_vehiculo = replace(t.placa_vehiculo, '-', '')
inner join giz.giz_ruta r on r.id_ruta = f.id_ruta
inner join giz.giz_ett e on e.id_ett = f.id_ett
where
    t.fecha_emv = to_date(vi_fecha, 'dd/mm/yyyy')
group by
 t.fecha_emv::date,
 e.id_ett, 
 e.razon_social_empresa,
 r.id_ruta,
 r.glosa_ruta,
 t.placa_vehiculo
order by
 1;

 EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION giz_resumen.fi_consulta18(character varying)
  OWNER TO postgres;