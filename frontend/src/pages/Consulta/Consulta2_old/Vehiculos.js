import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import CharBarra from '../../../components/Charts/ChartBarra';

export default function Rutas({ consultaId, empresaId, rutaId, inicio, final, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculosOpt,setVehiculosOpt]=useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ConsultaService.getVehiculos(consultaId, empresaId, rutaId, inicio, final);
            setVehiculos(vehiculos.data.detalle);
            setVehiculosOpt(vehiculos.data.chart);

        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId, inicio, final]);

    const columns = [
        {
            Header: 'KILÓMETROS RECORRIDOS POR LOS VEHÍCULOS EN SERVICIO',
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
                    Header: 'Kilómetros Recorridos',
                    accessor: 'kmRecorridos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje del Total',
                    accessor: 'porcTotal',
                    alignBody: 'center',
                    alignHeader: 'center'
                },    
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
             <CharBarra options={vehiculosOpt}/>
            <BasicTable isExportable columns={columns} data={vehiculos} />
            
        </>
    );
}