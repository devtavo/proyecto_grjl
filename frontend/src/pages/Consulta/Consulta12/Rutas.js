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
                    vel0: getPromedio(rutas.data.detalle, 'vel0'),
                    vel130: getPromedio(rutas.data.detalle, 'vel130'),
                    vel3160: getPromedio(rutas.data.detalle, 'vel3160'),
                    vel6090: getPromedio(rutas.data.detalle, 'vel6090'),
                    velM90: getPromedio(rutas.data.detalle, 'velM90'),
                    total: getPromedio(rutas.data.detalle, 'total')

                }];
            const concatRutas = [...rutas.data.detalle, ...total];

            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const vel0 = rutas.data.detalle.reduce((acc, { vel0 }) => (acc.push(parseInt(vel0)), acc), []);
            const vel130 = rutas.data.detalle.reduce((acc, { vel130 }) => (acc.push(parseInt(vel130)), acc), []);
            const vel3160 = rutas.data.detalle.reduce((acc, { vel3160 }) => (acc.push(parseInt(vel3160)), acc), []);
            const vel6090 = rutas.data.detalle.reduce((acc, { vel6090 }) => (acc.push(parseInt(vel6090)), acc), []);
            const velM90 = rutas.data.detalle.reduce((acc, { velM90 }) => (acc.push(parseInt(velM90)), acc), []);

            chartOptions.title.text = `Cantidad momentos de vehículos por rango de velocidad x día x semana x tabla con baremos de la empresa ${razonSocial} desde el ${inicio} al ${final}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = vel0;
            chartOptions.series[1].data = vel130;
            chartOptions.series[2].data = vel3160;
            chartOptions.series[3].data = vel6090;
            chartOptions.series[4].data = velM90;
            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

            // setRutasOpt(rutas.data.chart);
        };
        getRutas();
    }, [consultaId, empresaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Cantidad momentos de vehículos por rango de velocidad x día x semana x tabla con baremos de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
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