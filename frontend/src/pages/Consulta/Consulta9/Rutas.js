import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Link from '@mui/material/Link';
import CharBarra from '../../../components/Charts/ChartBarra';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

import { options } from './Empresas';

export default function Rutas({ consultaId, empresaId, razonSocial, inicio, final, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [grafico, setGrafico] = useState({ ...options });

    useEffect(() => {
        const getRutas = async () => {
            const chartOptions = { ...options };
            const rutas = await ConsultaService.getRutas(consultaId, empresaId, inicio, final);
            const total =
            [{
                id: 'Totales',
                codigoRuta: 'Totales',
                h06: getTotals(rutas.data.detalle, 'h06'),
                h713: getTotals(rutas.data.detalle, 'h713'),
                h1420: getTotals(rutas.data.detalle, 'h1420'),
                h2123: getTotals(rutas.data.detalle, 'h2123'),
                total: getTotals(rutas.data.detalle, 'total'),
            }];
            const concatRutas = [...rutas.data.detalle, ...total];

            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const h06 = rutas.data.detalle.reduce((acc, { h06 }) => (acc.push(parseInt(h06)), acc), []);
            const h713 = rutas.data.detalle.reduce((acc, { h713 }) => (acc.push(parseInt(h713)), acc), []);
            const h1420 = rutas.data.detalle.reduce((acc, { h1420 }) => (acc.push(parseInt(h1420)), acc), []);
            const h2123 = rutas.data.detalle.reduce((acc, { h2123 }) => (acc.push(parseInt(h2123)), acc), []);

            chartOptions.title.text = `Momentos de unidades en geocerca, tramo / Hora de la semana en las Empresas de Transporte del Sistema`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = h06;
            chartOptions.series[1].data = h713;
            chartOptions.series[2].data = h1420;
            chartOptions.series[3].data = h2123;

            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);
        };
        getRutas();
    }, [consultaId, empresaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Momentos de unidades en geocerca, tramo / Hora de la semana en las Rutas de la ${razonSocial}`,
            columns: [
                {
                    Header: "Ruta",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idRuta, codigoRuta } = rutas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, idRuta, inicio, final, codigoRuta, razonSocial)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                    accessor: 'codigoRuta',
                    align: 'center'
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
                    Header: 'Total vehículos',
                    accessor: 'total',
                    alignBody: 'center',
                    alignHeader: 'center'
                }
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
            <br />
            <CharBarra options={grafico} />
            <br />

            <BasicTable
                props={`Consulta ${consultaId} - ${columnsDet[0].Header}`}
                isExportable
                isConsulta
                columns={columnsDet}
                pdfExport={{ columnsDet, empresas }}
                data={rutas}
                inicio={inicio} final={final}
            />
        </>
    );
}