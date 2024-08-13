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
        text: 'Tiempos de recorrido entre paraderos y rutas completadas por unidad'
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
            const vehiculos = empresas.data.reduce((acc, { vehiculos }) => (acc.push(parseInt(vehiculos)), acc), []);

            chartOptions.title.text = `Tiempos de recorrido entre paraderos y rutas completadas por unidad`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = vehiculos;
            setEmpresas(empresas.data);
            setGrafico(chartOptions);
        };
        getEmpresas();
    }, [consultaId]);

    const columnsDet = [
        {
            Header: 'Tiempos de recorrido entre paraderos y rutas completadas por unidad',
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
            <BasicTable isExportable columns={columnsDet} data={empresas} />
        </>
    );
}