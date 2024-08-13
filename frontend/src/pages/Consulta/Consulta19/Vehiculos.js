import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import CharBarra from '../../../components/Charts/ChartBarra';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';

export default function Vehiculos({ consultaId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculosOpt, setVehiculosOpt] = useState([]);
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ConsultaService.getVehiculos(consultaId, empresaId, rutaId, inicio, final);
            const total =
                [{
                    id: 'Totales',
                    placa: '',
                    proAntiguedadServicio: getPromedio(vehiculos.data.detalle, 'proAntiguedadServicio'),
                }];
            const concatVehiculos = [...vehiculos.data.detalle, ...total];
            setVehiculos(concatVehiculos);
            setEmpresas(concatVehiculos);
            setVehiculosOpt(vehiculos.data.chart);

        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId, inicio, final]);

    const columnsDet = [
        {
            Header: `Promedio de Antigüedad de Vehículos en Servicio de las Empresas de Transporte del Sistema de la empresa ${razonSocial} y la ruta ${codigoRuta}`,
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
                    Header: 'Antigüedad en Servicio',
                    accessor: 'proAntiguedadServicio',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
            <CharBarra options={vehiculosOpt} />
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