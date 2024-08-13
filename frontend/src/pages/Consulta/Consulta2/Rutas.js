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
                    vServicio: getTotals(rutas.data.detalle, 'vServicio'),
                    vAutorizados: getTotals(rutas.data.detalle, 'vAutorizados')
                }];
            const concatRutas = [...rutas.data.detalle, ...total];

            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const vServicio = rutas.data.detalle.reduce((acc, { vServicio }) => (acc.push(parseInt(vServicio)), acc), []);
            const vAutorizados = rutas.data.detalle.reduce((acc, { vAutorizados }) => (acc.push(parseInt(vAutorizados)), acc), []);

            chartOptions.title.text = `Vehículos en servicio vs vehículos autorizados de la empresa ${razonSocial} desde el ${inicio} al ${final}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = vServicio;
            chartOptions.series[1].data = vAutorizados;
            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

            // setRutasOpt(rutas.data.chart);
        };
        getRutas();
    }, [consultaId, empresaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Vehículos en servicio vs vehículos autorizados de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    align: 'center'
                },
                {
                    Header: 'Codigo Ruta',
                    accessor: 'codigoRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Vehiculos Servicio',
                    accessor: 'vServicio',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Vehículos autorizados',
                    accessor: 'vAutorizados',
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