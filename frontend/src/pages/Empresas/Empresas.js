import { useState, useEffect, useParams } from "react";

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearEmpresa from './CrearEmpresa';
import Viajes from './Viajes';
import EettService from '../../services/EettService';
import useStyle from './style';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import SummarizeIcon from '@mui/icons-material/Summarize';
// import { Document, Page } from 'react-pdf';
var fechaActual = new Date();
var ano = fechaActual.getFullYear(); // Obtiene el año actual
var mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
var dia = fechaActual.getDate()-1; 
// console.log(dia,mes,ano);
export const CREAR_EMPRESA = 'CREAR_EMPRESA';
export const EDITAR_EMPRESA = 'EDITAR_EMPRESA';
export const MOSTRAR_RUTAS = 'MOSTRAR_RUTAS';

const MENSAJES_DE_RESPUESTA = {
    CREAR_EMPRESA: 'Empresa registrada correctamente',
    EDITAR_EMPRESA: 'Empresa actualizada correctamente'
};

export default function Empresas() {
    var classes = useStyle();

    const user = JSON.parse(localStorage.getItem('user')).idEtt;

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogPdf, setOpenDialogPdf] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_EMPRESA);
    const [initialValues, setInitialValues] = useState({});
    const [empresas, setEmpresas] = useState([]);
    const [empresaId, setEmpresaId] = useState([]);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [fecha, setFecha] = useState(`${dia}_${mes}_${ano}`);
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await EettService.getAll(user);
            console.log(user);
            setEmpresas(empresas.data);
        };
        getEmpresas();
    }, []);

    const columns = [
        {
            Header: 'Lista de Empresas',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Ruc',
                    accessor: 'rucEtt',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Razón social',
                    accessor: 'razonSocialEmpresa',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Dirección',
                    accessor: 'direccion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Tipo Operación',
                    accessor: 'tipo',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Estado Empresa',
                    accessor: 'estadoEtt',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes Disponibles',
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const empresa = empresas[rowIdx];

                        return (
                            <p>{empresa.viajes}</p>
                        );
                    },
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Fecha Registro',
                    accessor: 'fechaRegistro',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const empresa = empresas[rowIdx];
                        return (
                            <>
                                <Stack spacing={1} direction="row">
                                    <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => {
                                        setInitialValues(empresa);
                                        setFormulario(EDITAR_EMPRESA);
                                        setOpenDialog(true);
                                    }}>
                                        Editar
                                    </Button>

                                    <Button component={Link} startIcon={<LocalShippingIcon />} to={`/flotas/${empresa.id}`} variant="outlined" size="small" nombreEmpresa={empresa.razonSocialEmpresa}>
                                        Flota
                                    </Button>

                                    <Button variant="outlined" startIcon={<PriceCheckOutlinedIcon />} size="small" onClick={() => {
                                        setInitialValues(empresa);
                                        setFormulario(MOSTRAR_RUTAS);
                                        setOpenDialog(true);
                                        setEmpresaId(empresa.id);
                                    }}>
                                        Viajes
                                    </Button>
                                    <Button disabled={empresa.ruta==null? true:false} variant="outlined" startIcon={<AssessmentIcon />} size="small" onClick={() => {
                                        setOpenDialogPdf(true);
                                        setPdfUrl(empresa.ruta);
                                    }}>
                                        Ver Ultimo Reporte
                                    </Button>
                                </Stack>
                            </>
                        );
                    },
                    alignHeader: 'center'
                }
            ],
        },
    ];
    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };
    const onSuccess = (empresa) => {
        if (formulario === CREAR_EMPRESA)
            setEmpresas([...empresas, ...empresa]);

        if (formulario === EDITAR_EMPRESA) {
            const nEmpresas = empresas.map(e => e.id === empresa.id ? { ...e, ...empresa } : e);
            setEmpresas(nEmpresas);
            setInitialValues({});
        }

        setOpenDialog(false);
        setSnack({ ...snack, open: true, severity: 'success', message: MENSAJES_DE_RESPUESTA[formulario] });
    }

    const onCloseDialog = () => {
        setInitialValues({});
        setOpenDialog(false);
    }
    const handleReporte = async () => {

            const empresas = await EettService.generarDiario();
            console.log(empresas);
    }
    const handleEnvio = async () => {

            const envio = await EettService.generaEnvio();
            console.log(envio);
    }
    const onCloseDialogPdf = () => {
        // setInitialValues({});
        setOpenDialogPdf(false);
    }
    const breadCrumb = [
        {
            name: 'Inicio',
            path: '../'
        },
        {
            name: 'Mantenimiento',
            path: '../'
        }
    ]
    return (
        <>
            <Notification snack={snack} setSnack={setSnack} />
            <BackButton to='../' />
            <Navigation
                title="Empresas de transporte"
                breadcrumb={breadCrumb}
            />
            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                <Button variant="outlined" startIcon={<AppRegistrationOutlinedIcon />} onClick={() => {
                    setFormulario(CREAR_EMPRESA);
                    setOpenDialog(true);
                }}>Registrar Empresa</Button>
            </Stack>
            {/* <Stack direction="row" spacing={2} style={{ float: 'left', marginBottom: '24px' }}>
                <Button variant="outlined" startIcon={<SummarizeIcon />} onClick={() => {
                   handleReporte(); 
                setFormulario(CREAR_EMPRESA);
                    // setOpenDialog(true);
                }}>Generar Reporte Diario Masivo</Button>
            </Stack>
            <Stack direction="row" spacing={2} style={{ float: 'left', marginBottom: '24px' }}>
                <Button variant="outlined" startIcon={<ForwardToInboxIcon />} onClick={() => {
                    handleEnvio()
                    setFormulario(CREAR_EMPRESA);
                    // setOpenDialog(true);
                }}>Enviar Reporte Diario Masivo</Button>
            </Stack> */}
            {formulario === MOSTRAR_RUTAS ?
                <Dialog open={openDialog} title='Lista de Comprobantes ' handleClose={onCloseDialog}>
                    <Viajes empresaId={empresaId} />

                </Dialog>
                :
                <Dialog open={openDialog} title={formulario === CREAR_EMPRESA ? 'Registrar Empresa' : 'Editar empresa'} handleClose={onCloseDialog}>
                    <CrearEmpresa
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(empresa) => {
                            onSuccess(empresa);
                        }}
                        onError={(error) => {
                            setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la empresa: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>
            }
            <Dialog maxWidth='xl' open={openDialogPdf} title='Lista de Rutas asignadas' handleClose={onCloseDialogPdf}>
                {/* <Document
                    file={pdfUrl}
                    onLoadSuccess={handleDocumentLoadSuccess}
                >
                    <Page pageNumber={currentPage} />
                </Document> */}
                <embed src={`http://localhost/smlpr/sml_pr/backend/api-web/output/output/${fecha}/${pdfUrl}`} type="application/pdf" width="1000px" height="600px" />
            </Dialog>
            <BasicTable
                columns={columns}
                data={empresas}
                isBuscador={false}

                className={classes.container}
            />
        </>
    );
}