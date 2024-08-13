import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';

export default function Rutas({ reporteId, empresaId, rutaId, setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ReporteService.getVehiculos(reporteId, empresaId, rutaId);
            setVehiculos(vehiculos.data.detalle);
        };
        getVehiculos();
    }, [reporteId, empresaId, rutaId]);

    const columns =
    {
        Header: 'Reporte del tiempo acumulado de los Vehículos en la prestación del Servicio, por Vehículos (en días y horas)',
        columns: [
            {
                Header: '#',
                accessor: 'id',
            },
            {
                Header: "Placa",
                accessor: "placa",
            },
            {
                Header: 'Total Tiempo Acumulado en la Operación del Servicio (días y horas)',
                accessor: 'totTiempoAcumuladoOS',
                alignBody: 'center',
                alignHeader: 'center'
            },
        ],
        alignHeader: 'center'
    };

    return (
        <>
            <BasicTable
                columns={[columns]}
                data={vehiculos}
            />
        </>
    );
}