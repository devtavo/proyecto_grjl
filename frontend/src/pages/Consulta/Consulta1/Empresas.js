import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import CharBarra from '../../../components/Charts/ChartBarra';
import Highcharts from 'highcharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Stack } from '@mui/material';

// import Button from '@mui/material/Button';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';
import '../../../assets/styles/pages/reporte.css';
const today = new Date();

export const optionsDia = {
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Cantidad'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: []
}
export const optionsSemana = {
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Cantidad'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: []
}
export const optionsMes = {
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Cantidad'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: []
}

export default function Empresas({ consultaId, handleClickEmpresa }) {
    const fecha = new Date();
    const diaAnteriorConformato = fechaActual(fecha, 'dd-mm-yyyy')
    const diaAnteriorSinformato = restarDias(fecha, 1);

    const [dia, setDia] = useState([]);
    const [semana, setSemana] = useState([]);
    const [mes, setMes] = useState([]);
    const [diaOpt, setDiaOpt] = useState([]);
    const [semanaOpt, setSemanaOpt] = useState([]);
    const [mesOpt, setMesOpt] = useState([]);
    // const [value, setValue] = useState([diaAnteriorSinformato, diaAnteriorSinformato]);
    const [inicio, setInicio] = useState(diaAnteriorConformato);
    const [final, setFinal] = useState(diaAnteriorSinformato);

    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 0));
    const [graficoDia, setGraficoDia] = useState(optionsDia);
    const [graficoSem, setGraficoSem] = useState(optionsSemana);
    const [graficoMes, setGraficoMes] = useState(optionsMes);

    useEffect(() => {
        const getEmpresas = async () => {
            const chartOptionsDia = { ...optionsDia };
            const chartOptionsSemana = { ...optionsSemana };
            const chartOptionsMes = { ...optionsMes };
            const dia = await ConsultaService.getEmpresas(consultaId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
            const totalDia =
                [{
                    valor: 'Totales',
                    chancadora: getTotals(dia.data.resumenDia, 'chancadora'),
                    disposicion: getTotals(dia.data.resumenDia, 'disposicion'),
                    cantidad: getTotals(dia.data.resumenDia, 'cantidad'),
                }];
            const totalSem =
                [{
                    valor: 'Totales',
                    chancadora: getTotals(dia.data.resumenSem, 'chancadora'),
                    disposicion: getTotals(dia.data.resumenSem, 'disposicion'),
                    cantidad: getTotals(dia.data.resumenSem, 'cantidad'),
                }];
            const totalMes =
                [{
                    valor: 'Totales',
                    chancadora: getTotals(dia.data.resumenMes, 'chancadora'),
                    disposicion: getTotals(dia.data.resumenMes, 'disposicion'),
                    cantidad: getTotals(dia.data.resumenMes, 'cantidad'),
                }];
            const concatDia = [...dia.data.resumenDia, ...totalDia];
            const concatSem = [...dia.data.resumenSem, ...totalSem];
            const concatMes = [...dia.data.resumenMes, ...totalMes];

            const categoriesDia = [fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-')]
            const cantidadDia = [{ name: 'Disposición', data: dia.data.detalle.filter(a => a.tipo == 2).map(x => Number(x.cantidad)) }, { name: 'Chancadora', data: dia.data.detalle.filter(a => a.tipo == 1).map(x => Number(x.cantidad)) }];
            chartOptionsDia.title.text = `COMPARATIVO DE VIAJES, DOS ULTIMOS DIAS`;
            chartOptionsDia.xAxis.categories = categoriesDia;
            chartOptionsDia.series = cantidadDia;

            const categoriesSem = ['S24', 'S23']
            const cantidadSem = [{ name: 'Disposición', data: dia.data.detalleSem.filter(a => a.tipo == 2).map(x => Number(x.cantidad)) }, { name: 'Chancadora', data: dia.data.detalleSem.filter(a => a.tipo == 1).map(x => Number(x.cantidad)) }];
            chartOptionsSemana.title.text = `COMPARATIVO DE VIAJES, LAS DOS ULTIMAS SEMANAS`;
            chartOptionsSemana.xAxis.categories = categoriesSem;
            chartOptionsSemana.series = cantidadSem;

            const categoriesMes = ['M06', 'M05']
            const cantidadMes = [{ name: 'Disposición', data: dia.data.detalleMes.filter(a => a.tipo == 2).map(x => Number(x.cantidad)) }, { name: 'Chancadora', data: dia.data.detalleMes.filter(a => a.tipo == 1).map(x => Number(x.cantidad)) }];
            chartOptionsMes.title.text = `COMPARATIVO DE VIAJES, LAS DOS ULTIMOS MESES`;
            chartOptionsMes.xAxis.categories = categoriesMes;
            chartOptionsMes.series = cantidadMes;


            setDia(concatDia);
            setSemana(concatSem);
            setMes(concatMes);
            setGraficoDia(chartOptionsDia);
            setGraficoSem(chartOptionsSemana);
            setGraficoMes(chartOptionsMes);

        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDetDia = [
        {
            Header: 'REPORTE COMPARATIVO DE VIAJES DE LOS DOS ULTIMOS DIAS',
            columns: [
                {
                    Header: 'Fecha',
                    accessor: 'valor',
                },
                {
                    Header: 'Chancadora',
                    accessor: 'chancadora',
                },
                {
                    Header: "Disposición",
                    accessor: 'disposicion'

                },
                {
                    Header: "Total",
                    accessor: 'cantidad'

                },
            ],
            alignHeader: 'center',
        },
    ];
    const columnsDetSem = [
        {
            Header: 'REPORTE COMPARATIVO DE VIAJES DE LAS DOS ULTIMOS SEMANAS',
            columns: [
                {
                    Header: 'Fecha',
                    accessor: 'valor',
                },
                {
                    Header: 'Chancadora',
                    accessor: 'chancadora',
                },
                {
                    Header: "Disposición",
                    accessor: 'disposicion'

                },
                {
                    Header: "Total",
                    accessor: 'cantidad'

                },
            ],
            alignHeader: 'center',
        },
    ];
    const columnsDetMes = [
        {
            Header: 'REPORTE POR COMPARATIVO DE VIAJES DE LOS DOS ULTIMOS MESES',
            columns: [
                {
                    Header: 'Fecha',
                    accessor: 'valor',
                },
                {
                    Header: 'Chancadora',
                    accessor: 'chancadora',
                },
                {
                    Header: "Disposición",
                    accessor: 'disposicion'

                },
                {
                    Header: "Total",
                    accessor: 'cantidad'

                },
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <CharBarra options={graficoDia} />
                </Grid>
                <Grid item xs={4}>
                    <CharBarra options={graficoSem} />
                </Grid>
                <Grid item xs={4}>
                    <CharBarra options={graficoMes} />
                </Grid>
                <Grid item xs={4}>
                    <BasicTable
                        props={`Consulta ${consultaId} - ${columnsDetDia[0].Header}`}
                        // isExportable
                        isConsulta
                        columns={columnsDetDia}
                        data={dia}
                        isBuscador={false}
                        isPaginador={false}
                        // pdfExport={{ columnsDet, empresas }}
                        inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <BasicTable
                        props={`Consulta ${consultaId} - ${columnsDetSem[0].Header}`}
                        // isExportable
                        isConsulta
                        isBuscador={false}
                        isPaginador={false}
                        columns={columnsDetSem}
                        data={semana}
                        // pdfExport={{ columnsDet, empresas }}
                        inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')}
                    />
                </Grid>
                <Grid item xs={4}>
                    <BasicTable
                        props={`Consulta ${consultaId} - ${columnsDetMes[0].Header}`}
                        // isExportable
                        isConsulta
                        isBuscador={false}
                        isPaginador={false}
                        columns={columnsDetMes}
                        data={mes}
                        // pdfExport={{ columnsDet, empresas }}
                        inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')}
                    />
                </Grid>
            </Grid>


        </>
    );
}