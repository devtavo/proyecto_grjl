import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import BasicTable from '../../components/Table/Table';
import Navigation from '../../components/Navigation/Navigation';
import BackButton from '../../components/BackButton/BackButton';

import ConsultaService from "../../services/ConsultaService";

export default function Consultas() {

    const [consultas, setConsultas] = useState([]);

    useEffect(() => {
        const getConsultas = async () => {
            const consultas = await ConsultaService.getAll();
            setConsultas(consultas.data);
        };
        getConsultas();
    }, []);

    const columns = [
        {
            Header: 'Reportes',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: 'Reporte',
                    accessor: 'name',
                },
                {
                    Header: "Visualizar",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { id } = consultas[rowIdx];
                        // console.log('idConsulta: ', id);

                        return (
                            <Button component={Link} to={`/consultas/${id}`} variant="text" size="small" disabled={[5].includes(id)}>
                                Ver
                            </Button>
                        );
                    }
                }
            ],
        },
    ];

    const breadCrumb=[
        {
            name:'Inicio',
            path:'../'
        },
        {
            name:'Supervisión',
            path:'../'
        }
    ]

    return (
        <>
     
            <BackButton to='../' bread={[{ name: 'Inicio', path: '../' }, { name: 'Supervision', path: '.' },{ name: 'Consultas', path: '.' }]} />
            <Navigation
                title="Reportes" 
                breadcrumb={breadCrumb}
            />
            <BasicTable
                columns={columns}
                data={consultas}
                sizePro='small'
                isBuscador={false}

            />
        </>
    );
}