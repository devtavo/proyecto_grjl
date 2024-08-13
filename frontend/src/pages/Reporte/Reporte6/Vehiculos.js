import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {
    const [vehiculos12, setVehiculos12] = useState([]);
    const [vehiculos21, setVehiculos21] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ReporteService.getVehiculos(reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial);
            const total12 =
                [{
                    id: 'Totales',
                    placa: '',
                    nCompletosEtt: getTotals(vehiculos.data.sentido12, 'nCompletosEtt'),
                    nIncompletosEtt: getTotals(vehiculos.data.sentido12, 'nIncompletosEtt'),
                    kmRecorridosCompletos12: getTotals(vehiculos.data.sentido12, 'kmRecorridosCompletos12').toFixed(2),
                    kmRecorridosIncompletos12: getTotals(vehiculos.data.sentido12, 'kmRecorridosIncompletos12').toFixed(2),
                    totalKmRecorridosS12: getTotals(vehiculos.data.sentido12, 'totalKmRecorridosS12').toFixed(2)
                }];
            const concatVehiculos12 = [...vehiculos.data.sentido12, ...total12];
            const total21 =
                [{
                    id: 'Totales',
                    placa: '',
                    nCompletosEtt: getTotals(vehiculos.data.sentido21, 'nCompletosEtt'),
                    nIncompletosEtt: getTotals(vehiculos.data.sentido21, 'nIncompletosEtt'),
                    kmRecorridosCompletos21: getTotals(vehiculos.data.sentido21, 'kmRecorridosCompletos21').toFixed(2),
                    kmRecorridosIncompletos21: getTotals(vehiculos.data.sentido21, 'kmRecorridosIncompletos21').toFixed(2),
                    totalKmRecorridosS21: getTotals(vehiculos.data.sentido21, 'totalKmRecorridosS21').toFixed(2)
                }];
            const concatVehiculos21 = [...vehiculos.data.sentido21, ...total21];
            vehiculos.data.resumen[0].kilometraje = getTotals(vehiculos.data.sentido12, 'totalKmRecorridosS12') + ' km/h';
            vehiculos.data.resumen[1].kilometraje = getTotals(vehiculos.data.sentido21, 'totalKmRecorridosS21') + ' km/h';
            vehiculos.data.resumen[2].kilometraje = (getTotals(vehiculos.data.sentido12, 'totalKmRecorridosS12') + getTotals(vehiculos.data.sentido21, 'totalKmRecorridosS21')) + ' km/h';

            setVehiculos12(concatVehiculos12);
            setVehiculos21(concatVehiculos21);
            setResumen(vehiculos.data.resumen);
        };
        getVehiculos();
    }, [reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial]);

    const columnsRes = [
        {
            Header: `Tabla Resumen de la empresa ${razonSocial}`,
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
            Header: `Detalle Ruta 1 Sentido 1-2 de la ruta ${codigoRuta} de la empresa ${razonSocial} desde el ${inicio} al ${final} en sentido 1-2`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Placa",
                    accessor: "placa",
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
        }];

    const columnsDet21 = [
        {
            Header: `Detalle Ruta 1 Sentido 2-1 de la ruta ${codigoRuta} de la empresa ${razonSocial} desde el ${inicio} al ${final} en sentido 2-1`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Placa",
                    accessor: "placa",
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
        }];
    return (
        <>
            <BasicTable
                props={`Reporte ${reporteId} - ${columnsDet12[0].Header}`}
                isExportable
                isReporte
                isVehiculo
                columns={columnsDet12}
                data={vehiculos12}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen, inicio, final }}
            />
            <br />

            <BasicTable
                isReporte
                isVehiculo
                columns={columnsDet21}
                data={vehiculos21}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen, inicio, final }}
            />
            <br />
            <BasicTable

                columns={columnsRes}
                data={resumen}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen, inicio, final }}

            />
        </>
    );
}