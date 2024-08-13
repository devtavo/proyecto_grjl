import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ReporteService.getVehiculos(reporteId, empresaId, rutaId, inicio, final);
            const total =
                [{
                    id: '',
                    codigoRuta: 'Totales',
                    kmRecorridosGps: getTotals(vehiculos.data.detalle, 'kmRecorridosGps').toFixed(0),
                    kmRecorridosRuta: getTotals(vehiculos.data.detalle, 'kmRecorridosRuta'),
                    porcKmRecorridosRutaGps: getPromedio(vehiculos.data.detalle, 'porcKmRecorridosRutaGps').toFixed(2) + ' %',
                }];
            const concatVehiculos = [...vehiculos.data.detalle, ...total];
            vehiculos.data.resumen[0].kilometros = getTotals(vehiculos.data.detalle, 'kmRecorridosRuta') + ' Km/h';
            vehiculos.data.resumen[0].porcentaje = getPromedio(vehiculos.data.detalle, 'porcKmRecorridosRutaGps').toFixed(2) + ' %';

            setVehiculos(concatVehiculos);
            setEmpresas(concatVehiculos);
            setResumen(vehiculos.data.resumen);
            // setEmpresas(concatVehiculos);
        };
        getVehiculos();
    }, [reporteId, empresaId, rutaId, inicio, final]);

    const columnsRes = [
        {
            Header: `Tabla Resumen de la ruta ${codigoRuta} de la empresa ${razonSocial}`,
            columns: [
                {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Kilometraje',
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
            Header: `Reporte de Kilómetros Recorridos por Vehículos de la ruta ${codigoRuta} de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: "Placa",
                    accessor: "placa",
                    alignHeader: 'center',
                    alignBody: 'center',
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
                    Header: '% Km Recorridos Rutas vs. GPS',
                    accessor: 'porcKmRecorridosRutaGps',
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
                isReporte
                columns={columnsRes}
                data={resumen}
            />
        </>
    );
}