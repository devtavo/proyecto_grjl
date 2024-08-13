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
                    tiempoAcuTransmisionGps: '' + vehiculos.data.resumen[0].tiempo
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
    const columnsDet =[
    {
        Header: `Tiempo Acumulado por los Vehículos durante la Prestación del Servicio de la ruta ${codigoRuta} de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
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
            },
            {
                Header: 'Tiempo acumulado transmisión de GPS (dias, horas, minutos)',
                accessor: 'tiempoAcuTransmisionGps',
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