import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import BasicTable from '../../components/Table/Table';
import AlertaService from '../../services/AlertaService';

export default function Alerta8() {
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        const getAlertas = async () => {
            const alertas = await AlertaService.get(8, {});
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
                    accessor: 'idConductor',
                },
                {
                    Header: 'numeroLicencia',
                    accessor: 'numeroLicencia',
                },
                {
                    Header: 'apellidoPaterno',
                    accessor: 'apellidoPaterno',
                },
                {
                    Header: 'apellidoMaterno',
                    accessor: 'apellidoMaterno',
                },
                {
                    Header: 'nombresCompletos',
                    accessor: 'nombresCompletos',
                },
                {
                    Header: 'Clase',
                    accessor: 'clase',
                },
                {
                    Header: 'Categoría',
                    accessor: 'categoria',
                },
                {
                    Header: 'Fecha expedición',
                    accessor: 'fechaExpedicion',
                },
                {
                    Header: 'Fecha revalidación',
                    accessor: 'fechaRevalidacion',
                },
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