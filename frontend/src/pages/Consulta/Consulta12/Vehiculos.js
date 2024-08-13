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
                    vel0: getPromedio(vehiculos.data.detalle, 'vel0'),
                    vel130: getPromedio(vehiculos.data.detalle, 'vel130'),
                    vel3160: getPromedio(vehiculos.data.detalle, 'vel3160'),
                    vel6090: getPromedio(vehiculos.data.detalle, 'vel6090'),
                    velM90: getPromedio(vehiculos.data.detalle, 'velM90'),
                    total: getPromedio(vehiculos.data.detalle, 'total')
                }];
            const concatRutas = [...vehiculos.data.detalle, ...total];

            const categories = vehiculos.data.detalle.reduce((acc, { placa }) => (acc.push(placa), acc), []);
            const vel0 = vehiculos.data.detalle.reduce((acc, { vel0 }) => (acc.push(parseInt(vel0)), acc), []);
            const vel130 = vehiculos.data.detalle.reduce((acc, { vel130 }) => (acc.push(parseInt(vel130)), acc), []);
            const vel3160 = vehiculos.data.detalle.reduce((acc, { vel3160 }) => (acc.push(parseInt(vel3160)), acc), []);
            const vel6090 = vehiculos.data.detalle.reduce((acc, { vel6090 }) => (acc.push(parseInt(vel6090)), acc), []);
            const velM90 = vehiculos.data.detalle.reduce((acc, { velM90 }) => (acc.push(parseInt(velM90)), acc), []);

            chartOptions.title.text = `Cantidad momentos de vehículos por rango de velocidad x día x semana x tabla con baremos, ${codigoRuta} DE LA EMPRESA ${razonSocial} desde el ${inicio} al ${final}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = vel0;
            chartOptions.series[1].data = vel130;
            chartOptions.series[2].data = vel3160;
            chartOptions.series[3].data = vel6090;
            chartOptions.series[4].data = velM90;

            setVehiculos(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);

        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Cantidad momentos de vehículos por rango de velocidad x día x semana x tabla con baremos de la ruta  ${codigoRuta} de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
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
                    Header: 'Velocidad igual a 0',
                    accessor: 'vel0',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad entre 1 y 30',
                    accessor: 'vel130',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad entre 31 y 60',
                    accessor: 'vel3160',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad entre 60 y 90',
                    accessor: 'vel6090',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad mayor a 90',
                    accessor: 'velM90',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Total ',
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