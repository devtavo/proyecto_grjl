import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, inicio, final, razonSocial,handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId, inicio, final);
            const total =
            [{
                id: '',
                ruta: 'Totales',
                vAutorizados: getTotals(rutas.data.detalle, 'vAutorizados'),
                vConGps: getTotals(rutas.data.detalle, 'vConGps'),
                vSinGps: getTotals(rutas.data.detalle, 'vSinGps'),
                vServicioCGps: getTotals(rutas.data.detalle, 'vServicioCGps'),
                pVehiculosServicioCGps: getPromedio(rutas.data.detalle, 'pVehiculosServicioCGps')+'.00 %',
                // pVehiculosServicioCGPS: (parseInt(getTotals(empresas.data.detalle, 'vAutorizados')) / parseInt(getTotals(empresas.data.detalle, 'vServicioCGps')))
            }];
        const concatEmpresas = [...rutas.data.detalle, ...total];
        rutas.data.resumen[0].vehiculos = getTotals(rutas.data.detalle, 'vServicioCGps');
        rutas.data.resumen[0].porcentaje = getPromedio(rutas.data.detalle, 'pVehiculosServicioCGps')+'.00 %';

            setRutas(concatEmpresas);
            setEmpresas(concatEmpresas);
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

                },
                {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Vehiculos GPS',
                    accessor: 'vehiculos',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje',
                    align: 'center'
                },
            ]
        }
    ];

    const columnsDet = [
        {
            Header: `Reporte de Vehículos con GPS por Ruta de la empresa ${razonSocial} desde ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody:'center',
                },
                {
                    Header: "Ruta",
                    accessor: 'ruta',
                    alignHeader: 'center',
                    alignBody:'center',
                },
                {
                    Header: 'Vehículos Autorizados',
                    accessor: 'vAutorizados',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Vehículos con GPS',
                    accessor: 'vConGps',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Vehículos sin GPS',
                    accessor: 'vSinGps',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Vehículos en Servicio con GPS',
                    accessor: 'vServicioCGps',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% de Vehículos en Servicio con GPS',
                    accessor: 'pVehiculosServicioCGps',
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