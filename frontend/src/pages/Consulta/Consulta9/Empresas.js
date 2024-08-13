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
        type: 'column'
    },
    title: {
        text: 'Momentos de unidades en geocerca, tramo / Hora de la semana en las Empresas de Transporte del Sistema'
    },
    xAxis: [{
        categories: [],
        crosshair: true
    }],
    series: [{
        name: '00:00 - 06:00',
        data: []
    }, {
        name: '07:00 - 13:00',
        data: []
    }, {
        name: '14:00 - 20:00',
        data: []
    }, {
        name: '21:00-23:00',
        data: []
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
                h06: getTotals(empresas.data.detalle, 'h06'),
                h713: getTotals(empresas.data.detalle, 'h713'),
                h1420: getTotals(empresas.data.detalle, 'h1420'),
                h2123: getTotals(empresas.data.detalle, 'h2123'),
                total: getTotals(empresas.data.detalle, 'total'),
            }];
            const concatEmpresas = [...empresas.data.detalle, ...total];

            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const h06 = empresas.data.detalle.reduce((acc, { h06 }) => (acc.push(parseInt(h06)), acc), []);
            const h713 = empresas.data.detalle.reduce((acc, { h713 }) => (acc.push(parseInt(h713)), acc), []);
            const h1420 = empresas.data.detalle.reduce((acc, { h1420 }) => (acc.push(parseInt(h1420)), acc), []);
            const h2123 = empresas.data.detalle.reduce((acc, { h2123 }) => (acc.push(parseInt(h2123)), acc), []);

            chartOptions.title.text = `Cantidad de unidades en geocerca, tramo / Hora de la semana en las Empresas de Transporte del Sistema`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = h06;
            chartOptions.series[1].data = h713;
            chartOptions.series[2].data = h1420;
            chartOptions.series[3].data = h2123;
            setEmpresas(concatEmpresas);
            setGrafico(chartOptions);
        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDet = [
        {
            Header: 'Momentos de unidades en geocerca, tramo / Hora de la semana en las Empresas de Transporte del Sistema',
            columns: [
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
                    Header: '00:00 - 06:00',
                    accessor: 'h06',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '07:00 - 13:00',
                    accessor: 'h713',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '14:00 - 20:00',
                    accessor: 'h1420',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '21:00-23:00',
                    accessor: 'h2123',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Total ',
                    accessor: 'total',
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
                razonSocialEmpresa: 'Totales',
                h06: getTotals(empresas.data.detalle, 'h06'),
                h713: getTotals(empresas.data.detalle, 'h713'),
                h1420: getTotals(empresas.data.detalle, 'h1420'),
                h2123: getTotals(empresas.data.detalle, 'h2123'),
                total: getTotals(empresas.data.detalle, 'total'),
            }];
            const concatEmpresas = [...empresas.data.detalle, ...total];

            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const h06 = empresas.data.detalle.reduce((acc, { h06 }) => (acc.push(parseInt(h06)), acc), []);
            const h713 = empresas.data.detalle.reduce((acc, { h713 }) => (acc.push(parseInt(h713)), acc), []);
            const h1420 = empresas.data.detalle.reduce((acc, { h1420 }) => (acc.push(parseInt(h1420)), acc), []);
            const h2123 = empresas.data.detalle.reduce((acc, { h2123 }) => (acc.push(parseInt(h2123)), acc), []);

            chartOptions.title.text = `Cantidad de unidades en geocerca, tramo / Hora de la semana en las Empresas de Transporte del Sistema`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = h06;
            chartOptions.series[1].data = h713;
            chartOptions.series[2].data = h1420;
            chartOptions.series[3].data = h2123;
            setEmpresas(concatEmpresas);
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