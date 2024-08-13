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
                    placa: 'Totales',
                    lun: getTotals(vehiculos.data.detalle, 'lun'),
                    mar: getTotals(vehiculos.data.detalle, 'mar'),
                    mie: getTotals(vehiculos.data.detalle, 'mie'),
                    jue: getTotals(vehiculos.data.detalle, 'jue'),
                    vie: getTotals(vehiculos.data.detalle, 'vie'),
                    sab: getTotals(vehiculos.data.detalle, 'sab'),
                    dom: getTotals(vehiculos.data.detalle, 'dom'),
                    total: getTotals(vehiculos.data.detalle, 'total')
                    }];
            const concatRutas = [...vehiculos.data.detalle, ...total];

            const categories = vehiculos.data.detalle.reduce((acc, { placaVehiculo }) => (acc.push(placaVehiculo), acc), []);
            const lun = vehiculos.data.detalle.reduce((acc, { lun }) => (acc.push(parseInt(lun)), acc), []);
            const mar = vehiculos.data.detalle.reduce((acc, { mar }) => (acc.push(parseInt(mar)), acc), []);
            const mie = vehiculos.data.detalle.reduce((acc, { mie }) => (acc.push(parseInt(mie)), acc), []);
            const jue = vehiculos.data.detalle.reduce((acc, { jue }) => (acc.push(parseInt(jue)), acc), []);
            const vie = vehiculos.data.detalle.reduce((acc, { vie }) => (acc.push(parseInt(vie)), acc), []);
            const sab = vehiculos.data.detalle.reduce((acc, { sab }) => (acc.push(parseInt(sab)), acc), []);
            const dom = vehiculos.data.detalle.reduce((acc, { dom }) => (acc.push(parseInt(dom)), acc), []);

            chartOptions.title.text = `Cantidad de unidades en geocerca, tramo / Día de la semana en la ${codigoRuta} de la ${razonSocial}`;
            chartOptions.xAxis[0].categories = categories;
            chartOptions.series[0].data = lun;
            chartOptions.series[1].data = mar;
            chartOptions.series[2].data = mie;
            chartOptions.series[3].data = jue;
            chartOptions.series[4].data = vie;
            chartOptions.series[5].data = sab;
            chartOptions.series[6].data = dom;
            setVehiculos(concatRutas);
            setEmpresas(concatRutas);
            setGrafico(chartOptions);
        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId]);

    const columnsDet = [
        {
            Header: `Cantidad de unidades en geocerca, tramo / Día de la semana en la ${codigoRuta} de la ${razonSocial}`,
            columns: [
                {
                    Header: "Placa",
                    accessor: 'placa',
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