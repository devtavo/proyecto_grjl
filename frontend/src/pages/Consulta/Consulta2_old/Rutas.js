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
                    idEtt: '',
                    razonSocialEmpresa: '',
                    cantidad: getTotals(rutas.data.detalle, 'cantidad'),
                    kmRecorridos: getTotals(rutas.data.detalle, 'kmRecorridos'),
                    porcTotal: getPromedio(rutas.data.detalle, 'porcTotal') + '%'
                }];
            const concatRutas = [...rutas.data.detalle, ...total];

            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const cantidad = rutas.data.detalle.reduce((acc, { cantidad }) => (acc.push(parseInt(cantidad)), acc), []);
            const kmRecorridos = rutas.data.detalle.reduce((acc, { kmRecorridos }) => (acc.push(parseInt(kmRecorridos)), acc), []);
            const porcTotal = rutas.data.detalle.reduce((acc, { porcTotal }) => (acc.push(parseInt(porcTotal)), acc), []);

            chartOptions.title.text = `KILÓMETROS RECORRIDOS POR LOS VEHÍCULOS EN SERVICIO DE LA EMPRESA ${razonSocial} desde el ${inicio} al ${final}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[2].data = cantidad;
            chartOptions.series[0].data = kmRecorridos;
            chartOptions.series[1].data = porcTotal;
            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

            // setRutasOpt(rutas.data.chart);
        };
        getRutas();
    }, [consultaId, empresaId, inicio, final]);

    const columnsDet = [
        {
            Header: `KILÓMETROS RECORRIDOS POR LOS VEHÍCULOS EN SERVICIO DE LA EMPRESA ${razonSocial} desde el ${inicio} al ${final}`,
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
                    align: 'center'
                },
                {
                    Header: 'Cantidad',
                    accessor: 'cantidad',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros Recorridos',
                    accessor: 'kmRecorridos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje del Total',
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