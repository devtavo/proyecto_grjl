import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearSancion from './CrearSancion';
import SancionService from '../../services/SancionService';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';

export const CREAR_SANCION = 'CREAR_SANCION';
export const EDITAR_SANCION = 'EDITAR_SANCION';
export const LISTADO_SANCION = 'LISTADO_SANCION';

const MENSAJES_DE_RESPUESTA = {
    CREAR_SANCION: 'Sanción administrativa registrada correctamente',
    EDITAR_SANCION: 'Sanción administrativa actualizada correctamente'
};

export default function Sanciones() {
    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_SANCION);
    const [initialValues, setInitialValues] = useState({});
    const [sanciones, setSanciones] = useState([]);

    useEffect(() => {
        const getSanciones = async () => {
            const sanciones = await SancionService.getAll();
            setSanciones(sanciones.data);
        };
        getSanciones();
    }, []);

    const columns = [
        {
            Header: 'Sanciones',
            columns: [
                {
                    Header: '#',
                    accessor: 'idSancion',
                },
                {
                    Header: 'Descripción de sanción',
                    accessor: 'descripcionSancion',
                },
                {
                    Header: 'Fecha Caducidad',
                    accessor: 'fechaDocumento',
                },
                {
                    Header: 'Importe',
                    accessor: 'importe',
                },
                {
                    Header: 'Placa',
                    accessor: 'placa',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const sancion = sanciones[rowIdx];

                        return (
                            <Button variant="text" size="small" onClick={() => {
                                setInitialValues(sancion);
                                setFormulario(EDITAR_SANCION);
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

    const onSuccess = (sancion) => {
        if (formulario === CREAR_SANCION)
            setSanciones([...sanciones, ...sancion]);

        if (formulario === EDITAR_SANCION) {
            const nSanciones = sanciones.map(p => p.idSancion === sancion.idSancion ? { ...p, ...sancion } : p);
            setSanciones(nSanciones);
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
                title="Sanciones"
                breadcrumb={breadCrumb}
            />


            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_SANCION);
                    setOpenDialog(true);
                }}>Registrar sanción</Button>
                <Button variant="outlined" component={Link} to={`/infracciones/`}>
                    Modificar lista de Infracciones
                </Button>
            </Stack>

            <Dialog open={openDialog} title={formulario === CREAR_SANCION ? 'Registrar sanción administrativa' : 'Editar sanción administrativa'} handleClose={onCloseDialog}>
                <CrearSancion
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(sancion) => {
                        onSuccess(sancion);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando sanción administrativa: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>

            <BasicTable
                columns={columns}
                data={sanciones}
            />
        </>
    );
}