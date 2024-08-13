import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Vehiculos({ reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ReporteService.getVehiculos(reporteId, empresaId, rutaId, inicio, final);
            const total =
                [{
                    id: '',
                    placa: 'Totales',
                    totKmRecorridos: getTotals(vehiculos.data.detalle, 'totKmRecorridos'),
                    kmRecorridosFuera: getTotals(vehiculos.data.detalle, 'kmRecorridosFuera'),
                    porcTotal: getPromedio(vehiculos.data.detalle, 'porcTotal') + '.00 %'
                }];
            const concatVehiculos = [...vehiculos.data.detalle, ...total];
            vehiculos.data.resumen[0].kilometraje = getTotals(vehiculos.data.detalle, 'kmRecorridosFuera');
            vehiculos.data.resumen[0].porcentaje = getPromedio(vehiculos.data.detalle, 'porcTotal')+ '.00 %';

            setVehiculos(concatVehiculos);
            setEmpresas(concatVehiculos);
            setResumen(vehiculos.data.resumen);
        };
        getVehiculos();
    }, [reporteId, empresaId, rutaId, inicio, final]);

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
    ]
    const columnsDet = [
        {
            Header: `Reporte Kilómetros recorridos por Vehículos fuera de la Ruta y en horario del Servicio de la empresa ${razonSocial} en la ruta ${codigoRuta} desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Placa",
                    accessor: "placa",
                    alignBody: 'center',
                    alignHeader: 'center'
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
        }];

    return (
        <>
            <BasicTable
                props={`Reporte ${reporteId} - ${columnsDet[0].Header}`}
                isExportable
                isReporte
                columns={columnsDet}
                data={vehiculos}
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