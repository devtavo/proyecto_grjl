import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, inicio, final, razonSocial, handleClickRuta }) {
    const [rutas12, setRutas12] = useState([]);
    const [rutas21, setRutas21] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [vehiculos12, setVehiculos12] = useState([]);
    const [vehiculos21, setVehiculos21] = useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId, inicio, final);
            const total12 =
                [{
                    id: 'Totales',
                    codigoRuta: '',
                    vAutorizados: getTotals(rutas.data.sentido_1_2, 'vAutorizados'),
                    longitudRutas: getTotals(rutas.data.sentido_1_2, 'longitudRutas'),
                    nParaderosRuta: getTotals(rutas.data.sentido_1_2, 'nParaderosRuta'),
                    nViajesDetenciones100: getTotals(rutas.data.sentido_1_2, 'nViajesDetenciones100'),
                    nViajesDetencionesInc: getTotals(rutas.data.sentido_1_2, 'nViajesDetencionesInc'),
                    nDetencionesNoRealizadasParaderos: getTotals(rutas.data.sentido_1_2, 'nDetencionesNoRealizadasParaderos'),
                    porcViajesDetencionesParaderos12: getPromedio(rutas.data.sentido_1_2, 'porcViajesDetencionesParaderos12')+' %'
                }];
            const concatRutas12 = [...rutas.data.sentido_1_2, ...total12];
            const total21 =
                [{
                    id: 'Totales',
                    codigoRuta: '',
                    vAutorizados: getTotals(rutas.data.sentido_2_1, 'vAutorizados'),
                    longitudRutas: getTotals(rutas.data.sentido_2_1, 'longitudRutas'),
                    nParaderosRuta: getTotals(rutas.data.sentido_2_1, 'nParaderosRuta'),
                    nViajesDetenciones100: getTotals(rutas.data.sentido_2_1, 'nViajesDetenciones100'),
                    nViajesDetencionesInc: getTotals(rutas.data.sentido_2_1, 'nViajesDetencionesInc'),
                    nDetencionesNoRealizadasParaderos: getTotals(rutas.data.sentido_2_1, 'nDetencionesNoRealizadasParaderos'),
                    porcViajesDetencionesParaderos21: getPromedio(rutas.data.sentido_2_1, 'porcViajesDetencionesParaderos21')+' %'
                }];
            const concatRutas21 = [...rutas.data.sentido_2_1, ...total21];
            rutas.data.resumen[0].detenciones = getTotals(rutas.data.sentido_1_2, 'nDetencionesNoRealizadasParaderos');
            rutas.data.resumen[1].detenciones = getTotals(rutas.data.sentido_2_1, 'nDetencionesNoRealizadasParaderos');
            rutas.data.resumen[2].detenciones = (getTotals(rutas.data.sentido_1_2, 'nDetencionesNoRealizadasParaderos') + getTotals(rutas.data.sentido_2_1, 'nDetencionesNoRealizadasParaderos')) / 2;

            rutas.data.resumen[0].porcentaje = getPromedio(rutas.data.sentido_1_2, 'porcViajesDetencionesParaderos12')+' %';
            rutas.data.resumen[1].porcentaje = getPromedio(rutas.data.sentido_2_1, 'porcViajesDetencionesParaderos21') +' %';
            rutas.data.resumen[2].porcentaje = ((getPromedio(rutas.data.sentido_1_2, 'porcViajesDetencionesParaderos12') + getPromedio(rutas.data.sentido_2_1, 'porcViajesDetencionesParaderos21')) / 2)+' %';

            setRutas12(concatRutas12);
            setRutas21(concatRutas21);
            setVehiculos12(concatRutas12);
            setVehiculos21(concatRutas21);

            setResumen(rutas.data.resumen)
        };
        getRutas();
    }, [reporteId, empresaId, inicio, final]);
    const columnsRes = [
        {
            Header: 'Tabla Resumen',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader:'center',
                    alignBody:'center',

                }, {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Detenciones',
                    accessor: 'detenciones',
                    alignHeader:'center',
                    alignBody:'center',
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje',
                    alignHeader:'center',
                    alignBody:'center',
                },
            ]
        }
    ];
    const columnsDet12 = [
        {
            Header: `Reporte del Cumplimiento de Detención de Vehículos en Paraderos en las Empresas ${razonSocial} desdel el ${inicio} al ${final} en sentido 1-2`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Ruta",
                    accessor: 'codigoRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° Buses Autorizados',
                    accessor: 'vAutorizados',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Longitud de la Ruta (km)',
                    accessor: 'longitudRutas',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° de Paraderos en Ruta',
                    accessor: 'nParaderosRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° de Viajes con Detenciones al 100%',
                    accessor: 'nViajesDetenciones100',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° de Detenciones No Realizadas en Paraderos',
                    accessor: 'nViajesDetencionesInc',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° de Detenciones Realizadas en Paraderos ',
                    accessor: 'nDetencionesNoRealizadasParaderos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '%  de Detenciones de Vehículos en Paraderos ',
                    accessor: 'porcViajesDetencionesParaderos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center'
        },
    ];
    const columnsDet21 = [
        {
            Header: `Reporte del Cumplimiento de Detención de Vehículos en Paraderos en las Empresas ${razonSocial} desdel el ${inicio} al ${final} en sentido 2-1`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Ruta",
                    accessor: 'codigoRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° Buses Autorizados',
                    accessor: 'vAutorizados',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Longitud de la Ruta (km)',
                    accessor: 'longitudRutas',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° de Paraderos en Ruta',
                    accessor: 'nParaderosRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° de Viajes con Detenciones al 100%',
                    accessor: 'nViajesDetenciones100',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° de Detenciones No Realizadas en Paraderos',
                    accessor: 'nViajesDetencionesInc',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° de Detenciones Realizadas en Paraderos ',
                    accessor: 'nDetencionesNoRealizadasParaderos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '%  de Detenciones de Vehículos en Paraderos ',
                    accessor: 'porcViajesDetencionesParaderos21',
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
                props={`Reporte ${reporteId} - ${columnsDet12[0].Header}`}
                isExportable
                isReporte
                isVehiculo
                columns={columnsDet12}
                data={rutas12}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen, inicio, final }}
            />
            <br />
            <BasicTable
                isReporte
                isVehiculo
                columns={columnsDet21}
                data={rutas21}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen, inicio, final }}
            />
            <br />
            <BasicTable
                columns={columnsRes}
                data={resumen}
            />
        </>
    );
}