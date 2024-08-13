import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Link from '@mui/material/Link';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { options } from './Empresas';

export default function Rutas({ consultaId, empresaId, razonSocial, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [grafico, setGrafico] = useState({ ...options });

    useEffect(() => {
        const getRutas = async () => {
            const chartOptions = { ...options };
            const rutas = await ConsultaService.get(consultaId, `ettId=${empresaId}`);
            const categories = rutas.data.reduce((acc, { glosaRuta }) => (acc.push(glosaRuta), acc), []);
            const veh = rutas.data.reduce((acc, { cantVehiculos }) => (acc.push(parseInt(cantVehiculos)), acc), []);

            chartOptions.title.text = `Cantidad de vehículos por rango de velocidad x día x semana x tabla con baremos en las Rutas de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = veh;
            setRutas(rutas.data);
            setGrafico(chartOptions);
        };
        getRutas();
    }, [consultaId, empresaId]);

    const columns = [
        {
            Header: `Cantidad de vehículos por rango de velocidad x día x semana x tabla con baremos en las Rutas de la ${razonSocial}`,
            columns: [
                {
                    Header: "Ruta",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idRuta, glosaRuta } = rutas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, idRuta, glosaRuta)
                            }}>
                                {glosaRuta}
                            </Link>
                        );
                    },
                    align: 'center'
                },
                {
                    Header: 'Vehículos',
                    accessor: 'cantVehiculos',
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
            <BasicTable isExportable columns={columns} data={rutas} />

        </>
    );
}