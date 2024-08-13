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
                    id: '',
                    codigoRuta: 'Totales',
                    kmRecorridosGps: getTotals(rutas.data.detalle, 'kmRecorridosGps').toFixed(0),
                    kmRecorridosRuta: getTotals(rutas.data.detalle, 'kmRecorridosRuta'),
                    porcKmRecorridosRutaGps: getPromedio(rutas.data.detalle, 'porcKmRecorridosRutaGps').toFixed(2) + ' %',
                }];
            const concatRutas = [...rutas.data.detalle, ...total];
            rutas.data.resumen[0].kilometros = getTotals(rutas.data.detalle, 'kmRecorridosRuta')+' km/h';
            rutas.data.resumen[0].porcentaje = getPromedio(rutas.data.detalle, 'porcKmRecorridosRutaGps').toFixed(2) + ' %';

            setRutas(concatRutas);
            setResumen(rutas.data.resumen);
            setEmpresas(concatRutas);
        };
        getRutas();
    }, [reporteId, empresaId, inicio, final]);

    const columnsRes = [
        {
            Header: `Tabla Resumen de la empresa ${razonSocial}`,
            columns: [
                {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Kilometros',
                    accessor: 'kilometros',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ]
        }
    ];
    const columnsDet = [
        {
            Header: `Reporte de Kilómetros Recorridos por rutas de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: "Ruta",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idRuta, codigoRuta } = rutas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, idRuta, inicio, final, codigoRuta, razonSocial);
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                    accessor: 'codigoRuta'

                },
                {
                    Header: 'Kilómetros Recorridos según GPS',
                    accessor: 'kmRecorridosGps',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros Recorridos según Ruta',
                    accessor: 'kmRecorridosRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '%  de Km Recorridos Rutas vs. GPS',
                    accessor: 'porcKmRecorridosRutaGps',
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
                pdfExport={{ columnsDet, columnsRes, empresas, resumen,inicio, final }}
            />
            <br />
            <BasicTable
                columns={columnsRes}
                data={resumen}
                pdfExport={{ columnsDet, columnsRes, empresas, resumen }}
                inicio={inicio} final={final}
            />
        </>
    );
}