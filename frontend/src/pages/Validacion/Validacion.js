import { LayersControl, LayerGroup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import {
    GeoJSON,
    Marker,
    Polyline,
    Popup,
    TileLayer
} from 'react-leaflet';
import Map from '../../components/Map/Map';
import { useParams } from "react-router";

import L from "leaflet";
import ParaderosMarkers from '../../components/Poligonos/ParaderosMarkers';
import { STYLE_GEOM_2_1 } from '../../components/Poligonos/RutasPoligono';
import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DatePicker from '@mui/lab/DatePicker';
import Notification from '../../components/Notification/Notification';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import BasicTable from '../../components/Table/Table';

import Button from '@mui/material/Button';
import RutasPoligono from '../../components/Poligonos/RutasPoligono';
import HexagonosPoligono from '../../components/Poligonos/HexagonosPoligono';
import RutaService from '../../services/RutaService';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Slider from '@mui/material/Slider';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import EettService from '../../services/EettService';
import FlotaService from '../../services/FlotaService';
import ValidacionService from '../../services/ValidacionService';
import paradero from '../../components/Poligonos/img/transmision.png';
import Dialog from '../../components/Dialog/Dialog';
import MostrarFechas from './MostrarFechas';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../helper/helper';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '../../components/TabPanel/TabPanel';
import Export from '../../components/TableExport/Export';
const jwt = require('jsonwebtoken');
const mark = [];
const today = new Date();
const minDistance = 10;

export default function Validacion() {

    const { token } = useParams();
    const decoded = token ? jwt.verify(token, "giz_plataforma_2021$$") : '';
    console.log(token);
    if (decoded) var d = decoded.fecha.split(',');
    if (decoded) d[1] = '23:59:00';
    if (decoded) d.join();

    const [open, setOpen] = useState(false);
    const [transportista, setTransportista] = useState([]);
    const [transportistaId, setTransportistaId] = useState([]);
    const [constructora, setConstructora] = useState([]);
    const [constructoraId, setConstructoraId] = useState([]);
    const [procedencia, setProcedencia] = useState([]);
    const [procedenciaId, setProcedenciaId] = useState([]);
    const [viajeId, setViajeId] = useState([]);
    const [volumenId, setVolumenId] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const [fechaEmi, setFechaEmi] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    const [openDialog, setOpenDialog] = useState(false);
    const [fechas, setFechas] = useState([]);
    const [value2, setValue2] = useState([10, 80]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [constancias, setConstancias] = useState([]);
    const [constanciaSel, setConstanciaSel] = useState([]);
    const [snack, setSnack] = useState({});
    const [openSnack, setOpenSnack] = useState(false);

    useEffect(() => {
        setOpen(true);
        const getData = async () => {
            // const data = Object.keys(decoded).length > 0 ? await ValidacionService.getValidacion({ 'vehiculo': decoded.placa, 'fechaInicio': decoded.fecha, 'fechaFin': d }) : await EettService.getAll();
            const constructora = await ValidacionService.getConstructora();
            const empresas = await ValidacionService.getTransportista();
            const obras = await ValidacionService.getObras();
            setConstructora(constructora.data.map(({ constructora, id, rucConstructora }) => ({ label: constructora, id: id, rucConstructora: rucConstructora })));
            setTransportista(empresas.data.map(({ razonSocialEmpresa, id, rucEtt }) => ({ label: razonSocialEmpresa, id: id, rucTransportista: rucEtt })));
            setProcedencia(obras.data.map(({ direccion, id, nombre }) => ({ label: nombre, id: id, nombre: direccion })));
            setOpen(false);

        }
        getData();


    }, []);

    const handleChangeFechaInicio = (fecha) => {
        setFechaInicio(fecha);
    };

    const handleChangeFechaFin = (fecha) => {
        setFechaFin(fecha);
    };
    const handleChangeFechaEmi = (fecha) => {
        setFechaEmi(fecha);
    };

    const handleClickAgregar = async () => {

        console.log(volumenId)
        console.log(viajeId)
        console.log(Number.isInteger(Number(viajeId)))
        console.log(viajeId);
        if (constructoraId?.label != null && transportistaId?.label != null && procedenciaId?.label != null && volumenId != "" && Number.isInteger(Number(viajeId)) && viajeId !== "") {
            const validaConstancia = await ValidacionService.getValidaConstancia(
                fechaInicio.toLocaleDateString().split('/').join('-'),
                fechaFin.toLocaleDateString().split('/').join('-'), {
                viajes: viajeId
                , volumen: volumenId
                , rucEtt: constructoraId?.label
                , razonSocialEmpresa: transportistaId?.label
                , direccion: procedenciaId?.label
                , fechaInicio: fechaInicio.toLocaleDateString().split('/').join('-')
                , fechaFinal: fechaFin.toLocaleDateString().split('/').join('-')
                , fechaEmi: fechaEmi.toLocaleDateString().split('/').join('-')
                , id: transportista.filter(a => a.label == transportistaId?.label).shift().id
            })
            if (Number(validaConstancia.data[0].sViajesDia) >= viajeId) {
                const volumenMin = viajeId * 15;
                const volumenMax = viajeId * 25;
                console.log(volumenMin, volumenMax);
                console.log((viajeId * volumenId) >= volumenMin && (viajeId * volumenId) <= volumenMax)
                if ((volumenId) >= volumenMin && ( volumenId) <= volumenMax) {
                    setConstancias((constancias) => [...constancias,
                    {
                        eRazonSocial: constructoraId?.label,
                        eRuc: constructora.filter(a => a.label == constructoraId?.label).shift().rucConstructora,
                        tRazonSocial: transportistaId?.label,
                        tRuc: transportista.filter(a => a.label == transportistaId?.label).shift().rucTransportista,
                        pObra: procedenciaId?.label,
                        pDireccion: procedencia.filter(a => a.label == procedenciaId?.label).shift().nombre,
                        vFechaInicio: fechaInicio.toLocaleDateString().split('/').join('-'),
                        vFechaFin: fechaFin.toLocaleDateString().split('/').join('-'),
                        vNumViajes: viajeId,
                        vVolumenAprox: volumenId,
                        vFechaConstancia: fechaEmi.toLocaleDateString().split('/').join('-')
                    }
                    ]
                    );
                } else {

                    setSnack({ ...snack, open: true, severity: 'error', message: `Error: No se puede agregar se tiene : el volumen no corresponde al rango del volumen minimo(${volumenMin}) o maximo(${volumenMax}) ` });
                }
            } else {

                setSnack({ ...snack, open: true, severity: 'error', message: `Error: No se puede agregar se tiene : ${validaConstancia.data[0].sViajesDia} de stock y se piden : ${viajeId} ` });
            }

            console.log(constancias);
            console.log(validaConstancia);

        } else {
            setSnack({ ...snack, open: true, severity: 'error', message: 'Ocurrió un error al agregar un registro. Debe seleccionar los campos requeridos y/o los viajes deben ser enteros' });
        }

    }

    const onOpen = () => {
        setOpen(true)
    }
    const onCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleConstancia = async () => {
        setOpen(true);
        const constancia = await ValidacionService.generarConstancia(constancias);
        console.log(constancia);
        if (constancia.data.msg == 'ok') setOpen(false);


    }
    const breadCrumb = [
        {
            name: 'Inicio',
            path: '../'
        },
        {
            name: 'Supervisión',
            path: '../'
        }
    ]

    const columns = [
        {
            Header: 'Lista Constancias por Generar',
            columns: [
                {
                    Header: 'Razón Social Constructora',
                    accessor: 'eRazonSocial',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Razón social Transportista',
                    accessor: 'tRazonSocial',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Dirección',
                    accessor: 'pDireccion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Obra',
                    accessor: 'pObra',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes',
                    accessor: 'vNumViajes',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Volumen Aprox',
                    accessor: 'vVolumenAprox',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Fecha Inicio',
                    accessor: 'vFechaInicio',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Fecha Final',
                    accessor: 'vFechaFin',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Fecha Emisión',
                    accessor: 'vFechaConstancia',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                // {
                //     Header: "Acciones",
                //     Cell: (props) => {
                //         const rowIdx = props.row.id;
                //         const constancia = constancias[rowIdx];
                //         return (
                //             <>
                //                 <Stack spacing={1} direction="row">
                //                     <Button size="small" variant="outlined" onClick={() => {
                //                         console.log(constancias);
                //                         handleConstancia(constancias)
                //                         // setConstanciaSel(constancia);
                //                         // setOpenDialog(true);

                //                     }}>
                //                         Generar
                //                     </Button>
                //                 </Stack>
                //             </>
                //         );
                //     },
                //     alignBody: 'center',
                //     alignHeader: 'center'
                // }
            ],
        },
    ];

    return (
        <>
            <Notification snack={snack} setSnack={setSnack} />

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* <Dialog open={openDialog} handleClose={onCloseDialog} >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Fechas con transmisiones registradas
                </DialogTitle>
                <MostrarFechas fechas={fechas}></MostrarFechas>
                <br />
                <Alert severity="info">Información: La Tabla muestra los ultimos 30 días de registro</Alert>
            </Dialog> */}
            <BackButton to='../' bread={[{ name: 'Inicio', path: '../' }, { name: 'Constancias', path: '.' }]} />
            <Navigation
                title="Constancias"
                breadcrumb={breadCrumb}
            />
            <Box sx={{ flexGrow: 1 }} style={{ marginBottom: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <FormControl margin="dense" fullWidth>
                            {/* <InputLabel>Constructora</InputLabel> */}
                            {/* <Select label="Constructora"  onChange={handleChangeEmpresa} >
                                {
                                    constructora.map((empresas, index) => (
                                        <MenuItem key={index} value={empresas.id} >{empresas.constructora}</MenuItem>
                                    ))
                                    // console.log(constructora)
                                }
                            </Select> */}
                            {/* <TextField onChange={handleChangeConstructora}></TextField> */}
                            <Autocomplete
                                disablePortal
                                id="constructora"
                                require="true"
                                options={constructora}
                                sx={{ width: 300 }}
                                onChange={(event, newValue) => {
                                    setConstructoraId(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Constructora" />}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl margin="dense" fullWidth>
                            <Autocomplete
                                disablePortal
                                require="true"
                                id="empresas"
                                options={transportista}
                                sx={{ width: 300 }}
                                onChange={(event, newValue) => {
                                    setTransportistaId(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Transportista" />}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl margin="dense" fullWidth>
                            <Autocomplete
                                disablePortal
                                id="obra"
                                require="true"
                                options={procedencia}
                                sx={{ width: 300 }}
                                onChange={(event, newValue) => {
                                    setProcedenciaId(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Procedencia" />}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="viajes"
                            pattern="[0-9]{0,13}"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            name="viajes"
                            label="Viajes"
                            // value={formik.values.viajes}
                            onChange={(e) => {
                                setViajeId(e.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            margin="dense"
                            id="volumen"
                            inputProps={{ inputMode: 'decimal' }}
                            name="volumen"
                            label="Volumen"
                            // value={formik.values.viajes}
                            onChange={(e) => {
                                // console.log(e);
                                setVolumenId(e.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <FormControl margin="dense" fullWidth>
                                <DatePicker
                                    label="Rango de inicio"
                                    value={fechaInicio}
                                    onChange={handleChangeFechaInicio}
                                    inputFormat="dd/MM/yyyy"
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </FormControl>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <FormControl margin="dense" fullWidth>
                                <DatePicker
                                    label="Rango final"
                                    value={fechaFin}
                                    onChange={handleChangeFechaFin}
                                    inputFormat="dd/MM/yyyy"
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </FormControl>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <FormControl margin="dense" fullWidth>
                                <DatePicker
                                    label="Fecha Emisión"
                                    value={fechaEmi}
                                    onChange={handleChangeFechaEmi}
                                    inputFormat="dd/MM/yyyy"
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </FormControl>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4} spacing={1} justifyContent="center" alignItems="center">
                        <div style={{ display: "flex", alignItems: "center", height: '100%' }}>
                            <Button variant="contained"  onClick={handleClickAgregar} size="medium" style={{ marginRight: '5px' }}>Agregar</Button>
                            <Button variant="contained" disabled={constancias.length > 0 ? false : true} onClick={handleConstancia} size="medium" style={{ marginRight: '5px' }}>Generar Constancias</Button>
                        </div>
                    </Grid>
                </Grid>
            </Box>
            <BasicTable
                // isExportable
                isBuscador={false}
                columns={columns}
                data={constancias}

            />
        </>
    );
}