import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from "react";

import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import RutaService from '../../services/RutaService';
import FormControl from '@mui/material/FormControl';
import UploadFile from '@mui/icons-material/UploadFile';
import Delete from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Map from '../../components/Map/Map';
import { GeoJSON } from 'react-leaflet';
import { CREAR_PARADERO } from './Paraderos';
import { jsonIsValid } from '../../helper/helper';
import { STYLE_GEOM_1_2 } from '../../components/Poligonos/RutasPoligono';
import { STYLE_GEOM_2_1 } from '../../components/Poligonos/RutasPoligono';
import ParaderosMarkers from '../../components/Poligonos/ParaderosMarkers';
import Geoman from '../../components/Geoman/Geoman.js';
import L from "leaflet";
import ParaderoService from '../../services/ParaderoService';

import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

const Input = styled('input')({
    display: 'none',
});

const validationSchema = yup.object({
    nombreParadero: yup
        .string('Ingresa el nombre del paradero')
        .required('Nombre de Paradero es requerido'),
    sentido: yup
        .string('Ingresa el sentido')
        .required('Sentido es requerido'),
});

const THEGEOMESTACION = 'theGeomEstacion';

export default function CrearParada({ formulario, initialValues, idRuta, onSuccess, onError, setOpen, rutaGeom12, rutaGeom21 }) {

    const [disable, setDisabled] = useState(false);

    const formik = useFormik({
        initialValues: {
            idParadero: initialValues?.idParadero || '',
            idRuta: idRuta || initialValues?.idRuta,
            nombreParadero: initialValues?.nombreParadero || '',
            glosaParadero: initialValues?.glosaParadero || '',
            sentido: initialValues?.sentido || '',
            inicioFin: initialValues?.inicioFin || '',
            orden: initialValues?.orden || '',
            estado: initialValues?.estado || '',
            theGeomEstacion: initialValues?.theGeomEstacion,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            postParadero({
                ...values,
                idRuta: idRuta,
                theGeomEstacion: values.theGeomEstacion
            });
        },
    });

    const postParadero = async (body) => {
        try {
            const res = formulario === CREAR_PARADERO ? await ParaderoService.post(body) : await ParaderoService.put(body);
            onSuccess(res.data);
            setOpen(false);
        } catch (error) {
            onError(error);
        }
    }
    const handleChangeFile = (e, field = THEGEOMESTACION) => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            const jsonStr = JSON.parse(e.target.result);
            if (jsonStr && jsonStr != null) {
                formik.setFieldValue(field, jsonStr.features[0].geometry);
            }
        };
    };

    const handleChangeFileMasivo = (e, field = THEGEOMESTACION) => {
        setDisabled(true);
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            const jsonStr = JSON.parse(e.target.result);
            if (jsonStr && jsonStr != null) {
                formik.setFieldValue(field, jsonStr.features);
            }
        };
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                autoFocus
                                fullWidth
                                margin="dense"
                                id="nombreParadero"
                                name="nombreParadero"
                                label="Nombre Paradero"
                                value={formik.values.nombreParadero}
                                onChange={formik.handleChange}
                                error={formik.touched.nombreParadero && Boolean(formik.errors.nombreParadero)}
                                helperText={formik.touched.nombreParadero && formik.errors.nombreParadero}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                id="glosaParadero"
                                name="glosaParadero"
                                label="Glosa paradero"
                                value={formik.values.glosaParadero}
                                onChange={formik.handleChange}
                                error={formik.touched.glosaParadero && Boolean(formik.errors.glosaParadero)}
                                helperText={formik.touched.glosaParadero && formik.errors.glosaParadero}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                id="sentido"
                                name="sentido"
                                label="Sentido"
                                value={formik.values.sentido}
                                onChange={formik.handleChange}
                                error={formik.touched.sentido && Boolean(formik.errors.sentido)}
                                helperText={formik.touched.sentido && formik.errors.sentido}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                id="orden"
                                name="orden"
                                label="Orden"
                                value={formik.values.orden}
                                onChange={formik.handleChange}
                                error={formik.touched.orden && Boolean(formik.errors.orden)}
                                helperText={formik.touched.orden && formik.errors.orden}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                id="inicioFin"
                                name="inicioFin"
                                label="Inicio Fin"
                                value={formik.values.inicioFin}
                                onChange={formik.handleChange}
                                error={formik.touched.inicioFin && Boolean(formik.errors.inicioFin)}
                                helperText={formik.touched.inicioFin && formik.errors.inicioFin}
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="estado">Estado</InputLabel>
                                <Select
                                    defaultValue={formik.values.estado}
                                    labelId="estado"
                                    id="estado"
                                    name="estado"
                                    label="Estado"
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value={1}>Activo</MenuItem>
                                    <MenuItem value={2}>Inactivo</MenuItem>
                                </Select>
                                {formik.errors.estado}
                            </FormControl>
                            <FormControl fullWidth margin="dense">
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container spacing={2} style={{ padding: '24px 0 16px 0' }}>
                                        <Grid item xs={6} >
                                            {/* {console.log("ee",formik.values.geom12)} */}
                                            {!jsonIsValid(formik.values.theGeomEstacion) &&
                                                <Button variant="outlined" fullWidth endIcon={<Delete />} onClick={() => formik.setFieldValue(THEGEOMESTACION, '')}>Eliminar</Button>
                                            }
                                            {jsonIsValid(formik.values.theGeomEstacion) &&
                                                <label htmlFor="adjuntar" >
                                                    <Input accept=".geojson" id="adjuntar" type="file" onChange={(e) => handleChangeFile(e, THEGEOMESTACION)} />
                                                    <Button variant="outlined" fullWidth component="span" endIcon={<UploadFile />}>
                                                        Adjuntar individualmente
                                                    </Button>
                                                </label>
                                            }
                                        </Grid>
                                        <Grid item xs={6} >
                                            {/* {console.log("ee",formik.values.geom12)} */}
                                            {!jsonIsValid(formik.values.theGeomEstacion) &&
                                                <Button variant="outlined" fullWidth endIcon={<Delete />} onClick={() => formik.setFieldValue(THEGEOMESTACION, '')}>Eliminar</Button>
                                            }
                                            {jsonIsValid(formik.values.theGeomEstacion) &&
                                                <label htmlFor="adjuntar2" >
                                                    <Input accept=".geojson" id="adjuntar2" type="file" onChange={(e) => handleChangeFileMasivo(e, THEGEOMESTACION)} />
                                                    <Button variant="outlined" fullWidth component="span" endIcon={<UploadFile />}>
                                                        Adjuntar masivamente
                                                    </Button>
                                                </label>
                                            }
                                        </Grid>

                                    </Grid>
                                </Box>
                            </FormControl>

                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Guardar
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={6}>
                        <Map maxZoom={22} minZoom={0} height="100%">

                            {/* {<ParaderosMarkers key={`paraderos_${Math.random()}`} idRuta={formik.values.idRuta} />} */}
                            {rutaGeom12 != null && <GeoJSON data={rutaGeom12} style={STYLE_GEOM_1_2}></GeoJSON>}
                            {rutaGeom21 != null && <GeoJSON data={rutaGeom21} style={STYLE_GEOM_2_1}></GeoJSON>}
                            {formik.values.sentido == '1-2' ?
                                formik.values.theGeomEstacion != null && <GeoJSON data={formik.values.theGeomEstacion} style={STYLE_GEOM_1_2}></GeoJSON>
                                :
                                formik.values.theGeomEstacion != null && <GeoJSON data={formik.values.theGeomEstacion} style={STYLE_GEOM_2_1}></GeoJSON>
                            }

                        </Map>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}