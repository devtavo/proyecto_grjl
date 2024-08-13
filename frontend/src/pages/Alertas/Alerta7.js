import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import BasicTable from '../../components/Table/Table';
import AlertaService from '../../services/AlertaService';

export default function Alerta7() {
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        const getAlertas = async () => {
            const alertas = await AlertaService.get(7, {});
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
                    accessor: 'idSancion',
                },
                {
                    Header: 'Fecha Documento',
                    accessor: 'fechaDocumento',
                },
                {
                    Header: 'Descripción de sanción',
                    accessor: 'descripcionSancion',
                },
                {
                    Header: 'Importe',
                    accessor: 'importe',
                },
                {
                    Header: 'Placa',
                    accessor: 'placa',
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