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
                    idRuta: '',
                    codigoRuta: '',
                    vAutorizados: getTotals(rutas.data.sentido_1_2, 'vAutorizados'),
                    longitudRutas: getTotals(rutas.data.sentido_1_2, 'longitudRutas'),
                    nCompletosEtt: getTotals(rutas.data.sentido_1_2, 'nCompletosEtt'),
                    nIncompletosEtt: getTotals(rutas.data.sentido_1_2, 'nIncompletosEtt'),
                    kmRecorridosCompletos12: getTotals(rutas.data.sentido_1_2, 'kmRecorridosCompletos12'),
                    kmRecorridosIncompletos12: getTotals(rutas.data.sentido_1_2, 'kmRecorridosIncompletos12'),
                    totalKmRecorridosS12: getTotals(rutas.data.sentido_1_2, 'kmRecorridosCompletos12')+getTotals(rutas.data.sentido_1_2, 'kmRecorridosIncompletos12')
                }];
            const concatRutas12 = [...rutas.data.sentido_1_2, ...total12];
            const total21 =
                [{
                    id: 'Totales',
                    idEtt: '',
                    razonSocialEmpresa: '',
                    vAutorizados: getTotals(rutas.data.sentido_2_1, 'vAutorizados'),
                    longitudRutas: getTotals(rutas.data.sentido_2_1, 'longitudRutas'),
                    nCompletosEtt: getTotals(rutas.data.sentido_2_1, 'nCompletosEtt'),
                    nIncompletosEtt: getTotals(rutas.data.sentido_2_1, 'nIncompletosEtt'),
                    kmRecorridosCompletos21: getTotals(rutas.data.sentido_2_1, 'kmRecorridosCompletos21'),
                    kmRecorridosIncompletos21: getTotals(rutas.data.sentido_2_1, 'kmRecorridosIncompletos21'),
                    totalKmRecorridosS21: getTotals(rutas.data.sentido_2_1, 'kmRecorridosCompletos21')+getTotals(rutas.data.sentido_2_1, 'kmRecorridosIncompletos21')
                }];
            const concatRutas21 = [...rutas.data.sentido_2_1, ...total21];
            rutas.data.resumen[0].kilometraje = getTotals(rutas.data.sentido_1_2, 'kmRecorridosCompletos12')+getTotals(rutas.data.sentido_1_2, 'kmRecorridosIncompletos12')+' km/h';
            rutas.data.resumen[1].kilometraje = getTotals(rutas.data.sentido_2_1, 'kmRecorridosCompletos21')+getTotals(rutas.data.sentido_2_1, 'kmRecorridosIncompletos21')+' km/h';
            rutas.data.resumen[2].kilometraje = (getTotals(rutas.data.sentido_1_2, 'kmRecorridosCompletos12')+getTotals(rutas.data.sentido_1_2, 'kmRecorridosIncompletos12') + getTotals(rutas.data.sentido_2_1, 'kmRecorridosCompletos21')+getTotals(rutas.data.sentido_2_1, 'kmRecorridosIncompletos21') ) + ' km/h';

            setVehiculos12(concatRutas12);
            setVehiculos21(concatRutas21);
            setRutas12(concatRutas12);
            setRutas21(concatRutas21);
            setResumen(rutas.data.resumen);

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
                    alignHeader: 'center',
                    alignBody: 'center'

                }, {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Kilometraje',
                    accessor: 'kilometraje',
                    alignHeader: 'center',
                    alignBody: 'center'
                },
            ],
            alignHeader: 'center',
        }
    ];
    const columnsDet12 = [
        {
            Header: `Reporte de los Kilómetros recorridos por los Vehículos durante la prestación del Servicio en las Rutas de una Empresa ${razonSocial} desdel el ${inicio} al ${final} en sentido 1-2`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Ruta",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idRuta, codigoRuta } = rutas12[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, idRuta, inicio, final, codigoRuta, razonSocial)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                    accessor: 'codigoRuta'
                },
                {
                    Header: 'Buses Autorizados',
                    accessor: 'vAutorizados',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Longitud de las Rutas (km)',
                    accessor: 'longitudRutas',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° Viajes completos de la EETT',
                    accessor: 'nCompletosEtt',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° Viajes incompletos de la EETT',
                    accessor: 'nIncompletosEtt',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros Recorridos completos de la EETT',
                    accessor: 'kmRecorridosCompletos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros Recorridos incompletos de la EETT',
                    accessor: 'kmRecorridosIncompletos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Total Kilómetros Recorridos Sentido 1-2',
                    accessor: 'totalKmRecorridosS12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center'
        },
    ];
    const columnsDet21 = [
        {
            Header: `Reporte de los Kilómetros recorridos por los Vehículos durante la prestación del Servicio en las Rutas de una Empresa ${razonSocial} desdel el ${inicio} al ${final} en sentido 2-1`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Ruta",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idRuta, codigoRuta } = rutas21[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, idRuta, inicio, final, codigoRuta, razonSocial)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                },
                {
                    Header: 'Buses Autorizados',
                    accessor: 'vAutorizados',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Longitud de las Rutas (km)',
                    accessor: 'longitudRutas',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° Viajes completos de la EETT',
                    accessor: 'nCompletosEtt',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'N° Viajes incompletos de la EETT',
                    accessor: 'nIncompletosEtt',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros Recorridos completos de la EETT',
                    accessor: 'kmRecorridosCompletos21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros Recorridos incompletos de la EETT',
                    accessor: 'kmRecorridosIncompletos21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Total Kilómetros Recorridos Sentido 2-1',
                    accessor: 'totalKmRecorridosS21',
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
                pdfExport={{ columnsDet21, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen, inicio, final }}
            />
            <br />
            <BasicTable
                columns={columnsRes}
                data={resumen}
            />
        </>
    );
}