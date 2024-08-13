import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, inicio,final,razonSocial, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId, inicio, final);
            const total =
                [{
                    id: 'Totales',
                    codigoRuta: '',
                    totKmRecorridos: getTotals(rutas.data.detalle, 'totKmRecorridos'),
                    kmRecorridosFuera: getTotals(rutas.data.detalle, 'kmRecorridosFuera'),
                    porcTotal: getPromedio(rutas.data.detalle, 'porcTotal') + '.00 %'
                }];
            const concatRutas = [...rutas.data.detalle, ...total];
            rutas.data.resumen[0].kilometraje = getTotals(rutas.data.detalle, 'kmRecorridosFuera');
            rutas.data.resumen[0].porcentaje = getPromedio(rutas.data.detalle, 'porcTotal')+ '.00 %';

            setRutas(concatRutas);
            setEmpresas(concatRutas);
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
                    alignBody: 'center',
                    alignHeader: 'center'

                }, {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Kilometraje fuera de Ruta',
                    accessor: 'kilometraje',
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje',
                }
            ]
        }
    ];
    const columnsDet = [
        {
            Header: `Reporte Kilómetros recorridos por Vehículos fuera de la Ruta y en horario del Servicio  de la empresa ${razonSocial}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Ruta",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idRuta, codigoRuta } = rutas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, idRuta,inicio, final,codigoRuta,razonSocial)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                    accessor: 'codigoRuta'

                },
                {
                    Header: 'Total Kilómetros Recorridos',
                    accessor: 'totKmRecorridos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros Recorridos fuera de Ruta (según GPS)',
                    accessor: 'kmRecorridosFuera',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% Km Recorridos Fuera de Ruta según GPS',
                    accessor: 'porcTotal',
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
                pdfExport={{ columnsDet, columnsRes, empresas, resumen, inicio, final }}

            />
            <br />
            <BasicTable
                columns={columnsRes}
                data={resumen}
                pdfExport={{ columnsDet, columnsRes, empresas, resumen }}

            />
        </>
    );
}