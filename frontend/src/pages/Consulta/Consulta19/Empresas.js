import { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import CharBarra from '../../../components/Charts/ChartBarra';
import * as React from 'react';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';
import Highcharts from 'highcharts';
const today = new Date();


export const options = {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Antigüedad de vehículos en servicio'
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
            name: 'Cantidad Vehiculo',
            type: 'spline',
            data: [],
            tooltip: {
                valueSuffix: ' '
            }
        },
        {
            name: 'Promedio',
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
                    cantidad: getTotals(empresas.data.detalle, 'cantidad'),
                    proAntiguedadServicio: getTotals(empresas.data.detalle, 'proAntiguedadServicio')
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];

            const categories = empresas.data.detalle.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const cantidad = empresas.data.detalle.reduce((acc, { cantidad }) => (acc.push(parseInt(cantidad)), acc), []);
            const proAntiguedadServicio = empresas.data.detalle.reduce((acc, { proAntiguedadServicio }) => (acc.push(parseInt(proAntiguedadServicio)), acc), []);

            chartOptions.title.text = `Antigüedad de vehículos de la empresa`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = cantidad;
            chartOptions.series[1].data = proAntiguedadServicio;

            setEmpresas(concatEmpresas);
            setEmpresaOpt(empresas.data.chart);
            setGrafico(chartOptions);
        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDet = [
        {
            Header: 'ANTIGÜEDAD DE LOS VEHÍCULOS DE LAS EMPRESAS',
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
                    Header: 'Cantidad de Veh.',
                    accessor: 'cantidad',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Promedio(Años)',
                    accessor: 'proAntiguedadServicio',
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

    return (
        <>
            <CharBarra options={grafico} />

            <BasicTable
                props={`Consulta ${consultaId} - ${columnsDet[0].Header}`}
                isExportable
                isConsulta
                columns={columnsDet}
                data={empresas}
                pdfExport={{ columnsDet, empresas }}
                inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')} />
        </>);
}