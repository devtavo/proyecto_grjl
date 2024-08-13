import { useState, useEffect } from "react";
import Map from '../../components/Map/Map';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearSeguridad from './CrearSeguridad';
import SeguridadService from '../../services/SeguridadService';
import EettService from '../../services/EettService';
import useStyle from './style';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import EditIcon from '@mui/icons-material/Edit';

export const CREAR_PERSONA = 'CREAR_PERSONA';
export const EDITAR_PERSONA = 'EDITAR_PERSONA';
const MENSAJES_DE_RESPUESTA = {
    CREAR_PERSONA: 'Usuario registrado correctamente',
    EDITAR_PERSONA: 'Usuario actualizado correctamente'
};

export default function Seguridad() {
    var classes = useStyle();

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_PERSONA);
    const [initialValues, setInitialValues] = useState({});
    const [personas, setPersonas] = useState([]);

    useEffect(() => {
        const getPersonas = async () => {
            const personas = await SeguridadService.getAll();
            setPersonas(personas.data);
            console.log(personas.data);

        };
        getPersonas();
    }, []);

    const columns = [
        {
            Header: 'Lista de Usuarios',
            columns: [
                {
                    Header: '#',
                    accessor: 'idPersona',
                },
                {
                    Header: 'Usuario',
                    accessor: 'loginUsuario',
                },
                {
                    Header: 'Nombres',
                    accessor: 'nombre',
                },
                {
                    Header: 'Apellidos',
                    accessor: 'apellidoPaterno',
                },
                {
                    Header: 'Fecha de registro',
                    accessor: 'fechaRegistro',
                },
                {
                    Header: 'Estado',
                    accessor: 'estadoUsuario',
                },
                {
                    Header: 'Ultimo Acceso',
                    accessor: 'ultimoAcceso',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const persona = personas[rowIdx];

                        return (
                            <Button variant="text" size="small" startIcon={<EditIcon />}  onClick={() => {
                                setInitialValues(persona);
                                setFormulario(EDITAR_PERSONA);
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

    const onSuccess = (persona) => {
        if (formulario === CREAR_PERSONA)
            setPersonas([...personas, ...persona]);

        if (formulario === EDITAR_PERSONA) {
            const nPersonas = personas.map(p => p.idPersona === persona.idPersona ? { ...p, ...persona } : p);
            setPersonas(nPersonas);
            setInitialValues({});
        }

        setOpenDialog(false);
        setSnack({ ...snack, open: true, severity: 'success', message: MENSAJES_DE_RESPUESTA[formulario] });
    }

    const onCloseDialog = () => {
        setInitialValues({});
        setOpenDialog(false);
    }

    const breadCrumb = [
        {
            name: 'Inicio',
            path: '../'
        },
        {
            name: 'Administración',
            path: '../'
        }
    ]

    return (
        <>

            <Notification snack={snack} setSnack={setSnack} />
            <BackButton to='../' />

            <Navigation
                title="Seguridad"
                breadcrumb={breadCrumb}
            />

            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                <Button variant="outlined" startIcon={<AppRegistrationOutlinedIcon/>}  onClick={() => {
                    setFormulario(CREAR_PERSONA);
                    setOpenDialog(true);
                }}>Registrar Usuario</Button>
            </Stack>

            <Dialog open={openDialog} title={formulario === CREAR_PERSONA ? 'Registrar usuario' : 'Editar usuario'} handleClose={onCloseDialog}>
                <CrearSeguridad
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(persona) => {
                        onSuccess(persona);
                        console.log(persona);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando el usuario: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>

            <BasicTable
                columns={columns}
                data={personas}
                className={classes.container}
                sizePro='small'
                isBuscador={false}

            />
            
        </>
    );
}