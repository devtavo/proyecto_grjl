import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearParametro from './CrearParametro';
import ParametroService from '../../services/ParametroService';
import useStyle from './style';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';

export const CREAR_PARAMETRO = 'CREAR_PARAMETRO';
export const EDITAR_PARAMETRO = 'EDITAR_PARAMETRO';
const MENSAJES_DE_RESPUESTA = {
    CREAR_PARAMETRO: 'Parámetro registrado correctamente',
    EDITAR_PARAMETRO: 'Parámetro actualizado correctamente'
};

export default function Parametros() {
    var classes = useStyle();

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_PARAMETRO);
    const [initialValues, setInitialValues] = useState({});
    const [parametros, setParametros] = useState([]);

    useEffect(() => {
        const getParametros = async () => {
            const parametros = await ParametroService.getAll();
            console.log(parametros.data);
            setParametros(parametros.data);
        };
        getParametros();
    }, []);


    const columns = [
        {
            Header: 'Parametros',
            columns: [
                {
                    Header: '#',
                    accessor: 'idParametro',
                },
                {
                    Header: 'Parametro',
                    accessor: 'nombreParametro',
                },
                {
                    Header: 'Glosa',
                    accessor: 'glosaParametro',
                },
                {
                    Header: 'Valor',
                    accessor: 'valorParametro',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const parametro = parametros[rowIdx];

                        return (
                            <Button variant="text" size="small" onClick={() => {
                                setInitialValues(parametro);
                                setFormulario(EDITAR_PARAMETRO);
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

    const onSuccess = (parametro) => {
        // console.log(parametro)
        if (formulario === CREAR_PARAMETRO) {
            parametro.map(x => { x.valorParametro = JSON.stringify(x.valorParametro) });
            setParametros([...parametros, ...parametro]);
        }
        if (formulario === EDITAR_PARAMETRO) {
            const nParametros = parametros.map(p => p.idParametro === parametro.idParametro ? { ...p, ...parametro } : p);
            nParametros.map(x => { x.valorParametro = JSON.stringify(x.valorParametro) });
            setParametros(nParametros);
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
                title="Parámetros" 
                breadcrumb={breadCrumb}
            />

            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom:'24px' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_PARAMETRO);
                    setOpenDialog(true);
                }}>Registrar parámetro</Button>
            </Stack>

            <Dialog open={openDialog} title={formulario === CREAR_PARAMETRO ? 'Registrar parámetro' : 'Editar parámetro'} handleClose={onCloseDialog}>
                <CrearParametro
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(parametro) => {
                        onSuccess(parametro);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando el parámetro: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>

            <BasicTable
                columns={columns}
                data={parametros}
                className={classes.container}

            />
        </>
    );
}