import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import BasicTable from '../../components/Table/Table';
import Navigation from '../../components/Navigation/Navigation';
import BackButton from '../../components/BackButton/BackButton';
import { Link as RouterLink } from 'react-router-dom';
import ReporteService from "../../services/ReporteService";

export default function Reportes() {

    const [reportes, setReportes] = useState([]);

    useEffect(() => {
        const getReportes = async () => {
            const reportes = await ReporteService.getAll();
            setReportes(reportes.data);
        };
        getReportes();
    }, []);

    const columns = [
        {
            Header: ' ',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: 'Reporte',
                    accessor: 'name',
                },
                // {
                //     Header: "Visualizar",
                //     Cell: (props) => {
                //         const rowIdx = props.row.id;
                //         const { id } = reportes[rowIdx];

                //         return (
                //             <Button component={RouterLink} to={`/reportes/${id}`} variant="text" size="small" disabled={![1, 2, 3,4 ].includes(id)} >
                //                 Ver
                //             </Button>
                //         );
                //     }
                // }
            ],
            alignHeader: 'center',
        },
    ];

    const breadCrumb = [
        {
            name: 'Inicio',
            path: '../'
        },
        {
            name: 'Supervisión',
            path: '../'
        }
    ]

    return (
        <>
            <BackButton to='../' />

            <Navigation
                title="Reportes"
                breadcrumb={breadCrumb}
            />

            <BasicTable
                columns={columns}
                data={reportes}
                sizePro='small'
            />
        </>
    );
}