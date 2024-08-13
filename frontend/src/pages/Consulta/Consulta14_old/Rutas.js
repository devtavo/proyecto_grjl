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
            const vehiculos = rutas.data.reduce((acc, { vehiculos }) => (acc.push(parseInt(vehiculos)), acc), []);

            chartOptions.title.text = `Tiempos de recorrido entre paraderos y rutas completadas por unidad en las Rutas de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = vehiculos;
            setRutas(rutas.data);
            setGrafico(chartOptions);
        };
        getRutas();
    }, [consultaId, empresaId]);

    const columns = [
        {
            Header: `Tiempos de recorrido entre paraderos y rutas completadas por unidad en las Rutas de la ${razonSocial}`,
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
            <div style={{ marginTop: 80 }}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={grafico}
                />
            </div>
            <BasicTable isExportable columns={columns} data={rutas} />

        </>
    );
}