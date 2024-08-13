import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import CharBarra from '../../../components/Charts/ChartBarra';
import Highcharts from 'highcharts';

import Button from '@mui/material/Button';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';
import '../../../assets/styles/pages/reporte.css';
const today = new Date();

export const options = {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Kilómetros Recorridos fuera de Ruta en las Empresas de Transporte del Sistema'
    },
    xAxis: [{
        categories: [],
        crosshair: true
    }],
    yAxis: [

        {
            title: {
                text: 'Porcentaje',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}%',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true

        }, 
        {
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Detenciones',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
        }],
    tooltip: {
        shared: true
    },
    series: [
        {
            name: 'Total paraderos',
            type: 'column',
            yAxis: 1,
            data: []
        },
        {
            name: 'No Detención en Paraderos',
            type: 'column',
            yAxis: 1,
            data: []
        },
        {
            name: 'Porcentaje de No Detenciones en Paraderos',
            type: 'spline',
            data: [],
            tooltip: {
                valueSuffix: '%'
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

    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 0));
    const [grafico, setGrafico] = useState(options);

    useEffect(() => {
        const getEmpresas = async () => {
            const chartOptions = { ...options };
            const empresas = await ConsultaService.getEmpresas(consultaId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
            const total =
                [{
                    id: 'Totales',
                    idEtt: '',
                    razonSocialEmpresa: '',
                    detencion: getTotals(empresas.data.detalle, 'detencion'),
                    noDetencion: getTotals(empresas.data.detalle, 'noDetencion'),
                    porcNoDetencion: getPromedio(empresas.data.detalle, 'porcNoDetencion') + '%'
                }];
          
            const concatEmpresas = [...empresas.data.detalle, ...total];
            
            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const detencion = empresas.data.detalle.reduce((acc, { detencion }) => (acc.push(parseInt(detencion)), acc), []);
            const noDetencion = empresas.data.detalle.reduce((acc, { noDetencion }) => (acc.push(parseInt(noDetencion)), acc), []);
            const porcNoDetencion = empresas.data.detalle.reduce((acc, { porcNoDetencion }) => (acc.push(parseInt(porcNoDetencion)), acc), []);

            chartOptions.title.text = `Porcentaje de No Detenciones en Paraderos en las Empresas de Transporte del Sistema`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = detencion;
            chartOptions.series[1].data = noDetencion;
            chartOptions.series[2].data = porcNoDetencion;
            setGrafico(chartOptions);


            setEmpresas(concatEmpresas);
            setEmpresaOpt(empresas.data.chart);
            setGrafico(chartOptions);
        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDet = [
        {
            Header: 'Porcentaje de No Detenciones en Paraderos en las Empresas de Transporte del Sistema',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Cod. Empresa',
                    accessor: 'idEtt',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Empresa",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idEtt, razonSocialEmpresa } = empresas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickEmpresa(e, idEtt, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'),razonSocialEmpresa)
                            }}>
                                {razonSocialEmpresa}
                            </Link>
                        );
                    },
                    accessor: 'razonSocialEmpresa'

                },
                {
                    Header: 'Total Paraderos',
                    accessor: 'detencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'No Detención en Paraderos',
                    accessor: 'noDetencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje de No Detenciones en Paraderos',
                    accessor: 'porcNoDetencion',
                    alignBody: 'center',
                    alignHeader: 'center'
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

    const handleClickBuscar = () => {
        const getEmpresas = async () => {
            const chartOptions = { ...options };
            const empresas = await ConsultaService.getEmpresas(consultaId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
            const total =
                [{
                    id: 'Totales',
                    idEtt: '',
                    razonSocialEmpresa: '',
                    detencion: getTotals(empresas.data.detalle, 'detencion'),
                    noDetencion: getTotals(empresas.data.detalle, 'noDetencion'),
                    porcNoDetencion: getPromedio(empresas.data.detalle, 'porcNoDetencion') + '%'
                }];
          
            const concatEmpresas = [...empresas.data.detalle, ...total];
            
            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const detencion = empresas.data.detalle.reduce((acc, { detencion }) => (acc.push(parseInt(detencion)), acc), []);
            const noDetencion = empresas.data.detalle.reduce((acc, { noDetencion }) => (acc.push(parseInt(noDetencion)), acc), []);
            const porcNoDetencion = empresas.data.detalle.reduce((acc, { porcNoDetencion }) => (acc.push(parseInt(porcNoDetencion)), acc), []);

            chartOptions.title.text = `Porcentaje de No Detenciones en Paraderos en las Empresas de Transporte del Sistema`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = detencion;
            chartOptions.series[1].data = noDetencion;
            chartOptions.series[2].data = porcNoDetencion;
            setGrafico(chartOptions);


            setEmpresas(concatEmpresas);
            setEmpresaOpt(empresas.data.chart);
            setGrafico(chartOptions);
        };
        getEmpresas();
    }
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl margin="dense" fullWidth>
                            <DateTimePicker
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
                            <DateTimePicker
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
                <Grid item xs={12}>
                    <CharBarra options={grafico} />
                </Grid>
                <Grid item xs={12}>
                    <BasicTable
                        props={`Consulta ${consultaId} - ${columnsDet[0].Header}`}
                        isExportable
                        isConsulta
                        columns={columnsDet}
                        data={empresas}
                        pdfExport={{ columnsDet, empresas }}
                        inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')}
                    />
                </Grid>
            </Grid>

            <br />

        </>
    );
}