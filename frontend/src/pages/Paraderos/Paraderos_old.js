import { LayersControl, LayerGroup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { GeoJSON, Marker } from 'react-leaflet';
import Map from '../../components/Map/Map';
import ParaderosMarkers from '../../components/Poligonos/ParaderosMarkers';
import { STYLE_GEOM_2_1, STYLE_GEOM_1_2 } from '../../components/Poligonos/RutasPoligono';
import RutasPoligono from '../../components/Poligonos/RutasPoligono';
import HexagonosPoligono from '../../components/Poligonos/HexagonosPoligono';
import RutaService from '../../services/RutaService';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';
import Geoman from '../../components/Geoman/Geoman.js';
import ParaderoService from '../../services/ParaderoService';
import Dialog from '../../components/Dialog/Dialog';
import MostrarHistorico from '../Rutas/MostrarHistorico';
import CrearParada from './CrearParada';

export default function Paraderos_old() {

    const { rutaIdRuta } = useParams();
    const [rutas, setRutas] = useState([]);
    const [rutaId, setRutaId] = useState(-1);
    const [rutaGeom12, setRutaGeom12] = useState({});
    const [rutaGeom21, setRutaGeom21] = useState({});
    const [paradas12, setParadas12] = useState([]);
    const [paradas21, setParadas21] = useState([]);
    const [paraderos, setParaderos] = useState([]);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues]= useState({});
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

            // setRutas(rutasPorSentido);
            // if (rutaIdRuta) {
            //     setRutaId(rutas.findIndex(r => r.idRuta == rutaIdRuta));
            //     console.log("eeeeee", rutaIdRuta);
            // }
            // console.log(rutas);
        };
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
            const paraderos = await ParaderoService.getParadas(idRuta, sentido = undefined);
            setParaderos(paraderos.data[0].data);
            console.log(paraderos.data[0].data);

        };
        getParaderos(rutas[idxRuta].idRuta, sentido);

    }
    const handleClose = () => {
        setOpen(false);
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
                </Grid>
                <Grid item xs={10}>
                    <Map minZoom={0} maxZoom={50}>
                        <LayersControl collapsed={false} position="topright">
                            {/* <LayersControl.Overlay onClick={(e) => { console.log(e) }} checked name="Paraderos">
                                <LayerGroup>
                                    <LayerGroup onClick={(e) => { console.log(e) }}>
                                        {paraderos.map((paradero, index) =>
                                            paradero.sentido=='1-2'?
                                            <GeoJSON key={Math.random()} data={paradero.theGeomEstacion} style={STYLE_GEOM_1_2}></GeoJSON>
                                            :
                                            <GeoJSON key={Math.random()} data={paradero.theGeomEstacion} style={STYLE_GEOM_2_1}></GeoJSON>
                                            )}
                                    </LayerGroup>
                                </LayerGroup>
                            </LayersControl.Overlay> */}
                            {/* <LayersControl.Overlay onClick={(e) => { console.log(e) }} checked name="Rutas">
                                <LayerGroup>
                                    <LayerGroup onClick={(e) => { console.log(e) }}>
                                        {
                                            rutaId > -1 && rutaGeom12?.coordinates && <GeoJSON key={`transmisiones_${Math.random()}`} data={rutaGeom12} style={STYLE_GEOM_1_2}></GeoJSON>
                                        }
                                        {
                                            rutaId > -1 && rutaGeom21?.coordinates && <GeoJSON key={`transmisiones_${Math.random()}`} data={rutaGeom21} style={STYLE_GEOM_2_1}></GeoJSON>
                                        }
                                    </LayerGroup>

                                </LayerGroup>
                            </LayersControl.Overlay> */}

                        </LayersControl>
                        <Geoman setOpen={setOpen} setParadas12={setParadas12} setParadas21={setParadas21} data={paraderos} setInitialValues={setInitialValues}/>
                    </Map>
                </Grid>
            </Grid>
           
            <Dialog open={open} title='Editar Paradero' onClose={handleClose} >
                <CrearParada initialValues={initialValues} setOpen={setOpen} />
                {/* <MostrarHistorico /> */}
            </Dialog>
        </>
    );
}