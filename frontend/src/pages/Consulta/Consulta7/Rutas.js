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
                    detencion: getTotals(rutas.data.detalle, 'detencion'),
                    noDetencion: getTotals(rutas.data.detalle, 'noDetencion'),              
                    porcNoDetencion: getPromedio(rutas.data.detalle, 'porcNoDetencion')      
                          }];
            const concatRutas = [...rutas.data.detalle, ...total];

            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const detencion = rutas.data.detalle.reduce((acc, { detencion }) => (acc.push(parseInt(detencion)), acc), []);
            const noDetencion = rutas.data.detalle.reduce((acc, { noDetencion }) => (acc.push(parseInt(noDetencion)), acc), []);
            const porcNoDetencion = rutas.data.detalle.reduce((acc, { porcNoDetencion }) => (acc.push(parseInt(porcNoDetencion)), acc), []);

            chartOptions.title.text = `Excesos de velocidad en las Empresas de Transporte del Sistema de la empresa ${razonSocial} desdel el ${inicio} al ${final}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = detencion;
            chartOptions.series[1].data = noDetencion;
            chartOptions.series[2].data = porcNoDetencion;

            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

            // setRutasOpt(rutas.data.chart);
        };
        getRutas();
    }, [consultaId, empresaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Porcentaje de excesos de velocidad en las Rutas de la ${razonSocial} desde el ${inicio} al ${final}`,
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
                    Header: 'Excesos de velocidad en ruta',
                    accessor: 'detencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Excesos de velocidad fuerta de ruta',
                    accessor: 'noDetencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje de excesos fuera de ruta',
                    accessor: 'porcNoDetencion',
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