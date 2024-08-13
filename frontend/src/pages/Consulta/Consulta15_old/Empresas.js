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
        text: 'Promedio de recorrido entre paraderos y rutas completadas por unidad'
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
            const tiempoPromedio = empresas.data.reduce((acc, { tiempoPromedio }) => (acc.push(parseInt(tiempoPromedio)), acc), []);

            chartOptions.title.text = `Promedio de recorrido entre paraderos y rutas completadas por unidad`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = tiempoPromedio;
            setEmpresas(empresas.data);
            setGrafico(chartOptions);
        };
        getEmpresas();
    }, [consultaId]);

    const columnsDet = [
        {
            Header: 'Promedio de recorrido entre paraderos y rutas completadas por unidad',
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
            <BasicTable isExportable columns={columnsDet} data={empresas} />
        </>
    );
}