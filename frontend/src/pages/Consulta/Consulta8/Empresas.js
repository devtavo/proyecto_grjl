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
        text: 'Cantidad de unidades en geocerca, tramo / Día de la semana en las Empresas de Transporte del Sistema'
    },
    xAxis: [{
        categories: [],
        crosshair: true
    }],
    series: [{
        name: 'Lunes',
        data: []
    }, {
        name: 'Martes',
        data: []
    }, {
        name: 'Miércoles',
        data: []
    }, {
        name: 'Jueves',
        data: []
    }, {
        name: 'Viernes',
        data: []
    }, {
        name: 'Sábado',
        data: []
    }, {
        name: 'Domingo',
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
                lun: getTotals(empresas.data.detalle, 'lun'),
                mar: getTotals(empresas.data.detalle, 'mar'),
                mie: getTotals(empresas.data.detalle, 'mie'),
                jue: getTotals(empresas.data.detalle, 'jue'),
                vie: getTotals(empresas.data.detalle, 'vie'),
                sab: getTotals(empresas.data.detalle, 'sab'),
                dom: getTotals(empresas.data.detalle, 'dom'),
                total: getTotals(empresas.data.detalle, 'total'),
            }];
            const concatEmpresas = [...empresas.data.detalle, ...total];

            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const lun = empresas.data.detalle.reduce((acc, { lun }) => (acc.push(parseInt(lun)), acc), []);
            const mar = empresas.data.detalle.reduce((acc, { mar }) => (acc.push(parseInt(mar)), acc), []);
            const mie = empresas.data.detalle.reduce((acc, { mie }) => (acc.push(parseInt(mie)), acc), []);
            const jue = empresas.data.detalle.reduce((acc, { jue }) => (acc.push(parseInt(jue)), acc), []);
            const vie = empresas.data.detalle.reduce((acc, { vie }) => (acc.push(parseInt(vie)), acc), []);
            const sab = empresas.data.detalle.reduce((acc, { sab }) => (acc.push(parseInt(sab)), acc), []);
            const dom = empresas.data.detalle.reduce((acc, { dom }) => (acc.push(parseInt(dom)), acc), []);

            chartOptions.title.text = `Cantidad de unidades en geocerca, tramo / Día de la semana en las Empresas de Transporte del Sistema`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = lun;
            chartOptions.series[1].data = mar;
            chartOptions.series[2].data = mie;
            chartOptions.series[3].data = jue;
            chartOptions.series[4].data = vie;
            chartOptions.series[5].data = sab;
            chartOptions.series[6].data = dom;
            setEmpresas(concatEmpresas);
            setGrafico(chartOptions);
        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDet = [
        {
            Header: 'Cantidad de unidades en geocerca, tramo / Día de la semana en las Empresas de Transporte del Sistema',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
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
                                handleClickEmpresa(e, idEtt, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'), razonSocialEmpresa)
                            }}>
                                {razonSocialEmpresa}
                            </Link>
                        );
                    },
                    accessor: 'razonSocialEmpresa'
                },
                {
                    Header: 'Lunes',
                    accessor: 'lun',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Martes',
                    accessor: 'mar',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Miércoles',
                    accessor: 'mie',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Jueves',
                    accessor: 'jue',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viernes',
                    accessor: 'vie',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Sábado',
                    accessor: 'sab',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Domingo',
                    accessor: 'dom',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Total vehículos',
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
                lun: getTotals(empresas.data.detalle, 'lun'),
                mar: getTotals(empresas.data.detalle, 'mar'),
                mie: getTotals(empresas.data.detalle, 'mie'),
                jue: getTotals(empresas.data.detalle, 'jue'),
                vie: getTotals(empresas.data.detalle, 'vie'),
                sab: getTotals(empresas.data.detalle, 'sab'),
                dom: getTotals(empresas.data.detalle, 'dom'),
                total: getTotals(empresas.data.detalle, 'total')
            }];
            const concatEmpresas = [...empresas.data.detalle, ...total];

            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const lun = empresas.data.detalle.reduce((acc, { lun }) => (acc.push(parseInt(lun)), acc), []);
            const mar = empresas.data.detalle.reduce((acc, { mar }) => (acc.push(parseInt(mar)), acc), []);
            const mie = empresas.data.detalle.reduce((acc, { mie }) => (acc.push(parseInt(mie)), acc), []);
            const jue = empresas.data.detalle.reduce((acc, { jue }) => (acc.push(parseInt(jue)), acc), []);
            const vie = empresas.data.detalle.reduce((acc, { vie }) => (acc.push(parseInt(vie)), acc), []);
            const sab = empresas.data.detalle.reduce((acc, { sab }) => (acc.push(parseInt(sab)), acc), []);
            const dom = empresas.data.detalle.reduce((acc, { dom }) => (acc.push(parseInt(dom)), acc), []);

            chartOptions.title.text = `Cantidad de unidades en geocerca, tramo / Día de la semana en las Empresas de Transporte del Sistema`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = lun;
            chartOptions.series[1].data = mar;
            chartOptions.series[2].data = mie;
            chartOptions.series[3].data = jue;
            chartOptions.series[4].data = vie;
            chartOptions.series[5].data = sab;
            chartOptions.series[6].data = dom;
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