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
                codigoRuta: 'Totales',
                h06: getTotals(vehiculos.data.detalle, 'h06'),
                h713: getTotals(vehiculos.data.detalle, 'h713'),
                h1420: getTotals(vehiculos.data.detalle, 'h1420'),
                h2123: getTotals(vehiculos.data.detalle, 'h2123'),
                total: getTotals(vehiculos.data.detalle, 'total'),
            }];
            const concatVehiculos = [...vehiculos.data.detalle, ...total];

            const categories = vehiculos.data.detalle.reduce((acc, { placaVehiculo }) => (acc.push(placaVehiculo), acc), []);
            const h06 = vehiculos.data.detalle.reduce((acc, { h06 }) => (acc.push(parseInt(h06)), acc), []);
            const h713 = vehiculos.data.detalle.reduce((acc, { h713 }) => (acc.push(parseInt(h713)), acc), []);
            const h1420 = vehiculos.data.detalle.reduce((acc, { h1420 }) => (acc.push(parseInt(h1420)), acc), []);
            const h2123 = vehiculos.data.detalle.reduce((acc, { h2123 }) => (acc.push(parseInt(h2123)), acc), []);

            chartOptions.title.text = `Momentos de unidades en geocerca, tramo / Hora de la semana en la ${codigoRuta} de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = h06;
            chartOptions.series[1].data = h713;
            chartOptions.series[2].data = h1420;
            chartOptions.series[3].data = h2123;
            setVehiculos(concatVehiculos);
            setEmpresas(concatVehiculos);
            setGrafico(chartOptions);
        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId]);

    const columnsDet = [
        {
            Header: `Momentos de unidades en geocerca, tramo / Día de la semana en la ${codigoRuta} de la ${razonSocial}`,
            columns: [
                {
                    Header: "Placa",
                    accessor: 'placaVehiculo',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '00:00 - 06:00',
                    accessor: 'h06',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '07:00 - 13:00',
                    accessor: 'h713',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '14:00 - 20:00',
                    accessor: 'h1420',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '21:00-23:00',
                    accessor: 'h2123',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Total vehículos',
                    accessor: 'total',
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