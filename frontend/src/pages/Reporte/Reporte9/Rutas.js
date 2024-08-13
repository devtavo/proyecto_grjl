import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, inicio, final,razonSocial,handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [subsidio, setSubsidio] = useState([]);

    useEffect(() => {
        const getSubsidio = async () => {
            const subsidio = await ReporteService.getSubsidio();
            setSubsidio(subsidio.data);
        }
        getSubsidio();
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId,inicio, final);
            const total =
                [{
                    id: 'Totales',
                    codigoRuta: '',
                    totKmRecorridos: getTotals(rutas.data.detalle, 'totKmRecorridos').toFixed(0),
                    pagoSubsidio: getTotals(rutas.data.detalle, 'pagoSubsidio').toFixed(0)  
                }];
            const concatRutas = [...rutas.data.detalle, ...total];
            rutas.data.resumen[0].importe = getTotals(rutas.data.detalle, 'totKmRecorridos').toFixed(0)+' km/h';
            rutas.data.resumen[0].subsidio = 'S/.'+getTotals(rutas.data.detalle, 'pagoSubsidio').toFixed(0);

            setRutas(concatRutas);
            setEmpresas(concatRutas);
            setResumen(rutas.data.resumen);
        };
        getRutas();
    }, [reporteId, empresaId,inicio, final]);
    const columnsSubsidio = [
        {
            Header: 'Tabla Subsidio',
            columns: [
                {
                    Header: '#',
                    accessor: 'idTipoVehiculo',
                    alignHeader: 'center',
                    alignBody: 'center'

                },
                {
                    Header: 'Nombre tipo',
                    accessor: 'nombreTipo',
                },
                {
                    Header: 'Tipo',
                    accessor: 'glosa',
                },
                {
                    Header: 'Subsidio S/.',
                    accessor: 'pagoKm',
                },
            ]
        }
    ];
    const columnsRes=[
        {
            Header: `Tabla Resumen de la empresa ${razonSocial}`,
            columns: [
                {
                    Header: 'Concepto',
                    accessor: 'concepto',
                }, 
                {
                    Header: 'Km. Válidos para Subsidio',
                    accessor: 'importe',
                },
                {
                    Header: 'Pago Subsidio',
                    accessor: 'subsidio',
                },
            ]
        }
    ];
    const columnsDet = [
        {
            Header: `Reporte de Vehículos que cumplen con kilómetros válidos para Subsidio de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
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
                    Header: 'Total Kilómetros Recorridos válidos para Subsidio',
                    accessor: 'totKmRecorridos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Pago de Subsidio (S/)',
                    accessor: 'pagoSubsidio',
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

            />
            <br />
            <BasicTable
                // isExportable
                columns={columnsSubsidio}
                data={subsidio}
            />
        </>
    );
}