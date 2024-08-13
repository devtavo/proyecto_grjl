import { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const options = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Cantidad de vehículos por geo carca, ruta, empresa, rango de fecha'
    },
    xAxis: [{
        categories: [],
        crosshair: true
    }],
    series: [{
        name: 'Vehículos',
        data: []
    }]
}

export default function Empresas({ consultaId, handleClickEmpresa }) {
    const [empresas, setEmpresas] = useState([]);
    const [grafico, setGrafico] = useState(options);

    useEffect(() => {
        const getEmpresas = async () => {
            const chartOptions = { ...options };
            const empresas = await ConsultaService.get(consultaId);
            const categories = empresas.data.reduce((acc, { razonSocialEmpresa }) => (acc.push(razonSocialEmpresa), acc), []);
            const veh = empresas.data.reduce((acc, { cantVehiculos }) => (acc.push(parseInt(cantVehiculos)), acc), []);

            chartOptions.title.text = `Cantidad de vehículos por geo carca, ruta, empresa, rango de fecha`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = veh;
            setEmpresas(empresas.data);
            setGrafico(chartOptions);
        };
        getEmpresas();
    }, [consultaId]);

    const columnsDet = [
        {
            Header: 'Cantidad de vehículos por geo carca, ruta, empresa, rango de fecha',
            columns: [
                {
                    Header: "Empresa",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idEtt, razonSocialEmpresa } = empresas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickEmpresa(e, idEtt, razonSocialEmpresa)
                            }}>
                                {razonSocialEmpresa}
                            </Link>
                        );
                    }
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
            <BasicTable isExportable columns={columnsDet} data={empresas} />
        </>
    );
}