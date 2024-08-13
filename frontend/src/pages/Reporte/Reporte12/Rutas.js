import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';

export default function Rutas({ reporteId, empresaId, inicio, final, razonSocial, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId,inicio, final);
            const total =
                [{
                    id: 'Totales',
                    idRuta: '',
                    codigoRuta: '',
                    tiempoAcuTransmisionGps: '' + rutas.data.resumen[0].tiempo
                }];
            const concatRutas = [...rutas.data.detalle, ...total];

            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setResumen(rutas.data.resumen);
        };
        getRutas();
    }, [reporteId, empresaId,inicio, final]);

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
                    Header: 'Tiempo Acumulado',
                    accessor: 'tiempo',
                },
            ]
        }
    ];
    const columnsDet = [
        {
            Header: `Tiempo Acumulado por los Vehículos durante la Prestación del Servicio de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
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
                                handleClickRuta(e, idRuta, inicio, final, codigoRuta, razonSocial)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                    accessor: 'codigoRuta'

                },
                {
                    Header: 'Total Tiempo Acumulado en la Operación del Servicio (días y horas)',
                    accessor: 'tiempoAcuTransmisionGps',
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