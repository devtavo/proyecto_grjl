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
                    kmRecorridosFuera: getTotals(vehiculos.data.detalle, 'kmRecorridosFuera'),
                    porcTotal: getPromedio(vehiculos.data.detalle, 'porcTotal') + '%'
                }];
            const concatRutas = [...vehiculos.data.detalle, ...total];

            const categories = vehiculos.data.detalle.reduce((acc, { placa }) => (acc.push(placa), acc), []);
            const totKmRecorridos = vehiculos.data.detalle.reduce((acc, { totKmRecorridos }) => (acc.push(parseInt(totKmRecorridos)), acc), []);
            const kmRecorridosFuera = vehiculos.data.detalle.reduce((acc, { kmRecorridosFuera }) => (acc.push(parseInt(kmRecorridosFuera)), acc), []);
            const porcTotal = vehiculos.data.detalle.reduce((acc, { porcTotal }) => (acc.push(parseInt(porcTotal)), acc), []);

            chartOptions.title.text = `Kilómetros recorridos y fuera de ruta por los vehículos de la ${codigoRuta} en las rutas de la ${razonSocial} desde el ${inicio} al ${final}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = totKmRecorridos;
            chartOptions.series[1].data = kmRecorridosFuera;
            chartOptions.series[2].data = porcTotal;
            
            setVehiculos(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Kilómetros recorridos y fuera de ruta por los vehículos de la ${codigoRuta} en las rutas de la ${razonSocial}`,
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
                    Header: 'Kilómetros recorridos en Ruta',
                    accessor: 'totKmRecorridos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros recorridos fuera de Ruta',
                    accessor: 'kmRecorridosFuera',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje de Kilómetros Recorridos fuera de Ruta',
                    accessor: 'porcTotal',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
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