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
import { CREAR_RUTA } from './Rutas';
import { jsonIsValid } from '../../helper/helper';
import { STYLE_GEOM_1_2 } from '../../components/Poligonos/RutasPoligono';
import { STYLE_GEOM_2_1 } from '../../components/Poligonos/RutasPoligono';
import ParaderosMarkers from '../../components/Poligonos/ParaderosMarkers';
import Geoman from '../../components/Geoman/Geoman.js';
import L from "leaflet";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

const Input = styled('input')({
    display: 'none',
});

const validationSchema = yup.object({
    codigoRuta: yup
        .string('Ingresa el código de ruta')
        .required('Nombre de ruta es requerido'),
    nombreRuta: yup
        .string('Ingresa el nombre de la ruta')
        .required('Nombre de Ruta es requerido'),
});

const GEOM_1_2 = 'geom12';
const GEOM_2_1 = 'geom21';

export default function CrearRuta({ formulario, initialValues, onSuccess, onError }) {


    const [geom, setGeom] = useState([]);
    // console.log('ruta', initialValues);
    // console.log('isvalido', jsonIsValid(initialValues.geom12));
    // console.log('isvalidojson', JSON.parse(initialValues.geom12));
    const formik = useFormik({
        initialValues: {
            idRuta: initialValues?.idRuta || 0,
            codigoRuta: initialValues?.codigoRuta || '',
            nombreRuta: initialValues?.nombreRuta || '',
            glosaRuta: initialValues?.glosaRuta || '',
            detalleRuta: initialValues?.detalleRuta || '',
            geom12: initialValues.geom12,
            geom21: initialValues.geom21,
            estado: initialValues?.estado || ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log("submit", geom);
            postRuta({
                ...values,
                geom12: values.geom12,
                geom21: values.geom21,
            });
        },
    });

    const postRuta = async (body) => {
        try {
            const res = formulario === CREAR_RUTA ? await RutaService.post(body) : await RutaService.put(body);
            onSuccess(res.data);
        } catch (error) {
            onError(error);
        }
    }

    const handleChangeFile = (e, field = GEOM_1_2) => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            const jsonStr = JSON.parse(e.target.result);
            // console.log(e);
            // console.log(jsonStr);
            // console.log(JSON.parse(JSON.stringify(jsonStr)));
            if (jsonStr && jsonStr != null) {
                formik.setFieldValue(field, jsonStr.features[0].geometry);
            }
        };
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                autoFocus
                                fullWidth
                                margin="dense"
                                id="codigoRuta"
                                name="codigoRuta"
                                label="Codigo Ruta"
                                value={formik.values.codigoRuta}
                                onChange={formik.handleChange}
                                error={formik.touched.codigoRuta && Boolean(formik.errors.codigoRuta)}
                                helperText={formik.touched.codigoRuta && formik.errors.codigoRuta}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                id="nombreRuta"
                                name="nombreRuta"
                                label="Nombre Ruta"
                                value={formik.values.nombreRuta}
                                onChange={formik.handleChange}
                                error={formik.touched.nombreRuta && Boolean(formik.errors.nombreRuta)}
                                helperText={formik.touched.nombreRuta && formik.errors.nombreRuta}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                id="glosaRuta"
                                name="glosaRuta"
                                label="Glosa Ruta"
                                value={formik.values.glosaRuta}
                                onChange={formik.handleChange}
                                error={formik.touched.glosaRuta && Boolean(formik.errors.glosaRuta)}
                                helperText={formik.touched.glosaRuta && formik.errors.glosaRuta}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                id="detalleRuta"
                                name="detalleRuta"
                                label="Detalle Ruta"
                                value={formik.values.detalleRuta}
                                onChange={formik.handleChange}
                                error={formik.touched.detalleRuta && Boolean(formik.errors.detalleRuta)}
                                helperText={formik.touched.detalleRuta && formik.errors.detalleRuta}
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
                                            {!jsonIsValid(formik.values.geom12) &&
                                                <Button variant="outlined" fullWidth endIcon={<Delete />} onClick={() => formik.setFieldValue(GEOM_1_2, '')}>Eliminar sentido 1→2</Button>
                                            }
                                            {jsonIsValid(formik.values.geom12) &&
                                                <label htmlFor="adjuntar-sentido-1-2" >
                                                    <Input accept=".geojson" id="adjuntar-sentido-1-2" type="file" onChange={(e) => handleChangeFile(e, GEOM_1_2)} />
                                                    <Button variant="outlined" fullWidth component="span" endIcon={<UploadFile />}>
                                                        Adjuntar sentido 1→2
                                                    </Button>
                                                </label>
                                            }
                                        </Grid>
                                        <Grid item xs={6}>
                                            {!jsonIsValid(formik.values.geom21) &&
                                                <Button variant="outlined" fullWidth endIcon={<Delete />} onClick={() => formik.setFieldValue(GEOM_2_1, '')}>Eliminar sentido ruta 2→1</Button>
                                            }
                                            {jsonIsValid(formik.values.geom21) &&
                                                <label htmlFor="adjuntar-sentido-2-1" >
                                                    <Input accept=".geojson" id="adjuntar-sentido-2-1" type="file" onChange={(e) => handleChangeFile(e, GEOM_2_1)} />
                                                    <Button variant="outlined" fullWidth component="span" endIcon={<UploadFile />}>
                                                        Adjuntar sentido 2→1
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
                            {formik.values.geom12 != null && <GeoJSON data={formik.values.geom12} style={STYLE_GEOM_1_2}></GeoJSON>}
                            {formik.values.geom21 != null && <GeoJSON data={formik.values.geom21} style={STYLE_GEOM_2_1}></GeoJSON>}
                            {/* <Geoman setGeom={setGeom} geom12={formik.values.geom12} geom21={formik.values.geom21}  /> */}

                        </Map>
                    </Grid>

                </Grid>
            </Box>
        </>
    );
}