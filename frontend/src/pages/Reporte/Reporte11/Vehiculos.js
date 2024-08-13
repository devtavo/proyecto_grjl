import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';

export default function Vehiculos({ reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ReporteService.getVehiculos(reporteId, empresaId, rutaId, inicio, final);
            const total =
                [{
                    id: 'Totales',
                    placa: '',
                    tiempoSinTransmisionGps: '' + vehiculos.data.resumen[0].tiempo
                }];
            const concatVehiculos = [...vehiculos.data.detalle, ...total];

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
                },
                {
                    Header: "Concepto",
                    accessor: "concepto",
                },
                {
                    Header: 'Tiempo sin GPS',
                    accessor: 'tiempo',
                },
            ],
            alignHeader: 'center'
        }];
    const columnsDet = [
        {
            Header: `Reporte del Tiempo sin transmisión de GPS en Operación del Servicio de la ruta ${codigoRuta}, de la empresa ${razonSocial}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Placa",
                    accessor: 'placa'

                },
                {
                    Header: 'Tiempo sin transmisión de GPS, en ambos sentidos (dias, horas, minutos)',
                    accessor: 'tiempoSinTransmisionGps',
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