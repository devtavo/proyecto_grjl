import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GeoJSON, LayersControl, TileLayer } from 'react-leaflet';
import Map from '../../components/Map/Map';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import AlertaService from '../../services/AlertaService';
import RutaService from '../../services/RutaService';
import ParaderosMarkers from '../../components/Poligonos/ParaderosMarkers';
import { STYLE_GEOM_2_1 } from '../../components/Poligonos/RutasPoligono';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import paradero from '../../components/Poligonos/img/paradero.png';
import ruta from '../../components/Poligonos/img/ruta.png';
import transmision from '../../components/Poligonos/img/transmision.png';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Marker from '../../components/Marker/Marker';
import TabPanel from '../../components/TabPanel/TabPanel';
import { Popup } from 'react-leaflet';
import Stack from '@mui/material/Stack';
import L from "leaflet";
import ParametroService from '../../services/ParametroService';
import EettService from '../../services/EettService';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Export from '../../components/TableExport/Export';
import '../../assets/styles/pages/alertasdet.css';
import CharBarra from '../../components/Charts/ChartBarra';
import Highcharts from 'highcharts';
import { Link } from "react-router-dom";
import { generateToken } from '../../helper/helper';

export const options = {
    chart: {
        zoomType: 'xy',
        type: 'column'
    },
    title: {
        text: ''
    },
    xAxis: [{
        categories: [],
        crosshair: true
    }],
    yAxis: [
        {
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Frecuencia',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        },
    ],
    tooltip: {
        shared: true,
        pointFormat: 'Frecuencia: <b>{point.y} </b>'
    },
    series: [
        {
            name: '',
            data: [],
        },
    ]
}
const today = new Date();

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
const Title = ({ title }) => {
    return <b>{title}</b>
}

const repetidos = (arreglo) => {
    var repetidos = {};
    var rep = [];
    let i = 0;
    arreglo.forEach(function (numero) {
        repetidos[numero] = (repetidos[numero] || 0) + 1;
    });
    const x = Object.keys(repetidos).sort();
    for (const [key, value] of Object.entries(repetidos)) {
        rep.push({
            "hora": x[i],
            "cant": repetidos[x[i]]
        })
        i++;
    }
    return rep;

};

const PopupDet = ({ data, id_ett, id_ruta, fecha_inicio }) => {
    console.log(data);

    const obj = {
        transmision: {
            latitud: data.geojson.cor,
            longitud: data.geojson.cor,
            velocidad: data.geojson.velocidad,
            orientacion: '',
            fechaEmv: data.geojson.fechai
        },
        vehiculo: {
            placa: data.geojson.placa_vehiculo,
            anioFab: data.geojson.afabricacion_vehiculo,
            estado: data.geojson.estado_vehiculo,
            codigoSoat: data.geojson.codigo_soat,
            vencimientoSoat: data.geojson.vencimiento_soat
        },
        ett: {
            ruc: data.geojson.ruc_ett,
            razonSocial: data.geojson.razon_social_empresa,
            direccion: data.geojson.direccion,
            fechaRegistro: data.geojson.fecha_registro,
            estado: data.geojson.estado_empresa,
            telefono: data.geojson.telefono,
            correo: data.geojson.correo,
        },
        emv: {
            ruc: data.geojson.ruc,
            razonSocial: data.geojson.razon_social,
            direccion: data.geojson.direccion,
            fechaRegistro: data.geojson.fecha_registro,
            estado: data.geojson.estado_emv,
            telefono: data.geojson.telefono,
            correo: data.geojson.correo,
        },
    };
    const token = generateToken(id_ett, id_ruta, obj.vehiculo.placa, fecha_inicio)

    const [tab, setTab] = useState(0);

    const handleChange = (event, newValue) => {
        setTab(parseInt(newValue));
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Transmisión" {...a11yProps(0)} />
                    <Tab label="Vehículo" {...a11yProps(1)} />
                    <Tab label="EETT" {...a11yProps(2)} />
                    <Tab label="EMV" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <Title title='Latitud' />: {obj.transmision.latitud} <br />
                <Title title='Longitud' />: {obj.transmision.longitud} <br />
                <Title title='Velocidad' />: {obj.transmision.velocidad} <br />
                <Title title='Orientación' />: {obj.transmision.orientacion} <br />
                <Title title='Fecha EMV' />: {obj.transmision.fechaEmv} <br />
                <Button component={Link} to={`../validacion/${token}`} variant="text" size="small" >
                    Link validación
                </Button>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Title title='Placa' />: {obj.vehiculo.placa} <br />
                <Title title='Año de fabricación' />: {obj.vehiculo.anioFab} <br />
                <Title title='Estado' />: {obj.vehiculo.estado} <br />
                <Title title='Código SOAT' />: {obj.vehiculo.codigoSoat} <br />
                <Title title='Vencimiento SOAT' />: {obj.vehiculo.vencimientoSoat}
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <Title title='Ruc' />: {obj.ett.ruc} <br />
                <Title title='Razón social' />: {obj.ett.razonSocial} <br />
                <Title title='Dirección' />: {obj.ett.direccion} <br />
                <Title title='Fecha de registro' />: {obj.ett.fechaRegistro} <br />
                <Title title='Estado' />: {obj.ett.estado} <br />
                <Title title='Teléfono' />: {obj.ett.telefono} <br />
                <Title title='Correo' />: {obj.ett.correo}
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <Title title='Ruc' />: {obj.emv.ruc} <br />
                <Title title='Razón social' />: {obj.emv.razonSocial} <br />
                <Title title='Dirección' />: {obj.emv.direccion} <br />
                <Title title='Fecha de registro' />: {obj.emv.fechaRegistro} <br />
                <Title title='Estado' />: {obj.emv.estado} <br />
                <Title title='Teléfono' />: {obj.emv.telefono} <br />
                <Title title='Correo' />: {obj.emv.correo}
            </TabPanel>
        </Box>
    )
}

const PopDetalle = ({ alertas, detallePop, coor, titulo }) => {
    const chartOptions = { ...options };
    const alt = [];
    let ty = 0;
    alertas && alertas.map(tr => (
        tr.geojson
    )).map(({ st_asgeojson, fecha_emv, hora }, index) => { alt.push(hora) })
    const adet = repetidos(alt);
    chartOptions.xAxis[0].categories = adet.map((c) => [c.hora]);
    chartOptions.title.text = titulo;
    chartOptions.series[0].name = 'Hora';
    chartOptions.series[0].data = adet.map((a) => [a.hora, a.cant]);
    adet.map((t) => {
        ty = ty + t.cant;
    })

    return (

        <Box sx={{ width: '580px', textAlign: 'center', padding: '16px 4px' }}>
            <Grid item xs={12}>
                <CharBarra options={chartOptions} />
            </Grid>

            <Table size="small" aria-label="a dense table" style={{ border: '1px solid #D2D2D2', borderRadius: '6px !important' }}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ background: '#EBEBEB', color: '#FFF', fontSize: '12px', background: '#c62828' }} align="center" >Hora</TableCell>
                        <TableCell style={{ background: '#EBEBEB', color: '#FFF', fontSize: '12px', background: '#c62828' }} align="center">Frecuencia</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        adet.map((det) => (
                            <>
                                <TableRow >
                                    <TableCell align="center" style={{ fontSize: '10px' }}>{det.hora}</TableCell>
                                    <TableCell align="center" style={{ fontSize: '10px' }}>{det.cant}</TableCell>
                                </TableRow>
                            </>
                        ))
                    }
                    <TableRow >
                        <TableCell align="center" style={{ fontSize: '10px' }}>Total</TableCell>
                        <TableCell align="center" style={{ fontSize: '10px' }}>{ty}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Typography
                variant="h6"
                style={{
                    fontWeight: 'regular',
                    marginBottom: '8px',
                    display: 'block', fontSize: '12px'
                }}>
                Ubicación: {coor[0]} , {coor[1]}
            </Typography>

        </Box >
    )
}
export default function AlertaDet({ alertaId = 0, setOpen = false, hasLegend = true }) {
    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 0));
    const [alertas, setAlertas] = useState([]);
    const [excel, setExcel] = useState([]);
    const [rutas, setRutas] = useState([]);
    const [rutaId, setRutaId] = useState(-1);
    const [rutaGeom, setRutaGeom] = useState({});
    const [snack, setSnack] = useState({});
    const [detallePop, setDetallePop] = useState([]);
    const [empresa, setEmpresa] = useState([]);
    const [parametros, setParametros] = useState([]);
    const [empresaId, setEmpresaId] = useState(-1);
    const [coor, setCoor] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const getRutas = async () => {
            const EttId = await EettService.getAll();
            setEmpresa(EttId.data);
            const parametro = await ParametroService.getParametro({ 'glosaParametro': 'alerta' + alertaId });
            setParametros(parametro.data);
        };
        getRutas();
    }, []);

    const handleChangeEmpresa = (e) => {
        const idEmpresa = e.target.value;
        setEmpresaId(idEmpresa);
        console.log('emp2', idEmpresa);

        const getRutas = async () => {
            const rutaId = await RutaService.getRutasValidacion({ 'idEtt': idEmpresa });
            let rutasPorSentido = [];

            rutaId.data.forEach(ruta => {
                const geomSentido12 = ruta.geom12;
                const geomSentido21 = ruta.geom21;

                const { geom12, geom21, ...rutaSinSentidos } = ruta;

                rutasPorSentido.push({
                    ...rutaSinSentidos,
                    nombreRuta: `${ruta.nombreRuta} sentido 1-2`,
                    geom: geomSentido12,
                    sentido: '1-2'
                });

                rutasPorSentido.push({
                    ...rutaSinSentidos,
                    nombreRuta: `${ruta.nombreRuta} sentido 2-1`,
                    geom: geomSentido21,
                    sentido: '2-1'
                })
            });
            setRutas(rutasPorSentido);
        }
        getRutas();
    }

    const columnsAler = [
        {
            Header: 'Alerta de Congestión de tráfico',
            columns: [
                {
                    Header: '#',
                },
                {
                    Header: 'Placa Vehicular',
                },
                {
                    Header: 'Nombre Ruta',
                },
                {
                    Header: 'Razon Social',
                },
                {
                    Header: 'Hora congestión',
                },
            ],
        },
        {
            Header: 'Alerta de Exceso de velocidad',
            columns: [
                {
                    Header: '#',
                },
                {
                    Header: 'Placa Vehicular',
                },
                {
                    Header: 'Nombre de Ruta',
                },
                {
                    Header: 'Razon Social',
                },
                {
                    Header: 'Hora congestión',
                },
            ],
        },
        {
            Header: 'Alerta de Puertas abiertas',
            columns: [
                {
                    Header: '#',
                },
                {
                    Header: 'Placa Vehicular',
                },
                {
                    Header: 'Nombre de Ruta',
                },
                {
                    Header: 'Razon Social',
                },
                {
                    Header: 'Hora congestión',
                },
            ],
        },
        {
            Header: 'Alerta de vehiculos fuera de Ruta',
            columns: [
                {
                    Header: 'Razon Social Empresa',
                },
                {
                    Header: 'Codigo de Ruta',
                },
                {
                    Header: 'Placa vehicular',
                },
                {
                    Header: 'Coordenadas',
                },
                {
                    Header: 'Fecha Registro',
                },
                {
                    Header: 'Velocidad',
                },
                {
                    Header: 'Año fabricación',
                },
                {
                    Header: 'Estado del Vehiculo',
                },
            ],
        }
    ];

    const descripcion = [
        {
            "alerta": "titulo principal"
        },
        {
            "alerta": "Se analiza la densidad de autobuses por ruta, desde la hora de inicio de la prestación del servicio, que se encuentran a +/- 100 metros del eje de la ruta. Este análisis se realiza por periodo de 30 min secuencialmente, considerando que se encuentren al menos 2 autobuses con velocidad menor a 10 km/h.",
            "titulo": "Frecuencia de congestión Vehicular",
        },
        {
            "alerta": "Se analiza la densidad de autobuses por ruta, desde la hora de inicio de la prestación del servicio, que se encuentran a +/- 500 metros del eje de la ruta. Este análisis se realiza por periodo de 30 min secuencialmente, considerando que se encuentren al menos 1 autobuses con velocidad mayor a 30 km/h.",
            "titulo": "Frecuencia de exceso de velocidad",
        },
        {
            "alerta": "Esta alerta tiene como parametro el codigo de alerta 4 que indica un vehiculo en movimiento con puertas abiertas",
            "titulo": "",
        },
        {
            "alerta": "Esta alerta muestra los vehículos fuera de la ruta a una distancia mayor a 500 metros del eje de la ruta.",
            "titulo": "",
        },
        {
            "alerta": "Esta alerta a los autobuses estacionado/detenidos en la ruta (a una distancia mayor a 25 metros de los paraderos), con una velocidad igual a 0 km/h y una permanencia mayor a 5 minutos.",
            "titulo": "",
        },
        {
            "alerta": "Esta alerta muestra los autobuses con tiempo de exceso de permanencia en los paraderos autorizados (dentro de 25 metros), teniendo como parámetro de velocidad igual a 0 km/h y con una permanencia mayor a 2 minutos.",
            "titulo": "",
        },
        {
            "alerta": "",
        },
        {
            "alerta": "",
        },
        {
            "alerta": "Esta alerta muestra los autobuses que no se detienen (velocidad mayor a 0 km/h) en paraderos, considerando que deben detenerse dentro de una distancia de 25 metros del paradero.",
            "titulo": "",
        },
        {
            "alerta": "Esta alerta nos muestra los vehiculos en una determinada fecha con baja calidad de transmision de data teniendo como parametro cada 1 min.",
            "titulo": "",
        },
        {
            "alerta": "",
            "titulo": "",
        },
        {
            "alerta": "Esta alerta tiene como parametro el codigo de alerta 2 que indica los vehiculos que han presionado el boton de panico",
            "titulo": "",
        },
        {
            "alerta": "Esta alerta tiene como parametro el codigo de alerta 3 que indica los vehiculos que han apagado el motor.",
            "titulo": "",
        },
        {
            "alerta": "",
        },
        {
            "alerta": "Esta alerta tiene como parametro el codigo de alerta 7 que indica los vehiculos que han encendido el motor.",
            "titulo": "",
        }
    ];

    const handleChangeRuta = (e) => {
        const idxRuta = e.target.value;
        const geom = rutas[idxRuta].geom;
        setRutaId(idxRuta);

        setRutaGeom(geom);
        console.log(rutas[idxRuta].idRuta);
        console.log(idxRuta);
    }

    const handleChangeFechaInicio = (fecha) => {
        setFechaInicio(fecha);
    };
    const handleClickBuscar = () => {
        if (rutaGeom && Object.keys(rutaGeom).length === 0) {
            alert("Debe seleccionar una ruta");
        } else {
            setOpen(true);
            getAlertas(alertaId, rutaGeom, fechaInicio, fechaFin);

        }
    }

    const getAlertas = async (alertaId, geom, fechaInicio, fechaFin) => {
        const alerta = await AlertaService.get(alertaId, {
            geom,
            fechaInicio: fechaInicio.toLocaleString() || new Date().toLocaleString(),
            fechaFin: fechaFin.toLocaleString() || new Date().toLocaleString(), 
            idRuta: rutas[rutaId].idRuta 
        });
        console.log(alerta.data);
        if (alerta.data.length == 0) {
            alert("No se encontraron resultados");
            setSnack({ ...snack, open: true, severity: 'success', message: 'no hay datos' })
        }
        if (alerta.data.length > 0) {
            if (alerta.data[0].geojson.geo === null) {
                alert("No se encontraron resultados");
                setSnack({ ...snack, open: true, severity: 'success', message: 'no hay datos' })
            } else {
                [1, 2].includes(alertaId) ? setExcel(alerta.data[0].geojson.exc.map((e) => e.excel)) : setExcel(alerta.data[0].geojson.geo.map((g) => g.geojson));
                setAlertas(alerta.data[0].geojson.geo);
                setIsDisabled(true);
            }
        }
        setOpen(false);
    };


    function getPopUp(e, alerta = []) {
        console.log("alerta", e.layer.getAllChildMarkers());
        e.latlng ? setCoor([e.latlng.lat, e.latlng.lng]) : setCoor([]);

    };

    return (
        <>
            {/* <Notification snack={snack} setSnack={setSnack} /> */}
            {/* <TableExport onClickPDF={() => exportPdf()} onClickExcel={() => saveAsExcel()} /> */}

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} >
                    <Grid item xs={12} md={2}>
                        <FormControl margin="dense" fullWidth>
                            <InputLabel>Empresas</InputLabel>
                            <Select label="Empresas" value={empresaId} onChange={handleChangeEmpresa} >
                                {
                                    empresa.map((empresas, index) => (
                                        <MenuItem key={index} value={empresas.idEtt} >{empresas.codEtt} {empresas.razonSocialEmpresa}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <InputLabel>Rutas</InputLabel>
                            <Select label="Rutas" value={rutaId} onChange={handleChangeRuta}>
                                {
                                    rutas.map((ruta, index) => (
                                        <MenuItem key={index} value={index}>{ruta.nombreRuta}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <FormControl margin="dense" fullWidth>
                                <DateTimePicker
                                    label="Fecha"
                                    value={fechaInicio}
                                    onChange={handleChangeFechaInicio}
                                    inputFormat="dd/MM/yyyy HH:mm"
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </FormControl>
                        </LocalizationProvider>
                        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <FormControl margin="dense" fullWidth>
                                <DateTimePicker
                                    label="Rango final"
                                    value={fechaFin}
                                    onChange={handleChangeFechaFin}
                                    inputFormat="dd/MM/yyyy HH:mm"
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </FormControl>
                        </LocalizationProvider> */}
                        <br />
                        <Grid item justifyContent="center" alignItems="center">
                            <div style={{ display: "grid", alignItems: "center", height: '100%' }}>
                                <Button variant="contained" onClick={handleClickBuscar} size="large">Buscar</Button>
                            </div>
                        </Grid>

                        <br />
                        {[1, 2, 4].includes(alertaId) ?
                            < Grid item justifyContent="center" alignItems="center">
                                <div style={{ display: "grid", alignItems: "center", height: '100%' }}>
                                    <Export props={`Alerta ${alertaId}`}  isExportable isDisabled={isDisabled} pdfExport={{ columnsAler, excel, alertaId }} />
                                </div>
                            </Grid>
                            : <br />
                        }
                        <Grid item justifyContent="center" alignItems="center">
                            <div style={{ background: 'white', borderRadius: '12px', fontSize: '11px', marginTop: 20, paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'justify', alignItems: "center", height: '100%' }}>
                                <p style={{ paddingTop: '0px', fontWeight: 900, paddingBottom: '1px' }}>Descripcion</p>
                                {
                                    descripcion[alertaId].alerta
                                }
                                {/* {
                                    parametros.map((ee) => ee.valorParametro.metros)
                                } */}
                            </div>
                        </Grid>
                        <div style={{ background: 'white', borderRadius: '12px', marginTop: '60px', paddingTop: '1px', paddingLeft: '10px', paddingBottom: '8px', boxShadow: "0px 4px 4px 4px rgb(223,223,223, 0.25)" }}>
                            <p style={{ paddingTop: '0px', fontWeight: 450, paddingBottom: '4px' }}>Leyenda</p>
                            <Stack spacing={2} style={{ float: 'center' }}>
                                <Stack direction="row" spacing={4} style={{ float: 'right' }}><b style={{ fontSize: '12px' }}>Paradero</b><img src={paradero} width="20" height="20" /></Stack>
                                <Stack direction="row" spacing={7} style={{ float: 'right' }}><b style={{ fontSize: '12px' }}>Ruta</b><img src={ruta} width="20" height="20" /></Stack>
                                <Stack direction="row" spacing={2} style={{ float: 'center' }}><b style={{ fontSize: '12px' }}>Transmisión</b><img src={transmision} width="15" height="20" /></Stack>
                            </Stack>
                        </div>
                    </Grid>
                    <Grid item xs={12} className="mapa" md={10}>
                        <Map maxZoom={![1, 2].includes(alertaId) ? 22 : 17} minZoom={5} >
                            {rutaId > -1 && <ParaderosMarkers isEdited key={`paraderos_${rutaId}`} {...rutas[rutaId]} />}

                            {
                                rutaId > -1 && rutaGeom?.coordinates && <GeoJSON key={`transmisiones_${rutaId}`} data={rutaGeom} style={STYLE_GEOM_2_1}></GeoJSON>
                            }
                            {/* {markers.map((marker, index) => (
                                <Marker key={index} position={marker}>
                                    <Popup minWidth='auto'>
                                        <PopupDet />
                                    </Popup>
                                </Marker>
                            ))} */}
                            {
                                coor.length > 0 ?
                                    <Popup open={false} minWidth='auto' position={coor}>
                                        <PopDetalle alertas={alertas} detallePop={detallePop} coor={coor} titulo={descripcion[alertaId].titulo} />
                                    </Popup> : ''
                            }
                            {/* <MarkerClusterGroup onClick={(e) => console.log(e.sourceTarget._markers[0]._popup._source.options.children)} showCoverageOnHover={true} spiderfyOnMaxZoom={false} iconCreateFunction={createClusterCustomIcon}>
                                {
                                    alertas && alertas.map(({ geojson }, index) => (
                                        geojson == null ?
                                            setSnack({ ...snack, open: true, severity: 'success', message: 'no hay datos' })
                                            : geojson.coordinates.map((coordinate, index) => (
                                                <Marker dato={[coordinate[1], coordinate[0]]} position={[coordinate[1], coordinate[0]]} />
                                            ))
                                    ))
                                }
                            </MarkerClusterGroup> */}
                            {
                                ![1, 2].includes(alertaId) ?
                                    alertas && alertas.map((tx, index) => (
                                        <Marker key={index} position={[tx.geojson.t.coordinates[1], tx.geojson.t.coordinates[0]]}>
                                            <Popup minWidth='auto'>
                                                <PopupDet data={tx} id_ett={empresaId} id_ruta={rutas[rutaId].idRuta} fecha_inicio={fechaInicio.toLocaleString()} />
                                            </Popup>
                                        </Marker>
                                    ))
                                    :
                                    <MarkerClusterGroup onClick={(e) => getPopUp(e)} showCoverageOnHover={true} spiderfyOnMaxZoom={false} >
                                        {
                                            alertas && alertas.map(tr => (
                                                tr.geojson
                                            )).map(({ st_asgeojson, fecha_emv, hora }, index) => (
                                                <Marker key={index} props={[fecha_emv, hora]} dato={[fecha_emv, hora]} position={[st_asgeojson.coordinates[1], st_asgeojson.coordinates[0]]}>
                                                    <Popup open={false} minWidth='auto' position={coor}>
                                                        <PopDetalle alertas={alertas} detallePop={detallePop} coor={coor} titulo={descripcion[alertaId].titulo} />
                                                    </Popup>
                                                </Marker>
                                            ))
                                        }
                                    </MarkerClusterGroup>
                            }
                        </Map>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}