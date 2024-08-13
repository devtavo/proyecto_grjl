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
                    kmRecorridos: getTotals(vehiculos.data.detalle, 'kmRecorridos'),
                    porcTotal: getPromedio(vehiculos.data.detalle, 'porcTotal') + '%'
                }];
            const concatRutas = [...vehiculos.data.detalle, ...total];

            const categories = vehiculos.data.detalle.reduce((acc, { placa }) => (acc.push(placa), acc), []);
            const kmRecorridos = vehiculos.data.detalle.reduce((acc, { kmRecorridos }) => (acc.push(parseInt(kmRecorridos)), acc), []);
            const porcTotal = vehiculos.data.detalle.reduce((acc, { porcTotal }) => (acc.push(parseInt(porcTotal)), acc), []);

            chartOptions.title.text = `CANTIDAD DE KILÓMETROS RECORRIDOS POR LOS VEHÍCULOS EN SERVICIO DE LA RUTA ${codigoRuta} DE LA EMPRESA ${razonSocial} desde el ${inicio} al ${final}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = kmRecorridos;
            chartOptions.series[1].data = porcTotal;

            setVehiculos(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId, inicio, final]);

    const columnsDet = [
        {
            Header: `CANTIDAD DE KILÓMETROS RECORRIDOS POR LOS VEHÍCULOS EN SERVICIO  DE LA RUTA ${codigoRuta} DE LA EMPRESA ${razonSocial} DESDEL EL ${inicio} al ${final}`,
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
                    Header: 'Kilómetros Recorridos',
                    accessor: 'kmRecorridos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje del Total',
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