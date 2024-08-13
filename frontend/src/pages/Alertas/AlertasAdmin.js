import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearAlerta from './CrearAlerta';
import AlertaService from '../../services/AlertaService';
import useStyle from './style';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';

export const CREAR_ALERTA = 'CREAR_ALERTA';
export const EDITAR_ALERTA = 'EDITAR_ALERTA';
const MENSAJES_DE_RESPUESTA = {
    CREAR_ALERTA: 'Alerta registrado correctamente',
    EDITAR_ALERTA: 'Alerta actualizado correctamente'
};

export default function AlertasAdmin() {
    var classes = useStyle();

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_ALERTA);
    const [initialValues, setInitialValues] = useState({});
    const [alertas, setAlertas] = useState([]);


    useEffect(() => {
        const getAlertas = async () => {
            const alertas = await AlertaService.getAll();
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
                    Header: 'Nombre',
                    accessor: 'nombreAlerta',
                },
                // {
                //     Header: 'Titulo',
                //     accessor: 'tituloAlerta',
                // },
                // {
                //     Header: 'Descripcion',
                //     accessor: 'descripcionAlerta',
                // },
                {
                    Header: 'Glosa',
                    accessor: 'glosaAlerta',
                },
                // {
                //     Header: 'Accion',
                //     accessor: 'accionAlerta',
                // },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const alerta = alertas[rowIdx];

                        return (
                            <Button variant="text" size="small" onClick={() => {
                                setInitialValues(alerta);
                                setFormulario(EDITAR_ALERTA);
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

    const onSuccess = (alerta) => {
        if (formulario === CREAR_ALERTA)
            setAlertas([...alertas, ...alerta]);

        if (formulario === EDITAR_ALERTA) {
            const nAlertas = alertas.map(a => a.idAlerta === alerta.idAlertas ? { ...a, ...alerta } : a);
            setAlertas(nAlertas);
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
                title="Alertas" 
                breadcrumb={breadCrumb}
            />

            {/* <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom:'24px' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_ALERTA);
                    setOpenDialog(true);
                }}>Registrar alerta</Button>
            </Stack> */}

            <Dialog open={openDialog} title={formulario === CREAR_ALERTA ? 'Registrar alerta' : 'Editar alerta'} handleClose={onCloseDialog}>
                <CrearAlerta
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(alerta) => {
                        onSuccess(alerta);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la alerta: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>
         
            <BasicTable
                columns={columns}
                data={alertas}
                className={classes.container}
                sizePro='small'
            />
        </>
    );
}