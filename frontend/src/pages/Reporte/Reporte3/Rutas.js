import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import { getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, razonSocial, inicio, final, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId, inicio, final);
            const total =
                [{
                    id: '',
                    codigoRuta: 'Totales',
                    longitud: getTotals(rutas.data.detalle, 'longitud').toFixed(2),
                    nParadasRuta: getTotals(rutas.data.detalle, 'nParadasRuta'),
                    nViajesCompleto: getTotals(rutas.data.detalle, 'nViajesCompleto'),
                    vMediaRuta12: getPromedio(rutas.data.detalle, 'vMediaRuta12'),
                    vMediaRuta21: getPromedio(rutas.data.detalle, 'vMediaRuta21'),
                }];
            const concatRutas = [...rutas.data.detalle, ...total];
            rutas.data.resumen[0].kilometraje = getPromedio(rutas.data.detalle, 'vMediaRuta12')+' km/h';
            rutas.data.resumen[1].kilometraje = getPromedio(rutas.data.detalle, 'vMediaRuta21')+' km/h';
            rutas.data.resumen[2].kilometraje = parseInt((getPromedio(rutas.data.detalle, 'vMediaRuta12') + getPromedio(rutas.data.detalle, 'vMediaRuta21')) / 2)+' km/h';
            rutas.data.resumen[0].concepto = rutas.data.resumen[0].concepto;
            rutas.data.resumen[1].concepto = rutas.data.resumen[1].concepto;
            rutas.data.resumen[2].concepto = rutas.data.resumen[2].concepto;

            setRutas(concatRutas);
            setResumen(rutas.data.resumen);
            setEmpresas(concatRutas);

        };
        getRutas();
    }, [reporteId, empresaId, inicio, final]);

    const columnsRes = [{
        Header: `Tabla Resumen de la empresa ${razonSocial}`,
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
                Header: 'Kilometraje',
                accessor: 'kilometraje',
                alignHeader: 'center',
                alignBody:'center',
            },
        ],
        alignHeader: 'center',
    }];
    const columnsDet = [
        {
            Header: `Reporte de la Velocidad promedio de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
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
                                handleClickRuta(e, idRuta, inicio, final, codigoRuta,razonSocial)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                    accessor: 'codigoRuta'
                },
                {
                    Header: 'Longitud de la Ruta (Km)',
                    accessor: 'longitud',
                    alignBody: 'center',
                    alignHeader: 'center'

                },
                {
                    Header: 'Paraderos en Ruta',
                    accessor: 'nParadasRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes Completos',
                    accessor: 'nViajesCompleto',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad Media por Ruta 1→2',
                    accessor: 'vMediaRuta12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad Media por Ruta 2→1',
                    accessor: 'vMediaRuta21',
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
                // isExportable
                columns={columnsRes}
                data={resumen}
                pdfExport={{ columnsDet, columnsRes, empresas, resumen }}
            />
        </>
    );
}