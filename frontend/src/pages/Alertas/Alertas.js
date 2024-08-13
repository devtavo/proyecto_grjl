import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import BasicTable from '../../components/Table/Table';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';
import AlertaDet from "./AlertasDet";
import { useHistory } from "react-router-dom";
import Alerta8 from './Alerta8';
import Alerta7 from './Alerta7';
import Alerta11 from './Alerta11';
import Alerta14 from './Alerta14';
import Map from '../../components/Map/Map';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import AlertaService from "../../services/AlertaService";

const VISTA_ALERTAS = 'VISTA_ALERTAS';
const VISTA_ALERTA_DET = 'VISTA_ALERTA_DET';

export default function Alerta() {
    let history = useHistory();
    const [open, setOpen] = useState(false);
    const [alertas, setAlertas] = useState([]);
    const [alertaId, setAlertaId] = useState(0);
    const [vista, setVista] = useState(VISTA_ALERTAS);

    useEffect(() => {
        const getAlertas = async () => {
            const alertas = await AlertaService.getAll();
            setAlertas(alertas.data);
        };
        getAlertas();
    }, []);

    const handleClickAlerta = (e, id) => {
        setVista(VISTA_ALERTA_DET);
        setAlertaId(id);
        history.push(`/alertas/${id}`);
    }

    const handleClickBack = () => {
        setVista(VISTA_ALERTAS);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        {
            Header: ' ',
            columns: [
                {
                    Header: '#',
                    accessor: 'idAlerta',
                },
                {
                    Header: 'Alerta',
                    accessor: 'nombreAlerta',
                },
                {
                    Header: "Visualizar",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idAlerta } = alertas[rowIdx];

                        return (
                            <Button variant="text" size="small" onClick={(e) => handleClickAlerta(e, idAlerta)} disabled={![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(idAlerta)}>
                                Ver
                            </Button>
                        );
                    }
                }
            ],
        },
    ];



    const getAlerta = (alertaId = 0) => {
        if (alertaId === 7) return <Alerta7 />
        if (alertaId === 8) return <Alerta8 />
        if (alertaId === 11) return <Alerta11 />
        // if (alertaId === 14) return <Alerta14 />
        return <AlertaDet alertaId={alertaId} setOpen={setOpen} />
    }

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
    const breadCrumbAlerta = [
        {
            name: 'Inicio',
            path: '../'
        },
        {
            name: 'Supervisión',
            path: '../'
        },
        {
            name: 'Alertas',
            path: './'
        },

    ]
    if (vista === VISTA_ALERTAS)
        return (
            <>
                <BackButton to='../' bread={[{ name: 'Inicio', path: '../' }, { name: 'Alertas', path: '.' }]} />
                <Navigation
                    title="Alertas"
                    breadcrumb={breadCrumb}
                />
                <BasicTable
                    columns={columns}
                    data={alertas}
                    sizePro='small'
                />
            </>
        );


    if (vista === VISTA_ALERTA_DET)
        return (
            <>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div >
                    <BackButton handleClickBack={handleClickBack} />

                    <Navigation
                        title={alertas.find(alerta => alerta.idAlerta === alertaId).nombreAlerta}
                        breadcrumb={breadCrumbAlerta}
                    />
                </div>
                {getAlerta(alertaId)}

            </>
        );
}