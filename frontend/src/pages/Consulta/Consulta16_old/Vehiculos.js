import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import CharBarra from '../../../components/Charts/ChartBarra';

export default function Rutas({ consultaId, empresaId, rutaId, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculosOpt,setVehiculosOpt]=useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ConsultaService.getVehiculos(consultaId, empresaId, rutaId);
            setVehiculos(vehiculos.data.detalle);
            setVehiculosOpt(vehiculos.data.chart);

        };
        getVehiculos();
    }, [consultaId, empresaId, rutaId]);

    const columns = [
        {
            Header: 'KILÓMETROS RECORRIDOS FUERA DE RUTA',
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
                    Header: 'Kilómetros recorridos en Ruta',
                    accessor: 'kmRecorridosRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros recorridos fuera de Ruta',
                    accessor: 'kmRecorridosFueraRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje de Kilómetros Recorridos fuera de Ruta',
                    accessor: 'porcKmRecorridosFueraRuta',
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