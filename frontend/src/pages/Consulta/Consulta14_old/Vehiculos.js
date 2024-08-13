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
            const veh = vehiculos.data.reduce((acc, { transmisiones }) => (acc.push(parseInt(transmisiones)), acc), []);

            chartOptions.title.text = `Tiempos de recorrido entre paraderos y rutas completadas por unidad en la ${rutaGlosa} de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = veh;
            setVehiculos(vehiculos.data);
            setGrafico(chartOptions);
        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId]);

    const columns = [
        {
            Header: `Tiempos de recorrido entre paraderos y rutas completadas por unidad en la ${rutaGlosa} de la ${razonSocial}`,
            columns: [
                {
                    Header: "Placa",
                    accessor: 'placaVehiculo',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Fec. de inicio',
                    accessor: 'desde',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Fec. de fin',
                    accessor: 'hasta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Tiempo entre fechas',
                    accessor: 'tiempo',
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
            <div style={{ marginTop: 80 }}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={grafico}
                />
            </div>
            <BasicTable isExportable columns={columns} data={vehiculos} />
        </>
    );
}