import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import BasicTable from '../../components/Table/Table';
import AlertaService from '../../services/AlertaService';

export default function Alerta14() {
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        const getAlertas = async () => {
            const alertas = await AlertaService.get(14, {});
            setAlertas(alertas.data);
        };
        getAlertas();
    }, []);

    const columns = [
        {
            Header: 'Alertas',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: 'Ruta',
                    accessor: 'ruta',
                },
                {
                    Header: 'Fecha determinada',
                    accessor: 'fechaDet',
                },
                {
                    Header: 'Cantidad ingresos',
                    accessor: 'cantidadIngresos',
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