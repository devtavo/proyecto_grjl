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
                    placa: '',
                    detencion: getTotals(vehiculos.data.detalle, 'detencion'),
                    noDetencion: getTotals(vehiculos.data.detalle, 'noDetencion') ,
                    porcNoDetencion: getTotals(vehiculos.data.detalle, 'porcNoDetencion') 
                               }];
            const concatRutas = [...vehiculos.data.detalle, ...total];

            const categories = vehiculos.data.detalle.reduce((acc, { placa }) => (acc.push(placa), acc), []);
            const detencion = vehiculos.data.detalle.reduce((acc, { detencion }) => (acc.push(parseInt(detencion)), acc), []);
            const noDetencion = vehiculos.data.detalle.reduce((acc, { noDetencion }) => (acc.push(parseInt(noDetencion)), acc), []);
            const porcNoDetencion = vehiculos.data.detalle.reduce((acc, { porcNoDetencion }) => (acc.push(parseInt(porcNoDetencion)), acc), []);

            chartOptions.title.text =  `Reporte de Vehículos que cumplen con kilómetros válidos para Subsidio, de la empresa ${razonSocial} de la ruta ${codigoRuta} desde el ${inicio} al ${final}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = detencion;
            chartOptions.series[1].data = noDetencion;
            chartOptions.series[2].data = porcNoDetencion;

            setVehiculos(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);
        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId]);

    const columnsDet = [
        {
            Header: `Porcentaje de excesos de velocidad en la ruta ${codigoRuta} de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    align: 'center'
                },
                {
                    Header: "Placa",
                    accessor: 'placa',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Excesos de velocidad en ruta',
                    accessor: 'detencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Excesos de velocidad fuerta de ruta',
                    accessor: 'noDetencion',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje de excesos fuera de ruta',
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