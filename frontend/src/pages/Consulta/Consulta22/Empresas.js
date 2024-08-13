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
        text: 'Cantidad De Vehículos Por Geocerca, Ruta, Empresa, Rango De Fecha'
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
            name: 'cantidad de Vehiculos',
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
                    codEtt: '',
                    razonSocialEmpresa: '',
                    vServicio: getTotals(empresas.data.detalle, 'vServicio')
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];

            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const vServicio = empresas.data.detalle.reduce((acc, { vServicio }) => (acc.push(parseInt(vServicio)), acc), []);

            chartOptions.title.text = `Cantidad De Vehículos Por Geocerca, Ruta, Empresa, Rango De Fecha`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = vServicio;

            setEmpresas(concatEmpresas);
            setEmpresaOpt(empresas.data.chart);
            setGrafico(chartOptions);

        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDet = [
        {
            Header: 'Cantidad De Vehículos Por Geocerca, Ruta, Empresa, Rango De Fecha',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: 'Cod. Empresa',
                    accessor: 'codEtt',
                },
                {
                    Header: "Empresa",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idEtt, razonSocialEmpresa } = empresas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickEmpresa(e, idEtt, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'), razonSocialEmpresa)
                            }}>
                                {razonSocialEmpresa}
                            </Link>
                        );
                    },
                    accessor: 'razonSocialEmpresa'

                },
                {
                    Header: 'Vehiculos Servicio',
                    accessor: 'vServicio',
                    alignBody: 'center',
                    alignHeader: 'center'
                }
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
                    codEtt: '',
                    razonSocialEmpresa: '',
                    vServicio: getTotals(empresas.data.detalle, 'vServicio')
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];

            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const vServicio = empresas.data.detalle.reduce((acc, { vServicio }) => (acc.push(parseInt(vServicio)), acc), []);

            chartOptions.title.text = `Cantidad De Vehículos Por Geocerca, Ruta, Empresa, Rango De Fecha`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = vServicio;

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