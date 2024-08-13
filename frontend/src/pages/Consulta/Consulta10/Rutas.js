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
            const rutas = await ConsultaService.getRutas(consultaId, empresaId,inicio,final);

            const total =
            [{
                id: 'Totales',
                idRuta: '',
                codigoRuta: '',
                detencion: getTotals(rutas.data.detalle, 'detencion'),
                noDetencion: getTotals(rutas.data.detalle, 'noDetencion'),
                porcNoDetencion: getPromedio(rutas.data.detalle, 'porcNoDetencion') + '%'
            }];

            const concatRutas = [...rutas.data.detalle, ...total];
            
            const categories = rutas.data.detalle.reduce((acc, { codigoRuta }) => (acc.push(codigoRuta), acc), []);
            const detencion = rutas.data.detalle.reduce((acc, { detencion }) => (acc.push(parseInt(detencion)), acc), []);
            const noDetencion = rutas.data.detalle.reduce((acc, { noDetencion }) => (acc.push(parseInt(noDetencion)), acc), []);
            const porcNoDetencion = rutas.data.detalle.reduce((acc, { porcNoDetencion }) => (acc.push(parseInt(porcNoDetencion)), acc), []);
            
            chartOptions.title.text = `Porcentaje de No Detenciones en Paraderos en las Rutas de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = detencion;
            chartOptions.series[1].data = noDetencion;
            chartOptions.series[2].data = porcNoDetencion;

            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);
        };
        getRutas();
    }, [consultaId, empresaId,inicio, final]);

    const columnsDet = [
        {
            Header: `Porcentaje de No Detenciones en Paraderos en las Rutas de la ${razonSocial}`,
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
                    Header: 'Total Paraderos',
                    accessor: 'detencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'No Detención en Paraderos',
                    accessor: 'noDetencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje de No Detenciones en Paraderos',
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