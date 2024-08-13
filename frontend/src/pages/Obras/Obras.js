import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearObras from './CrearObras';
import ObraService from '../../services/ObraService';
import useStyle from './style';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';

export const CREAR_OBRA = 'CREAR_OBRAS';
export const EDITAR_OBRA = 'EDITAR_OBRAS';
const MENSAJES_DE_RESPUESTA = {
    CREAR_OBRAS: 'Obras registrado correctamente',
    EDITAR_OBRAS: 'Obras actualizado correctamente'
};

export default function Obras() {
    var classes = useStyle();

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_OBRA);
    const [initialValues, setInitialValues] = useState({});
    const [obras, setObras] = useState([]);

    useEffect(() => {
        const getObras = async () => {
            const obras = await ObraService.getAll();
            // console.log(parametros.data);
            setObras(obras.data);
        };
        getObras();
    }, []);


    const columns = [
        {
            Header: 'Obras',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: 'Nombre',
                    accessor: 'nombre',
                },
                {
                    Header: 'Distrito',
                    accessor: 'distrito',
                },
                {
                    Header: 'Estado',
                    accessor: 'estado',
                },
                {
                    Header: 'Dirección',
                    accessor: 'direccion',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const obra = obras[rowIdx];

                        return (
                            <Button variant="text" size="small" onClick={() => {
                                setInitialValues(obra);
                                setFormulario(EDITAR_OBRA);
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

    const onSuccess = (obra) => {
        // console.log(parametro)
        if (formulario === CREAR_OBRA) {
            // parametro.map(x => { x.valorParametro = JSON.stringify(x.valorParametro) });
            setObras([...obras, ...obra]);
        }
        if (formulario === EDITAR_OBRA) {
            const nObras = obras.map(p => p.id === obra.id ? { ...p, ...obra } : p);
            setObras(nObras);
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
            name: 'Mantenimiento',
            path: '../'
        }
    ]

    return (
        <>
            <Notification snack={snack} setSnack={setSnack} />
            <BackButton to='../' />

            <Navigation
                title="Obras"
                breadcrumb={breadCrumb}
            />

            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_OBRA);
                    setOpenDialog(true);
                }}>Registrar Obras</Button>
            </Stack>

            <Dialog open={openDialog} title={formulario === CREAR_OBRA ? 'Registrar Obra' : 'Editar Obra'} handleClose={onCloseDialog}>
                <CrearObras
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(obras) => {
                        onSuccess(obras);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando una obra: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>

            <BasicTable
                columns={columns}
                data={obras}

                className={classes.container}

            />
        </>
    );
}