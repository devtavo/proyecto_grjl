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
            const detencion = vehiculos.data.detalle.reduce((acc, { detencion }) => (acc.push(parseInt(detencion)), acc), []);
            const noDetencion = vehiculos.data.detalle.reduce((acc, { noDetencion }) => (acc.push(parseInt(noDetencion)), acc), []);
            const porcNoDetencion = vehiculos.data.detalle.reduce((acc, { porcNoDetencion }) => (acc.push(parseInt(porcNoDetencion)), acc), []);

            chartOptions.title.text = `Porcentaje de No Detenciones en Paraderos en la ${codigoRuta} de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = detencion;
            chartOptions.series[1].data = noDetencion;
            chartOptions.series[2].data = porcNoDetencion;
            
            setVehiculos(concatVehiculos);
            setEmpresas(concatVehiculos);
            setGrafico(chartOptions);
        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId]);

    const columnsDet = [
        {
            Header: `Porcentaje de No Detenciones en Paraderos en la ${codigoRuta} de la ${razonSocial}`,
            columns: [
                {
                    Header: "Placa",
                    accessor: 'placaVehiculo',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Total Paraderos',
                    accessor: 'detencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'No Detención en Paraderos',
                    accessor: 'noDetencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje de No Detenciones en Paraderos',
                    accessor: 'porcNoDetencion',
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