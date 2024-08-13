import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import CharBarra from '../../../components/Charts/ChartBarra';
import { options } from './Empresas';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Vehiculos({ consultaId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculosOpt, setVehiculosOpt] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [grafico, setGrafico] = useState({ ...options });


    useEffect(() => {
        const getVehiculos = async () => {
            const chartOptions = { ...options };
            const vehiculos = await ConsultaService.getVehiculos(consultaId, empresaId, rutaId, inicio, final);
            const total =
                [{
                    id: 'Totales',
                    placa: '',
                    totKmRecorridos: getTotals(vehiculos.data.detalle, 'totKmRecorridos'),
                    pagoSubsidio: getTotals(vehiculos.data.detalle, 'pagoSubsidio')                }];
            const concatRutas = [...vehiculos.data.detalle, ...total];

            const categories = vehiculos.data.detalle.reduce((acc, { placa }) => (acc.push(placa), acc), []);
            const totKmRecorridos = vehiculos.data.detalle.reduce((acc, { totKmRecorridos }) => (acc.push(parseInt(totKmRecorridos)), acc), []);
            const pagoSubsidio = vehiculos.data.detalle.reduce((acc, { pagoSubsidio }) => (acc.push(parseInt(pagoSubsidio)), acc), []);

            chartOptions.title.text =  `Reporte de Vehículos que cumplen con kilómetros válidos para Subsidio, de la empresa ${razonSocial} de la ruta ${codigoRuta} desde el ${inicio} al ${final}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = totKmRecorridos;
            chartOptions.series[1].data = pagoSubsidio;

            setVehiculos(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId]);

    const columnsDet = [
        {
            Header: `Reporte de Vehículos que cumplen con kilómetros válidos para Subsidio, de la empresa ${razonSocial} de la ruta ${codigoRuta} desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    align: 'center'
                },
                {
                    Header: "Placa",
                    accessor: 'placa',
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
                }  
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
            <CharBarra options={grafico} />
            <BasicTable
                props={`Consulta ${consultaId} - ${columnsDet[0].Header}`}
                isExportable
                isConsulta
                data={vehiculos}
                columns={columnsDet}
                pdfExport={{ columnsDet, empresas }}
                inicio={inicio} final={final}
            />

        </>
    );
}