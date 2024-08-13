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
                    codigoRuta: '',
                    totKmRecorridos: getTotals(rutas.data.detalle, 'totKmRecorridos'),
                    kmRecorridosFuera: getTotals(rutas.data.detalle, 'kmRecorridosFuera'),
                    porcTotal: getPromedio(rutas.data.detalle, 'porcTotal') + '%'
                }];
            const concatRutas = [...rutas.data.detalle, ...total];

            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const totKmRecorridos = rutas.data.detalle.reduce((acc, { totKmRecorridos }) => (acc.push(parseInt(totKmRecorridos)), acc), []);
            const kmRecorridosFuera = rutas.data.detalle.reduce((acc, { kmRecorridosFuera }) => (acc.push(parseInt(kmRecorridosFuera)), acc), []);
            const porcTotal = rutas.data.detalle.reduce((acc, { porcTotal }) => (acc.push(parseInt(porcTotal)), acc), []);

            chartOptions.title.text = `Kilómetros recorridos y fuera de ruta en las rutas de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = totKmRecorridos;
            chartOptions.series[1].data = kmRecorridosFuera;
            chartOptions.series[2].data = porcTotal;
            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);
        };
        getRutas();
    }, [consultaId, empresaId]);

    const columnsDet = [
        {
            Header: `Kilómetros recorridos y fuera de ruta en las rutas de la ${razonSocial}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    align: 'center'
                },
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
                    Header: 'Kilómetros recorridos en Ruta',
                    accessor: 'totKmRecorridos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros recorridos fuera de Ruta',
                    accessor: 'kmRecorridosFuera',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje de Kilómetros Recorridos fuera de Ruta',
                    accessor: 'porcTotal',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
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