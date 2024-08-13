import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, inicio, final, razonSocial, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId, inicio, final);
            const total =
                [{
                    id: 'Totales',
                    idRuta: '',
                    codigoRuta: '',
                    busesAutorizados: getTotals(rutas.data.detalle, 'busesAutorizados'),
                    busesEnServ12: getTotals(rutas.data.detalle, 'busesEnServ12'),
                    busesEnServ21: getTotals(rutas.data.detalle, 'busesEnServ21'),
                    porcTransmision12: getPromedio(rutas.data.detalle, 'porcTransmision12') + '.00 %',
                    porcTransmision21: getPromedio(rutas.data.detalle, 'porcTransmision21') + '.00 %',
                }];
            const concatRutas = [...rutas.data.detalle, ...total];
            rutas.data.resumen[0].porcentaje = getPromedio(rutas.data.detalle, 'porcTransmision12') + '.00 %';
            rutas.data.resumen[1].porcentaje = getPromedio(rutas.data.detalle, 'porcTransmision21') + '.00 %';
            rutas.data.resumen[2].porcentaje = (getPromedio(rutas.data.detalle, 'porcTransmision12') + getPromedio(rutas.data.detalle, 'porcTransmision21')) / 2 + '%';

            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setResumen(rutas.data.resumen);
        };
        getRutas();
    }, [reporteId, empresaId, inicio, final]);

    const columnsRes = [
        {
            Header: `Tabla Resumen de ${razonSocial}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody: 'center',

                },{
                    Header: 'Concepto',
                    accessor: 'concepto'
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje'
                },
            ]
        }
    ];
    const columnsDet = [
        {
            Header: `Reporte del Estado de Transmisión del GPS por Ruta de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
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
                                handleClickRuta(e, idRuta, inicio, final,codigoRuta)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                    accessor: 'codigoRuta'
                },
                {
                    Header: 'Buses Autorizados (al dìa)',
                    accessor: 'busesAutorizados',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Buses en Servicio Sentido 1-2',
                    accessor: 'busesEnServ12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Buses en Servicio Sentido 2-1',
                    accessor: 'busesEnServ21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% de Transmisión del GPS por minuto Sentido 1-2',
                    accessor: 'porcTransmision12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% de Transmisión del GPS por minuto Sentido 2-1',
                    accessor: 'porcTransmision21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center'
        },
    ];

    return (
        <>
            <BasicTable
            props={`Reporte ${reporteId} - ${columnsDet[0].Header}`}
                isExportable
                isReporte
                columns={columnsDet}
                data={rutas}
                pdfExport={{ columnsDet, columnsRes, empresas, resumen ,inicio,final}}
         
                sizePro='small' />
            <br />
            <BasicTable
            isReporte
                columns={columnsRes}
                data={resumen}
                pdfExport={{ columnsDet, columnsRes, empresas, resumen }}

            />
        </>
    );
}