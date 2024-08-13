import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import FlotaService from '../../services/FlotaService';
import EettService from '../../services/EettService';
import useStyle from './style';
import CrearFlota from './CrearFlota';
import AsignarFlota from './AsignarFlota';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import BackupIcon from '@mui/icons-material/Backup';
import Input from '@mui/material/Input';
import RutasService from '../../services/RutaService';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export const CREAR_VEHICULO_FLOTA = 'CREAR_VEHICULO_FLOTA';
export const EDITAR_VEHICULO_FLOTA = 'EDITAR_VEHICULO_FLOTA';
export const ASIGNAR_VEHICULO_RUTA = 'ASIGNAR_VEHICULO_RUTA';
const MENSAJES_DE_RESPUESTA = {
    CREAR_VEHICULO_FLOTA: 'Vehiculo registrada correctamente',
    EDITAR_VEHICULO_FLOTA: 'Vehiculo actualizada correctamente',
    ASIGNAR_VEHICULO_RUTA: 'Vehiculo asignado correctamente'
};

export default function Flota() {
    var classes = useStyle();

    const { flotaId } = useParams();
    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogErr, setOpenDialogErr] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_VEHICULO_FLOTA);
    const [initialValues, setInitialValues] = useState({});
    const [flotas, setFlotas] = useState([]);
    const [flotasErr, setFlotasErr] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [empresa, setEmpresa] = useState('');
    const [file, setFile] = useState({});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const getFlotas = async () => {
            const empresasTransporte = await EettService.getAll();
            const empresaActual = empresasTransporte.data.find(et => et.id === parseInt(flotaId));
            setEmpresa(empresaActual.razonSocialEmpresa);

            const flotas = await FlotaService.getAll(flotaId);
            setEmpresas(flotas.data);
            setFlotas(flotas.data);


        };
        getFlotas();
    }, []);

    const columnsDetErr = [
        {
            Header: 'Lista de Vehiculos con Error',
            columns: [
                {
                    Header: "Placa",
                    accessor: 'placa_vehiculo',
                },
                {
                    Header: "Error",
                    accessor: 'error',
                },

            ],
        },
    ];
    const columnsDet = [
        {
            Header: 'Lista de Vehiculos de una empresa',
            columns: [
                {
                    Header: "#",
                    accessor: 'id',
                },
                {
                    Header: 'Razon Social Empresa',
                    accessor: 'razonSocialEmpresa',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Placa Vehiculo',
                    accessor: 'placaVehiculo',
                },
                {
                    Header: 'Estado',
                    accessor: 'estadoVehiculo',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Codigo SOAT',
                    accessor: 'codigoSoat',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Fecha Vencimiento SOAT',
                    accessor: 'vencimientoSoat',
                    alignBody: 'center',
                    alignHeader: 'center'
                },

                {
                    Header: 'Fecha Registro',
                    accessor: 'fechaRegistroVehiculo',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const flota = flotas[rowIdx];

                        return (
                            <>
                                <Stack spacing={2} direction="row">
                                    <Button variant="text" size="small" onClick={() => {
                                        setInitialValues(flota);
                                        setFormulario(EDITAR_VEHICULO_FLOTA);
                                        setOpenDialog(true);
                                    }}>
                                        Editar
                                    </Button>
                                </Stack>
                            </>
                        );
                    }
                }
            ],
        },
    ];

    const onSuccess = (flota) => {
        if (formulario === CREAR_VEHICULO_FLOTA)
            setFlotas([...flotas, ...flota]);

        if (formulario === EDITAR_VEHICULO_FLOTA) {
            const nFlotas = flotas.map(f => f.placaVehiculo === flota.placaVehiculo ? { ...f, ...flota } : f);
            console.log(nFlotas);
            setFlotas(nFlotas);
            setInitialValues({});
        }

        setOpenDialog(false);
        setSnack({ ...snack, open: true, severity: 'success', message: MENSAJES_DE_RESPUESTA[formulario] });
    }

    const onCloseDialog = () => {
        setInitialValues({});
        setOpenDialog(false);
    }
    const onCloseDialogErr = () => {
        setOpenDialogErr(false);
    }
    const breadCrumb = [
        {
            name: 'Inicio',
            path: '../'
        },
        {
            name: 'Mantenimiento',
            path: '../'
        },
        {
            name: 'Placas Camiones',
            path: '../empresas'
        }
    ]
    const onChangeHandler = async event => {
        setOpen(true);

        const uploadFlotas = await RutasService.uploadFile(flotaId, event.target.files[0]);
        // uploadFlotas.map(x=>({...x,razonSocialEmpresa:empresa}))
        console.log(uploadFlotas);
        if (uploadFlotas.data[0].mgs == 'ok') {
            const flotas = await FlotaService.getAll(flotaId);
            setFlotasErr(uploadFlotas.data[1].err)
            setFlotas(flotas.data);
            setOpen(false);
            setOpenDialogErr(true);

        }else{
            setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la flota masiva` });
        }
        // setFile({ fileName: event.target.id.substr(2), fileHandle: event.target.files[0] });

    }
    return (

        <>
            {/* <BackButton to='../empresas' /> */}
            <BackButton to='../empresas' />
            <Navigation
                title={empresa}
                breadcrumb={breadCrumb}
            />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Notification snack={snack} setSnack={setSnack} />
            <Stack direction="row" spacing={1} style={{ float: 'right' }}>
                <Button variant="outlined" startIcon={<AppRegistrationOutlinedIcon />} onClick={() => {
                    setFormulario(CREAR_VEHICULO_FLOTA);
                    setOpenDialog(true);
                    setInitialValues({ "idEtt": flotaId });
                }}>Registrar Vehiculo</Button>
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<BackupIcon />}
                >
                    Subir Vehiculos masivos
                    <input onChange={onChangeHandler}
                        type="file"
                        hidden
                    />
                </Button>
            </Stack>
            <br />
            <Dialog open={openDialogErr} maxWidth="lg" title="Placas Duplicadas" handleClose={onCloseDialogErr}>
                <BasicTable
                    props={`Placas vehiculares con error de la empresa ${empresa} `}
                    isConsulta
                    columns={columnsDetErr}
                    data={flotasErr}
                    className={classes.container}
                />
                </Dialog> 
            {formulario === ASIGNAR_VEHICULO_RUTA ?
                <Dialog open={openDialog} maxWidth="lg" title={formulario === ASIGNAR_VEHICULO_RUTA ? 'Asignar ruta' : ''} handleClose={onCloseDialog}>
                    <AsignarFlota
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(flota) => {
                            onSuccess(flota);
                        }}
                        onError={(error) => {
                            setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la flota: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog> :
                <Dialog open={openDialog} title={formulario === CREAR_VEHICULO_FLOTA ? 'Registrar Vehiculo' : formulario === EDITAR_VEHICULO_FLOTA ? 'Editar vehiculo' : 'Asignar ruta'} handleClose={onCloseDialog}>
                    <CrearFlota
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(flota) => {
                            onSuccess(flota);
                        }}
                        onError={(error) => {
                            setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la flota: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>
            }
            <br />
            <BasicTable
                props={`Flota Vehicular de la empresa ${empresa} `}
                isConsulta
                columns={columnsDet}
                data={flotas}
                className={classes.container}
            />
        </>
    );
}