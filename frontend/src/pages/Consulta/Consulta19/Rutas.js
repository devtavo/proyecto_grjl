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
                    cantidad: getTotals(rutas.data.detalle, 'cantidad'),
                    proAntiguedadServicio: getTotals(rutas.data.detalle, 'proAntiguedadServicio'),
                }];
            const concatRutas = [...rutas.data.detalle, ...total];

            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const cantidad = rutas.data.detalle.reduce((acc, { cantidad }) => (acc.push(parseInt(cantidad)), acc), []);
            const proAntiguedadServicio = rutas.data.detalle.reduce((acc, { proAntiguedadServicio }) => (acc.push(parseInt(proAntiguedadServicio)), acc), []);

            chartOptions.title.text = `Vehículos en servicio vs vehículos autorizados de la empresa ${razonSocial} `;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = cantidad;
            chartOptions.series[1].data = proAntiguedadServicio;
            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

        };
        getRutas();
    }, [consultaId, empresaId, inicio, final]);

    const columnsDet = [
        {
            Header: `ANTIGÜEDAD DE LOS VEHÍCULOS EN SERVICIO ${razonSocial}`,
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
                    Header: 'Cantidad Veh.',
                    accessor: 'cantidad',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Promedio (años)',
                    accessor: 'proAntiguedadServicio',
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