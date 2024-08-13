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
            const lun = vehiculos.data.reduce((acc, { lun }) => (acc.push(parseInt(lun)), acc), []);
            const mar = vehiculos.data.reduce((acc, { mar }) => (acc.push(parseInt(mar)), acc), []);
            const mie = vehiculos.data.reduce((acc, { mie }) => (acc.push(parseInt(mie)), acc), []);
            const jue = vehiculos.data.reduce((acc, { jue }) => (acc.push(parseInt(jue)), acc), []);
            const vie = vehiculos.data.reduce((acc, { vie }) => (acc.push(parseInt(vie)), acc), []);
            const sab = vehiculos.data.reduce((acc, { sab }) => (acc.push(parseInt(sab)), acc), []);
            const dom = vehiculos.data.reduce((acc, { dom }) => (acc.push(parseInt(dom)), acc), []);

            chartOptions.title.text = `Cantidad de vehículos por rango de velocidad x día x semana x tabla con baremos en la ${rutaGlosa} de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = lun;
            chartOptions.series[1].data = mar;
            chartOptions.series[2].data = mie;
            chartOptions.series[3].data = jue;
            chartOptions.series[4].data = vie;
            chartOptions.series[5].data = sab;
            chartOptions.series[6].data = dom;
            setVehiculos(vehiculos.data);
            setGrafico(chartOptions);
        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId]);

    const columns = [
        {
            Header: `Cantidad de vehículos por rango de velocidad x día x semana x tabla con baremos en la ${rutaGlosa} de la ${razonSocial}`,
            columns: [
                {
                    Header: "Placa",
                    accessor: 'placaVehiculo',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Lunes',
                    accessor: 'lun',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Martes',
                    accessor: 'mar',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Miércoles',
                    accessor: 'mie',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Jueves',
                    accessor: 'jue',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viernes',
                    accessor: 'vie',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Sábado',
                    accessor: 'sab',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Domingo',
                    accessor: 'dom',
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