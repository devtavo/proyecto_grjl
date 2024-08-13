import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import BasicTable from '../../components/Table/Table';
import AlertaService from '../../services/AlertaService';

export default function Alerta11() {
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        const getAlertas = async () => {
            const alertas = await AlertaService.get(11, {});
            setAlertas(alertas.data);
        };
        getAlertas();
    }, []);

    const columns = [
        {
            Header: 'Alertas',
            columns: [
                {
                    Header: 'Razón social',
                    accessor: 'razonSocial',
                },
                {
                    Header: 'RUC',
                    accessor: 'ruc',
                },
                {
                    Header: 'Placa',
                    accessor: 'placaVehiculo',
                },
                {
                    Header: 'Año fabricación de vehículo',
                    accessor: 'afabricacionVehiculo',
                },
                {
                    Header: 'Código SOAT',
                    accessor: 'codigoSoat',
                },
                {
                    Header: 'Vencimiento SOAT',
                    accessor: 'vencimientoSoat',
                },
                {
                    Header: 'Estado',
                    accessor: 'estado',
                }
            ],
        },
    ];

    return (
        <>
            <BasicTable
                columns={columns}
                data={alertas}
            />
        </>
    );
}