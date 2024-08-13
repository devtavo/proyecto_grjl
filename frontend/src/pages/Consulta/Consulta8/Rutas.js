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
                    lun: getTotals(rutas.data.detalle, 'lun'),
                    mar: getTotals(rutas.data.detalle, 'mar'),
                    mie: getTotals(rutas.data.detalle, 'mie'),
                    jue: getTotals(rutas.data.detalle, 'jue'),
                    vie: getTotals(rutas.data.detalle, 'vie'),
                    sab: getTotals(rutas.data.detalle, 'sab'),
                    dom: getTotals(rutas.data.detalle, 'dom'),
                    total: getTotals(rutas.data.detalle, 'total')
                    }];
            const concatRutas = [...rutas.data.detalle, ...total];

            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const lun = rutas.data.detalle.reduce((acc, { lun }) => (acc.push(parseInt(lun)), acc), []);
            const mar = rutas.data.detalle.reduce((acc, { mar }) => (acc.push(parseInt(mar)), acc), []);
            const mie = rutas.data.detalle.reduce((acc, { mie }) => (acc.push(parseInt(mie)), acc), []);
            const jue = rutas.data.detalle.reduce((acc, { jue }) => (acc.push(parseInt(jue)), acc), []);
            const vie = rutas.data.detalle.reduce((acc, { vie }) => (acc.push(parseInt(vie)), acc), []);
            const sab = rutas.data.detalle.reduce((acc, { sab }) => (acc.push(parseInt(sab)), acc), []);
            const dom = rutas.data.detalle.reduce((acc, { dom }) => (acc.push(parseInt(dom)), acc), []);

            chartOptions.title.text = `Cantidad de unidades en geocerca, tramo / Día de la semana en las Empresas de Transporte del Sistema de la empresa ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = lun;
            chartOptions.series[1].data = mar;
            chartOptions.series[2].data = mie;
            chartOptions.series[3].data = jue;
            chartOptions.series[4].data = vie;
            chartOptions.series[5].data = sab;
            chartOptions.series[6].data = dom;

            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

            // setRutasOpt(rutas.data.chart);
        };
        getRutas();
    }, [consultaId, empresaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Cantidad de unidades en geocerca, tramo / Día de la semana en las Rutas de la ${razonSocial}`,
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