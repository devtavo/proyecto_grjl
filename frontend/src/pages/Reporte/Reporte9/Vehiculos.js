import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Vehiculos({ reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [subsidio, setSubsidio] = useState([]);

    useEffect(() => {
        const getSubsidio = async () => {
        const subsidio = await ReporteService.getSubsidio();
        setSubsidio(subsidio.data);
    }
    getSubsidio();
        const getVehiculos = async () => {
            const vehiculos = await ReporteService.getVehiculos(reporteId, empresaId, rutaId, inicio, final);
            const total =
                [{
                    id: '',
                    placa: 'Totales',
                    tipoVehiculo:'',
                    subsidioKm:'',
                    totKmRecorridos: getTotals(vehiculos.data.detalle, 'totKmRecorridos').toFixed(0),
                    pagoSubsidio: getTotals(vehiculos.data.detalle, 'pagoSubsidio').toFixed(0)
                }];
            const concatVehiculos = [...vehiculos.data.detalle, ...total];
            vehiculos.data.resumen[0].importe = getTotals(vehiculos.data.detalle, 'totKmRecorridos').toFixed(0) + ' km/h';
            vehiculos.data.resumen[0].subsidio = 'S/.' + getTotals(vehiculos.data.detalle, 'pagoSubsidio').toFixed(0);

            setVehiculos(concatVehiculos);
            setEmpresas(concatVehiculos);
            setResumen(vehiculos.data.resumen);
        };
        getVehiculos();
    }, [reporteId, empresaId, rutaId, inicio, final]);
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
    const columnsRes = [
        {
            Header: 'Tabla Resumen',
            columns: [
                {
                    Header:'#',
                    accessor: 'id'
                },
                {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Km. Válidos para Subsidio',
                    accessor: 'importe',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Pago Subsidio',
                    accessor: 'subsidio',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ]
        }
    ]
    const columnsDet = [
        {
            Header: `Reporte de Vehículos que cumplen con kilómetros válidos para Subsidio de la ruta ${codigoRuta} de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
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
                    align: 'center'
                },
                {
                    Header: 'Tipo Vehículo',
                    accessor: 'tipoVehiculo',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Subsidio por km (S/)',
                    accessor: 'subsidioKm',
                    alignBody: 'center',
                    alignHeader: 'center'
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

            /><br />
            <BasicTable
                // isExportable
                columns={columnsSubsidio}
                data={subsidio}
            />
        </>
    );
}