import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearInfraccion from './CrearInfraccion';
import SancionService from '../../services/ConstructoraService';
import useStyle from './style';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';

export const CREAR_INFRACCION = 'CREAR_INFRACCION';
export const EDITAR_INFRACCION = 'EDITAR_INFRACCION';
const MENSAJES_DE_RESPUESTA = {
    CREAR_INFRACCION: 'Infracción registrado correctamente',
    EDITAR_INFRACCION: 'Infracción actualizado correctamente'
};

export default function Infraccion() {
    var classes = useStyle();

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_INFRACCION);
    const [initialValues, setInitialValues] = useState({});
    const [infracciones, setInfracciones] = useState([]);

    useEffect(() => {
        const getInfracciones = async () => {
            const infracciones = await SancionService.getLista();
            // console.log(parametros.data);
            setInfracciones(infracciones.data);
        };
        getInfracciones();
    }, []);


    const columns = [
        {
            Header: 'Infraccion',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: 'Cod. Falta',
                    accessor: 'codFalta',
                },
                {
                    Header: 'Descripcion',
                    accessor: 'descripcionInfra',
                },
                {
                    Header: 'Importe infracción',
                    accessor: 'sancion',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const infraccion = infracciones[rowIdx];

                        return (
                            <Button variant="text" size="small" onClick={() => {
                                setInitialValues(infraccion);
                                setFormulario(EDITAR_INFRACCION);
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

    const onSuccess = (infraccion) => {
        // console.log(parametro)
        if (formulario === CREAR_INFRACCION) {
            // parametro.map(x => { x.valorParametro = JSON.stringify(x.valorParametro) });
            setInfracciones([...infracciones, ...infraccion]);
        }
        if (formulario === EDITAR_INFRACCION) {
            const nInfracciones = infracciones.map(p => p.id === infraccion.id ? { ...p, ...infraccion } : p);
            // nParametros.map(x => { x.valorParametro = JSON.stringify(x.valorParametro) });
            setInfracciones(nInfracciones);
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
                title="Infracciones" 
                breadcrumb={breadCrumb}
            />

            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom:'24px' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_INFRACCION);
                    setOpenDialog(true);
                }}>Registrar Infracción</Button>
            </Stack>

            <Dialog open={openDialog} title={formulario === CREAR_INFRACCION ? 'Registrar infraccion' : 'Editar infraccion'} handleClose={onCloseDialog}>
                <CrearInfraccion
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(infracciones) => {
                        onSuccess(infracciones);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando el parámetro: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>

            <BasicTable
                columns={columns}
                data={infracciones}
                className={classes.container}

            />
        </>
    );
}