import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import Navigation from '../../../components/Navigation/Navigation';
import Breadcrumb from '../../../components/Navigation/Breadcrumb';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import { getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId,razonSocial, inicio, final, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId, inicio, final);
            const total =
                [{
                    id: '',
                    // idRuta: '',
                    codigoRuta: 'Totales',
                    buses: getTotals(rutas.data.detalle, 'buses'),
                    salidas12: getTotals(rutas.data.detalle, 'salidas12'),
                    viajesIncompletos12: getTotals(rutas.data.detalle, 'viajesIncompletos12'),
                    viajesCompletos12: getTotals(rutas.data.detalle, 'viajesCompletos12'),
                    salidas21: getTotals(rutas.data.detalle, 'salidas21'),
                    viajesIncompletos21: getTotals(rutas.data.detalle, 'viajesIncompletos21'),
                    viajesCompletos21: getTotals(rutas.data.detalle, 'viajesCompletos21'),
                    porcViajesCompletos12: getPromedio(rutas.data.detalle, 'porcViajesCompletos12') + '%',
                    porcViajesCompletos21: getPromedio(rutas.data.detalle, 'porcViajesCompletos21') + '%',
                }];

            const concatRutas = [...rutas.data.detalle, ...total];
            rutas.data.resumen[0].concepto = rutas.data.resumen[0].concepto ;
            rutas.data.resumen[1].concepto = rutas.data.resumen[1].concepto ;
            rutas.data.resumen[2].concepto = rutas.data.resumen[2].concepto ;

            rutas.data.resumen[0].completos = getTotals(rutas.data.detalle, 'viajesCompletos12');
            rutas.data.resumen[1].completos = getTotals(rutas.data.detalle, 'viajesCompletos21');
            rutas.data.resumen[2].completos = parseInt((getTotals(rutas.data.detalle, 'viajesCompletos12') + getTotals(rutas.data.detalle, 'viajesCompletos21')) / 2);
            rutas.data.resumen[0].porcentaje = getPromedio(rutas.data.detalle, 'porcViajesCompletos12') + '%';
            rutas.data.resumen[1].porcentaje = getPromedio(rutas.data.detalle, 'porcViajesCompletos21') + '%';
            rutas.data.resumen[2].porcentaje = parseInt((getPromedio(rutas.data.detalle, 'porcViajesCompletos12') + getPromedio(rutas.data.detalle, 'porcViajesCompletos21')) / 2 )+ '%';

            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setResumen(rutas.data.resumen);
        };
        getRutas();
    }, [reporteId, empresaId, inicio, final]);
    const columnsRes = [
        {
            Header: `Tabla Resumen de "${razonSocial}"`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody:'center',

                }, {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Viajes Completos',
                    accessor: 'completos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center',
        }
    ];
    const columnsDet = [
        {
            Header: `Reporte de Viajes por Ruta de ${razonSocial} del ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader:'center',
                    alignBody:'center'
                },
                {
                    Header: "Ruta",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idRuta, codigoRuta } = rutas[rowIdx];
                        console.log(idRuta);
                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, idRuta, inicio, final, codigoRuta,razonSocial)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                   accessor: 'codigoRuta'
                },
                {
                    Header: 'Buses',
                    accessor: 'buses',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Salidas 1→2',
                    accessor: 'salidas12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes incompletos 1→2',
                    accessor: 'viajesIncompletos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes completos 1→2',
                    accessor: 'viajesCompletos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Salidas 2→1',
                    accessor: 'salidas21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes incompletos 2→1',
                    accessor: 'viajesIncompletos21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes completos 2→1',
                    accessor: 'viajesCompletos21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% Viajes completos 1→2',
                    accessor: 'porcViajesCompletos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% Viajes completos 2→1',
                    accessor: 'porcViajesCompletos21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center',
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
                pdfExport={{ columnsDet, columnsRes, empresas, resumen,inicio,final }}
            />           
           <br />
            <BasicTable
                // isExportable
                columns={columnsRes}
                data={resumen}
                pdfExport={{ columnsDet, columnsRes, empresas, resumen }}
            />
        </>
    );
}