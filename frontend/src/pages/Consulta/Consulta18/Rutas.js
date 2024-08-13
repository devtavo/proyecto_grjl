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
                    tiempoAcuTransmisionGps: '' + rutas.data.resumen[0].tiempo == 'null' ? '0 dias' : rutas.data.resumen[0].tiempo
                }];
            const concatRutas = [...rutas.data.detalle, ...total];

            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const tiempoAcuTransmisionGps = rutas.data.detalle.reduce((acc, { tiempoAcuTransmisionGps }) => (acc.push(parseInt(tiempoAcuTransmisionGps)), acc), []);
 

            chartOptions.title.text = `Tiempos de vehiculos en la ruta`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = tiempoAcuTransmisionGps;
            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

            // setRutasOpt(rutas.data.chart);
        };
        getRutas();
    }, [consultaId, empresaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Tiempos de vehiculos en la ruta de la empresa ${razonSocial}`,
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
                    Header: 'Total Tiempo de vehiculos en la ruta (días y horas)',
                    accessor: 'tiempoAcuTransmisionGps',
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