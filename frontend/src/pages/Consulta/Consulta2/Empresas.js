import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import CharBarra from '../../../components/Charts/ChartBarra';
import Highcharts from 'highcharts';
import Stack from '@mui/material/Stack';
import Dialog from '../../../components/Dialog/Dialog';

import Button from '@mui/material/Button';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DatePicker from '@mui/lab/DatePicker';

import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';
import '../../../assets/styles/pages/reporte.css';
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

    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 0));
    const [grafico, setGrafico] = useState(options);

    useEffect(() => {
        const getEmpresas = async () => {
            // const chartOptions = { ...options };
            const empresas = await ConsultaService.getEmpresas(consultaId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
            console.log(empresas.data.detalle)
            setEmpresas(empresas.data.detalle);

        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDet = [
        {
            Header: 'Lista Constancias Generadas',
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
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        // const constancia = constancias[rowIdx];
                        return (
                            <>
                                <Stack spacing={1} direction="row">
                                    <Button size="small" variant="outlined" onClick={() => {
                                        // console.log(constancias);
                                        // handleConstancia(constancias)
                                        // setConstanciaSel(constancia);
                                        // setOpenDialog(true);
                                        setOpenDialogPdf(true);
                                        // setPdfUrl(empresa.ruta);
                                    }}>
                                        Visualizar
                                    </Button>
                                </Stack>
                            </>
                        );
                    },
                    alignBody: 'center',
                    alignHeader: 'center'
                }
            ],
        },
    ];
    const handleChangeFechaInicio = (fecha) => {
        setFechaInicio(fecha);
    };

    const handleChangeFechaFin = (fecha) => {
        setFechaFin(fecha);
    };

    const handleClickBuscar = () => {
        const getEmpresas = async () => {
            const empresas = await ConsultaService.getEmpresas(consultaId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));

            setEmpresas(empresas.data.detalle);

        };
        getEmpresas();
    }
    const onCloseDialogPdf = () => {
        // setInitialValues({});
        setOpenDialogPdf(false);
    }
    return (
        <>
            <Dialog maxWidth='xl' open={openDialogPdf} title='Lista de Rutas asignadas' handleClose={onCloseDialogPdf}>
                {/* <embed src={`http://localhost/smlpr/sml_pr/backend/api-web/output/output/${fechaInicio.toLocaleDateString().split('/').map(a => a.padStart(2, '0')).join('_')}/${pdfUrl}`} type="application/pdf" width="1000px" height="600px" /> */}
                <embed src={`http://localhost/smlpr/sml_pr/backend/api-web/output/constancias/00251-2023-ADEICS.pdf`} type="application/pdf" width="1000px" height="600px" />
            </Dialog>

            <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl margin="dense" fullWidth>
                            <DatePicker
                                label="Rango de inicio"
                                value={fechaInicio}
                                onChange={handleChangeFechaInicio}
                                inputFormat="dd-MM-yyyy"
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl margin="dense" fullWidth>
                            <DatePicker
                                label="Rango final"
                                value={fechaFin}
                                onChange={handleChangeFechaFin}
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
                    <BasicTable
                        props={`Consulta ${consultaId} - ${columnsDet[0].Header}`}
                        isExportable
                        isConsulta
                        columns={columnsDet}
                        data={empresas}
                        isBuscador={false}
                        isPaginador={false}
                        pdfExport={{ columnsDet, empresas }}
                        inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')}
                    />
                </Grid>
            </Grid>

            <br />

        </>
    );
}