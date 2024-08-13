import { LayersControl, LayerGroup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import RutaService from '../../services/RutaService';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';
import ParaderoService from '../../services/ParaderoService';
import Dialog from '../../components/Dialog/Dialog';
import CrearParada from './CrearParada';
import BasicTable from '../../components/Table/Table';

export const CREAR_PARADERO = 'CREAR_PARADERO';
export const EDITAR_PARADERO = 'EDITAR_PARADERO';
const MENSAJES_DE_RESPUESTA = {
    CREAR_PARADERO: 'Ruta registrado correctamente',
    EDITAR_PARADERO: 'Ruta actualizado correctamente'
};

export default function Paraderos() {

    const { rutaIdRuta } = useParams();
    const [rutas, setRutas] = useState([]);
    const [rutaId, setRutaId] = useState(-1);
    const [rutaGeom12, setRutaGeom12] = useState({});
    const [rutaGeom21, setRutaGeom21] = useState({});
    const [paradas12, setParadas12] = useState([]);
    const [paradas21, setParadas21] = useState([]);
    const [paraderos, setParaderos] = useState([]);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_PARADERO);

    console.log(rutaIdRuta);
    useEffect(() => {
        const getRutas = async () => {
            let rutasPorSentido = [];
            const rutass = await RutaService.getAll();
            setRutas(rutass.data);
            rutass.data.forEach(ruta => {
                const geomSentido12 = ruta.geom12;
                const geomSentido21 = ruta.geom21;

                const { geom12, geom21, ...rutaSinSentidos } = ruta;

                rutasPorSentido.push({
                    ...rutaSinSentidos,
                    nombreRuta: `${ruta.nombreRuta} sentido 1-2`,
                    geom: geomSentido12,
                    sentido: '1-2'
                });

                rutasPorSentido.push({
                    ...rutaSinSentidos,
                    nombreRuta: `${ruta.nombreRuta} sentido 2-1`,
                    geom: geomSentido21,
                    sentido: '2-1'
                })
            });

        }
        getRutas();
    }, []);

    const handleChangeRuta = (e) => {
        const idxRuta = e.target.value;
        const geom12 = rutas[idxRuta].geom12;
        const geom21 = rutas[idxRuta].geom21;
        setRutaId(idxRuta);
        setRutaGeom12(geom12);
        setRutaGeom21(geom21);

        const sentido = undefined;
        const getParaderos = async (idRuta, sentido) => {
            const paraderos = await ParaderoService.getAll(idRuta, sentido = undefined);
            setParaderos(paraderos.data);
            console.log(paraderos.data);

        };
        getParaderos(rutas[idxRuta].idRuta, sentido);

    }
    const onSuccess = (paradero) => {
        if (formulario === CREAR_PARADERO)
            setParaderos([...paraderos, ...paradero]);

        if (formulario === EDITAR_PARADERO) {
            const nParaderos = paraderos.map(p => p.idParadero === paradero.idParadero ? { ...p, ...paradero } : p);
            setParaderos(nParaderos);
            console.log("asdasd", nParaderos);
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
    ];

    const columnsDet = [
        {
            Header: `Lista de paraderos de la ruta ${rutas != null ? rutas[rutaId]?.codigoRuta : ''}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: 'Nombre paradero',
                    accessor: 'nombreParadero',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
               
                {
                    Header: 'Sentido',
                    accessor: 'sentido',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: 'Inicial - Final',
                    accessor: 'inicioFin',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: 'Orden',
                    accessor: 'orden',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: 'Estado',
                    accessor: 'estadoF',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const paradero = paraderos[rowIdx];

                        return (
                            <Stack spacing={1} direction="row">
                                <Button variant="text" size="small" onClick={() => {
                                    setInitialValues(paradero);
                                    setFormulario(EDITAR_PARADERO);
                                    setOpenDialog(true);
                                }}>
                                    Editar
                                </Button>
                            </Stack>
                        );
                    },
                    accessor: 'razonSocialEmpresa'
                },
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
            <BackButton to='../' />
            <Navigation
                title="Paraderos"
                breadcrumb={breadCrumb}
            />

            <Grid container spacing={2} style={{ height: '80vh' }}>
                <Grid item xs={2}>
                    <FormControl margin="dense" fullWidth>
                        <InputLabel>Rutas</InputLabel>
                        <Select label="Rutas" value={rutaId} onChange={handleChangeRuta}>
                            {
                                rutas.map((ruta, index) => (
                                    <MenuItem key={index} value={index}>{ruta.nombreRuta}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    {(rutas.length > 0) &&
                        <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                            <Button variant="outlined" onClick={() => {
                                setFormulario(CREAR_PARADERO);
                                setOpenDialog(true);
                            }}>Registrar Paradero</Button>
                        </Stack> 
                    }
                </Grid>

                <Dialog open={openDialog} maxWidth="lg" title={formulario === CREAR_PARADERO ? 'Registrar paradero' : 'Editar paradero'} handleClose={onCloseDialog}>
                    <CrearParada
                        formulario={formulario}
                        initialValues={initialValues}
                        idRuta={rutas[rutaId]?.idRuta}
                        rutaGeom12={rutaGeom12}
                        rutaGeom21={rutaGeom21}
                        onSuccess={(paradero) => {
                            onSuccess(paradero);
                        }}
                        onError={(error) => {
                            // setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la ruta: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>
                <Grid item xs={10}>
                    <BasicTable
                        columns={columnsDet}
                        data={paraderos}
                    />
                    <br />
                </Grid>
            </Grid>
        </>
    );
}