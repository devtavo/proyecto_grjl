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
        text: 'Cantidad momentos de vehículos por rango de velocidad x día x semana x tabla con baremos'
    },
    xAxis: [{
        categories: [],
        crosshair: true
    }],
    series: [{
        name: 'Velocidad igual a 0',
        data: []
    }, {
        name: 'Velocidad entre 1 y 30',
        data: []
    }, {
        name: 'Velocidad entre 31 y 60',
        data: []
    }, {
        name: 'Velocidad entre 60 y 90',
        data: []
    }, {
        name: 'Velocidad mayor a 90',
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
                    razonSocialEmpresa: 'Totales',
                    vel0: getPromedio(empresas.data.detalle, 'vel0'),
                    vel130: getPromedio(empresas.data.detalle, 'vel130'),
                    vel3160: getPromedio(empresas.data.detalle, 'vel3160'),
                    vel6090: getPromedio(empresas.data.detalle, 'vel6090'),
                    velM90: getPromedio(empresas.data.detalle, 'velM90'),
                    total: getPromedio(empresas.data.detalle, 'total')
                }];

            const concatEmpresas = [...empresas.data.detalle, ...total];

            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const vel0 = empresas.data.detalle.reduce((acc, { vel0 }) => (acc.push(parseInt(vel0)), acc), []);
            const vel130 = empresas.data.detalle.reduce((acc, { vel130 }) => (acc.push(parseInt(vel130)), acc), []);
            const vel3160 = empresas.data.detalle.reduce((acc, { vel3160 }) => (acc.push(parseInt(vel3160)), acc), []);
            const vel6090 = empresas.data.detalle.reduce((acc, { vel6090 }) => (acc.push(parseInt(vel6090)), acc), []);
            const velM90 = empresas.data.detalle.reduce((acc, { velM90 }) => (acc.push(parseInt(velM90)), acc), []);

            chartOptions.title.text = `Cantidad momentos de vehículos por rango de velocidad x día x semana x tabla con baremos`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = vel0;
            chartOptions.series[1].data = vel130;
            chartOptions.series[2].data = vel3160;
            chartOptions.series[3].data = vel6090;
            chartOptions.series[4].data = velM90;
            setEmpresas(concatEmpresas);
            setGrafico(chartOptions);
        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDet = [
        {
            Header: 'Cantidad momentos de vehículos por rango de velocidad x día x semana x tabla con baremos',
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
                    Header: 'Velocidad igual a 0',
                    accessor: 'vel0',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad entre 1 y 30',
                    accessor: 'vel130',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad entre 31 y 60',
                    accessor: 'vel3160',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad entre 60 y 90',
                    accessor: 'vel6090',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad mayor a 90',
                    accessor: 'velM90',
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
                    vel0: getPromedio(empresas.data.detalle, 'vel0'),
                    vel130: getPromedio(empresas.data.detalle, 'vel130'),
                    vel3160: getPromedio(empresas.data.detalle, 'vel3160'),
                    vel6090: getPromedio(empresas.data.detalle, 'vel6090'),
                    velM90: getPromedio(empresas.data.detalle, 'velM90'),
                    total: getPromedio(empresas.data.detalle, 'total')
                }];

            const concatEmpresas = [...empresas.data.detalle, ...total];

            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const vel0 = empresas.data.detalle.reduce((acc, { vel0 }) => (acc.push(parseInt(vel0)), acc), []);
            const vel130 = empresas.data.detalle.reduce((acc, { vel130 }) => (acc.push(parseInt(vel130)), acc), []);
            const vel3160 = empresas.data.detalle.reduce((acc, { vel3160 }) => (acc.push(parseInt(vel3160)), acc), []);
            const vel6090 = empresas.data.detalle.reduce((acc, { vel6090 }) => (acc.push(parseInt(vel6090)), acc), []);
            const velM90 = empresas.data.detalle.reduce((acc, { velM90 }) => (acc.push(parseInt(velM90)), acc), []);

            chartOptions.title.text = `Cantidad momentos de vehículos  por rango de velocidad x día x semana x tabla con baremos`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = vel0;
            chartOptions.series[1].data = vel130;
            chartOptions.series[2].data = vel3160;
            chartOptions.series[3].data = vel6090;
            chartOptions.series[4].data = velM90;
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