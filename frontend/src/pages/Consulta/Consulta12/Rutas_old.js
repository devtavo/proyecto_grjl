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
            const lun = rutas.data.reduce((acc, { lun }) => (acc.push(parseInt(lun)), acc), []);
            const mar = rutas.data.reduce((acc, { mar }) => (acc.push(parseInt(mar)), acc), []);
            const mie = rutas.data.reduce((acc, { mie }) => (acc.push(parseInt(mie)), acc), []);
            const jue = rutas.data.reduce((acc, { jue }) => (acc.push(parseInt(jue)), acc), []);
            const vie = rutas.data.reduce((acc, { vie }) => (acc.push(parseInt(vie)), acc), []);
            const sab = rutas.data.reduce((acc, { sab }) => (acc.push(parseInt(sab)), acc), []);
            const dom = rutas.data.reduce((acc, { dom }) => (acc.push(parseInt(dom)), acc), []);

            chartOptions.title.text = `Cantidad de vehículos por rango de velocidad x día x semana x tabla con baremos en las Rutas de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = lun;
            chartOptions.series[1].data = mar;
            chartOptions.series[2].data = mie;
            chartOptions.series[3].data = jue;
            chartOptions.series[4].data = vie;
            chartOptions.series[5].data = sab;
            chartOptions.series[6].data = dom;
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
            <BasicTable isExportable columns={columns} data={rutas} />

        </>
    );
}