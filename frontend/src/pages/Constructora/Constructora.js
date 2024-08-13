import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearConstructora from './CrearConstructora';
import ConstructoraService from '../../services/ConstructoraService';
import useStyle from './style';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';

export const CREAR_CONSTRUCTORA = 'CREAR_CONSTRUCTORA';
export const EDITAR_CONSTRUCTORA = 'EDITAR_CONSTRUCTORA';
const MENSAJES_DE_RESPUESTA = {
    CREAR_CONSTRUCTORA: 'Constructora registrado correctamente',
    EDITAR_CONSTRUCTORA: 'Constructora actualizado correctamente'
};

export default function Constructora() {
    var classes = useStyle();

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_CONSTRUCTORA);
    const [initialValues, setInitialValues] = useState({});
    const [constructoras, setConstructoras] = useState([]);

    useEffect(() => {
        const getConstructoras = async () => {
            const constructoras = await ConstructoraService.getAll();
            // console.log(parametros.data);
            setConstructoras(constructoras.data);
        };
        getConstructoras();
    }, []);


    const columns = [
        {
            Header: 'Constructora',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: 'Nombre',
                    accessor: 'constructora',
                },
                {
                    Header: 'RUC',
                    accessor: 'rucConstructora',
                },
                {
                    Header: 'Estado',
                    accessor: 'estado',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const constructora = constructoras[rowIdx];

                        return (
                            <Button variant="text" size="small" onClick={() => {
                                setInitialValues(constructora);
                                setFormulario(EDITAR_CONSTRUCTORA);
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

    const onSuccess = (constructora) => {
        // console.log(parametro)
        if (formulario === CREAR_CONSTRUCTORA) {
            // parametro.map(x => { x.valorParametro = JSON.stringify(x.valorParametro) });
            setConstructoras([...constructoras, ...constructora]);
        }
        if (formulario === EDITAR_CONSTRUCTORA) {
            const nConstructoras = constructoras.map(p => p.id === constructora.id ? { ...p, ...constructora } : p);
            setConstructoras(nConstructoras);
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
            name:'Mantenimiento',
            path:'../'
        }
    ]

    return (
        <>
            <Notification snack={snack} setSnack={setSnack} />
            <BackButton to='../' />

            <Navigation
                title="Constructoras" 
                breadcrumb={breadCrumb}
            />

            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom:'24px' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_CONSTRUCTORA);
                    setOpenDialog(true);
                }}>Registrar Constructora</Button>
            </Stack>

            <Dialog open={openDialog} title={formulario === CREAR_CONSTRUCTORA ? 'Registrar Constructora' : 'Editar constructora'} handleClose={onCloseDialog}>
                <CrearConstructora
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(constructoras) => {
                        onSuccess(constructoras);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la constructora: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>

            <BasicTable
                columns={columns}
                data={constructoras}
                className={classes.container}

            />
        </>
    );
}