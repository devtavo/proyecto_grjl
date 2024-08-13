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
                    tiempoAcuTransmisionGps: '' + vehiculos.data.resumen[0].tiempo == 'null' ? '0 dias' : vehiculos.data.resumen[0].tiempo,
                    vehiculos: getTotals(vehiculos.data.detalle, 'vehiculos'),

                }];
            const concatRutas = [...vehiculos.data.detalle, ...total];

            const categories = vehiculos.data.detalle.reduce((acc, { placa }) => (acc.push(placa), acc), []);
            const vehiculo = vehiculos.data.detalle.reduce((acc, { vehiculos }) => (acc.push(parseInt(vehiculos)), acc), []);
            const tiempoAcuTransmisionGps = vehiculos.data.detalle.reduce((acc, { tiempoAcuTransmisionGps }) => (acc.push(parseInt(tiempoAcuTransmisionGps)), acc), []);

            chartOptions.title.text = `Promedio de tiempos de vehiculos en la ruta`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = tiempoAcuTransmisionGps;
            chartOptions.series[1].data = vehiculo;

            setVehiculos(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Promedio de tiempos De Recorrido Entre Paraderos Y Rutas Completadas Por Vehículo de la empresa ${razonSocial} desde el  ${inicio} al ${final}`,
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
                    Header: 'Promedio de tiempo de vehiculos en la ruta (días y horas)',
                    accessor: 'tiempoAcuTransmisionGps',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Cantidad de vehiculos',
                    accessor: 'vehiculos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
            <br />
            <CharBarra options={grafico} />
            <br />

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