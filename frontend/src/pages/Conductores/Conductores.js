import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearConductor from './CrearConductor';
import ConductorService from '../../services/ConductorService';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';

export const CREAR_CONDUCTOR = 'CREAR_CONDUCTOR';
export const EDITAR_CONDUCTOR = 'EDITAR_CONDUCTOR';
const MENSAJES_DE_RESPUESTA = {
    CREAR_CONDUCTOR: 'Conductor registrado correctamente',
    EDITAR_CONDUCTOR: 'Conductor actualizado correctamente'
};

export default function Conductores() {
    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_CONDUCTOR);
    const [initialValues, setInitialValues] = useState({});
    const [conductores, setConductores] = useState([]);
    const user = JSON.parse(localStorage.getItem('user')).idEtt;

    useEffect(() => {
        const getConductores = async () => {
            const conductores = await ConductorService.getAll(user);
            setConductores(conductores.data);
        };
        getConductores();
    }, []);

    const columns = [
        {
            Header: 'Conductores',
            columns: [
                {
                    Header: '#',
                    accessor: 'idConductor',
                },
                {
                    Header: 'Numero Licencia',
                    accessor: 'numeroLicencia',
                },
                {
                    Header: 'Apellido Paterno',
                    accessor: 'apellidoPaterno',
                },
                {
                    Header: 'Apellido Materno',
                    accessor: 'apellidoMaterno',
                },
                {
                    Header: 'Nombres Completos',
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
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const conductor = conductores[rowIdx];

                        return (
                            <Button variant="text" size="small" onClick={() => {
                                setInitialValues(conductor);
                                setFormulario(EDITAR_CONDUCTOR);
                                setOpenDialog(true);
                            }}>
                                Editar
                            </Button>
                        );
                    }
                }
            ],
        },
    ];

    const onSuccess = (conductor) => {
        if (formulario === CREAR_CONDUCTOR)
            setConductores([...conductores, ...conductor]);

        if (formulario === EDITAR_CONDUCTOR) {
            const nConductores = conductores.map(p => p.idConductor === conductor.idConductor ? { ...p, ...conductor } : p);
            setConductores(nConductores);
            setInitialValues({});
        }

        setOpenDialog(false);
        setSnack({ ...snack, open: true, severity: 'success', message: MENSAJES_DE_RESPUESTA[formulario] });
    }

    const onCloseDialog = () => {
        setInitialValues({});
        setOpenDialog(false);
    }

    const breadCrumb=[
        {
            name:'Inicio',
            path:'../'
        },
        {
            name:'Administración',
            path:'../'
        }
    ]

    return (
        <>
            <Notification snack={snack} setSnack={setSnack} />
            
            <BackButton to='../' />
            <Navigation
                title="Conductores" 
                breadcrumb={breadCrumb}
            />

            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom:'24px' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_CONDUCTOR);
                    setOpenDialog(true);
                }}>Registrar conductor</Button>
            </Stack>

            <Dialog open={openDialog} title={formulario === CREAR_CONDUCTOR ? 'Registrar conductor' : 'Editar conductor'} handleClose={onCloseDialog}>
                <CrearConductor
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(conductor) => {
                        onSuccess(conductor);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando conductor: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>

            < BasicTable
                columns={columns}
                data={conductores}
            />
        </>
    );
}