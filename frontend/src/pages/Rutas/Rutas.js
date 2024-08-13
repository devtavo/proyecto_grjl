import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearRuta from './CrearRuta';
import RutaService from '../../services/RutaService';
import useStyle from './style';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';
import MostrarHistorico from './MostrarHistorico';
import ParaderoService from '../../services/ParaderoService';

import { Link } from "react-router-dom";
export const CREAR_RUTA = 'CREAR_RUTA';
export const EDITAR_RUTA = 'EDITAR_RUTA';
export const HISTORICO = 'HISTORICO';
const MENSAJES_DE_RESPUESTA = {
    CREAR_RUTA: 'Ruta registrado correctamente',
    EDITAR_RUTA: 'Ruta actualizado correctamente'
};

export default function Rutas() {
    var classes = useStyle();

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_RUTA);
    const [initialValues, setInitialValues] = useState({});
    const [rutas, setRutas] = useState([]);
    const [idRuta, setIdRuta] = useState('');
    const [paraderos,setParaderos]= useState([]);
    
    useEffect(() => {
        const getRutas = async () => {
            const rutas = await RutaService.getAll();
            setRutas(rutas.data);
            const paraderos= await ParaderoService.getAll();
            setParaderos(paraderos.data);
        };
        getRutas();
    }, []);

    const columns = [
        {
            Header: 'Rutas',
            columns: [
                {
                    Header: '#',
                    accessor: 'idRuta',
                },
                {
                    Header: 'Cod. Ruta',
                    accessor: 'codigoRuta',
                },
                {
                    Header: 'Ruta',
                    accessor: 'nombreRuta',
                },
                {
                    Header: 'Glosa',
                    accessor: 'glosaRuta',
                },
                {
                    Header: 'Estado',
                    accessor: 'nEstado',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const ruta = rutas[rowIdx];

                        return (
                            <>
                                <Stack spacing={1} direction="row">
                                    <Button variant="text" size="small" onClick={() => {
                                        setInitialValues(ruta);
                                        setFormulario(EDITAR_RUTA);
                                        setOpenDialog(true);
                                    }}>
                                        Editar
                                    </Button>
                                    <Button component={Link} to={`/paraderos/${ruta.idRuta}`} variant="text" size="small" >
                                        Paraderos
                                    </Button>
                                    <Button variant="text" size="small" onClick={() => {
                                        setIdRuta(ruta.idRuta);
                                        setFormulario(HISTORICO);
                                        setOpenDialog(true);
                                    }}>
                                        Historico Cambios
                                    </Button>
                                </Stack>
                            </>
                        );
                    }
                }
            ],
        },
    ];

    const onSuccess = (ruta) => {
        if (formulario === CREAR_RUTA)
            setRutas([...rutas, ...ruta]);

        if (formulario === EDITAR_RUTA) {
            const nRutas = rutas.map(p => p.idRuta === ruta.idRuta ? { ...p, ...ruta } : p);
            setRutas(nRutas);
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
                title="Rutas"
                breadcrumb={breadCrumb}
            />
            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_RUTA);
                    setOpenDialog(true);
                }}>Registrar ruta</Button>
            </Stack>
            {formulario === HISTORICO ?
                <Dialog open={openDialog} title='Lista cambios hecho a las rutas' handleClose={onCloseDialog}>
                    <MostrarHistorico idRuta={idRuta} />
                </Dialog>
                : <Dialog open={openDialog} maxWidth="lg" title={formulario === CREAR_RUTA ? 'Registrar ruta' : 'Editar ruta'} handleClose={onCloseDialog}>
                    <CrearRuta
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(ruta) => {
                            onSuccess(ruta);
                        }}
                        onError={(error) => {
                            setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la ruta: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>

            }
            <BasicTable
                columns={columns}
                data={rutas}
                className={classes.container}
                sizePro='small'
            />
        </>
    );
}