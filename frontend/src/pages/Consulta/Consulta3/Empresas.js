import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Link from '@mui/material/Link';
import Dialog from '../../../components/Dialog/Dialog';

import TextField from '@mui/material/TextField';
import CharBarra from '../../../components/Charts/ChartBarra';
import Highcharts from 'highcharts';
import Stack from '@mui/material/Stack';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import SummarizeIcon from '@mui/icons-material/Summarize';
import Button from '@mui/material/Button';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import DatePicker from '@mui/lab/DatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';
import '../../../assets/styles/pages/reporte.css';
import EettService from '../../../services/EettService';
import PreviewIcon from '@mui/icons-material/Preview';
const today = new Date();

export const options = {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Reporte de viajes por Empresa'
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
                text: 'cantidad',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }],
    tooltip: {
        shared: true
    },
    series: [
        {
            name: 'Viajes Pagados',
            type: 'column',
            data: [],
            tooltip: {
                valueSuffix: ' '
            }
        },
        {
            name: 'Viajes Realizados',
            type: 'column',

            data: [],
            tooltip: {
                valueSuffix: ' '
            }
        }]
}

export default function Empresas({ consultaId, handleClickEmpresa }) {
    const fecha = new Date();
    const diaAnteriorConformato = fechaActual(fecha, 'dd-mm-yyyy')
    const diaAnteriorSinformato = restarDias(fecha, -1);

    const [empresas, setEmpresas] = useState([]);
    const [empresasOpt, setEmpresaOpt] = useState([]);
    const [value, setValue] = useState([diaAnteriorSinformato, diaAnteriorSinformato]);
    const [inicio, setInicio] = useState(diaAnteriorConformato);
    const [final, setFinal] = useState(diaAnteriorConformato);
    const [pdfUrl, setPdfUrl] = useState('');
    const [openDialogPdf, setOpenDialogPdf] = useState(false);

    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() , 0, 0, 0));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() , 23, 59, 0));
    const [grafico, setGrafico] = useState(options);

    useEffect(() => {
        const getEmpresas = async () => {
            const chartOptions = { ...options };
            const empresas = await ConsultaService.getEmpresas(consultaId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
            setEmpresas(empresas.data.detalle)
        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDet = [
        {
            Header: 'Reporte Resumen General',
            columns: [
                // {
                //     Header: '#',
                //     accessor: 'id',
                // },
                {
                    Header: 'Razon Social Empresa',
                    accessor: 'razonSocialEmpresa',
                },
                {
                    Header: 'Saldo Inicial',
                    accessor: 'saldoInicial',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Pagados Dia',
                    accessor: 'pagadosDia',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Saldo Final',
                    accessor: 'saldoFinal',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes Dia',
                    accessor: 'viajesDia',
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
                                    <Button disabled={empresa.ruta == null ? true : false} size="small" variant="outlined" startIcon={<PreviewIcon />} onClick={() => {
                                        setOpenDialogPdf(true);
                                        setPdfUrl(empresa.ruta);
                                    }}>
                                        Ver Reporte Diario
                                    </Button>
                                </Stack>
                            </>
                        );
                    },
                },

            ],
            alignHeader: 'center',
        },
    ];
    const handleChangeFechaInicio = (fecha) => {
        setFechaInicio(fecha);
    };

    const handleChangeFechaFin = (fecha) => {
        setFechaFin(fecha);
    };
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
    const handleClickBuscar = () => {
        const getEmpresas = async () => {
            const chartOptions = { ...options };
            const empresas = await ConsultaService.getEmpresas(consultaId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
            setEmpresas(empresas.data.detalle)

        };
        getEmpresas();
    }
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl margin="dense" fullWidth>
                            <DatePicker
                                label="Fecha"
                                value={fechaInicio}
                                onChange={handleChangeFechaInicio}
                                inputFormat="dd-MM-yyyy"
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2} justifyContent="center" alignItems="center">
                    <div style={{ display: "flex", alignItems: "center", height: '100%' }}>
                        <Button variant="contained" onClick={handleClickBuscar} size="large" className="reporte__boton">Buscar</Button>
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {/* <Grid item xs={12}>
                    <CharBarra options={grafico} />
                </Grid> */}
                <Grid item xs={12}>
                    <br />
                    <Stack direction="row" spacing={2} style={{ float: 'left', marginBottom: '24px' }}>
                        <Button variant="outlined" startIcon={<SummarizeIcon />} onClick={() => {
                            handleReporte();
                        }}>Generar Reporte Diario Masivo</Button>
                    </Stack>
                    <Stack direction="row" spacing={2} style={{ float: 'left', marginBottom: '24px' }}>
                        <Button variant="outlined" startIcon={<ForwardToInboxIcon />} onClick={() => {
                            handleEnvio()
                        }}>Enviar Reporte Diario Masivo</Button>
                    </Stack>
                    <Stack direction="row" spacing={2} style={{ float: 'left', marginBottom: '24px' }}>
                        <Button variant="outlined" startIcon={<ForwardToInboxIcon />} onClick={() => {
                            handleEnvio()
                        }}>Enviar Resumen Diario</Button>
                    </Stack>
                    {/* <Stack direction="row" spacing={2} style={{ float: 'left', marginBottom: '24px' }}>
                        <Button variant="outlined" startIcon={<SummarizeIcon />} onClick={handleClickBuscar} className="reporte__boton">Generar Resumen</Button>
                    </Stack> */}
                    <Dialog maxWidth='xl' open={openDialogPdf} title='Lista de Rutas asignadas' handleClose={onCloseDialogPdf}>
                        <embed src={`http://localhost/smlpr/sml_pr/backend/api-web/output/output/${fechaInicio.toLocaleDateString().split('/').map(a=>a.padStart(2,'0')).join('_')}/${pdfUrl}`} type="application/pdf" width="1000px" height="600px" />
                    </Dialog>
                    <BasicTable
                        props={`Consulta ${consultaId} - ${columnsDet[0].Header}`}
                        columns={columnsDet}
                        data={empresas}
                        isBuscador={false}
                        isPaginador={false}

                    // pdfExport={{ columnsDet, empresas }}
                    // inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')}
                    />
                </Grid>
            </Grid>

            <br />

        </>
    );
}