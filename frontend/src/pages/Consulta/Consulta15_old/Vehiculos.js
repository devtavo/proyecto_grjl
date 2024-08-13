import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { options } from './Empresas';

export default function Rutas({ consultaId, empresaId, razonSocial, rutaId, rutaGlosa, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [grafico, setGrafico] = useState(options);

    useEffect(() => {
        const getVehiculos = async () => {
            const chartOptions = { ...options };
            const vehiculos = await ConsultaService.get(consultaId, `ettId=${empresaId}&rutaId=${rutaId}`);
            const categories = vehiculos.data.reduce((acc, { placaVehiculo }) => (acc.push(placaVehiculo), acc), []);
            const tiempoPromedio = vehiculos.data.reduce((acc, { tiempoPromedio }) => (acc.push(parseInt(tiempoPromedio)), acc), []);

            chartOptions.title.text = `Promedio de recorrido entre paraderos y rutas completadas por unidad en la ${rutaGlosa} de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = tiempoPromedio;
            setVehiculos(vehiculos.data);
            setGrafico(chartOptions);
        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId]);

    const columns = [
        {
            Header: `Promedio de recorrido entre paraderos y rutas completadas por unidad en la ${rutaGlosa} de la ${razonSocial}`,
            columns: [
                {
                    Header: "Placa",
                    accessor: 'placaVehiculo',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Tiempo promedio',
                    accessor: 'tiempoPromedio',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Vehículos',
                    accessor: 'vehiculos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Transmisiones',
                    accessor: 'transmisiones',
                    alignBody: 'center',
                    alignHeader: 'center'
                }
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={grafico}
                />
            </div>
            <BasicTable isExportable columns={columns} data={vehiculos} />
        </>
    );
}