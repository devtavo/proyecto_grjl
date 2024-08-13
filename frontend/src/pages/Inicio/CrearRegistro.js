import { useFormik } from 'formik';
import { styled } from '@mui/material/styles';
import RegistrosService from '../../services/RegistrosService';
import { useState, useEffect, useParams } from "react";

import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CREAR_REGISTRO } from './Inicio';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import { CardActionArea } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EettService from '../../services/EettService';


const Input = styled('input')({
    display: 'none',
});

const validationSchema = yup.object({
    placa: yup
        .string('Ingresa una placa')
        .required('La placa es requerido')
});

export default function CrearRegistro({ formulario, initialValues, onSuccess, onError }) {
    console.log(initialValues)
    const [empresas, setEmpresas] = useState([]);
    const user = JSON.parse(localStorage.getItem('user')).idEtt;

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await EettService.getAll(user);
            setEmpresas(empresas.data);
        };
        getEmpresas();
    }, []);

    const useSt = makeStyles((theme) => ({
        cardstyle: {
            marginTop: theme.spacing(0),
            margin: 'auto',
            textAlign: 'center',
            flexDirection: 'column',

        },
        imgCard: {
            paddingTop: "76px",
            paddingLeft: "146px",
            paddingRight: "135px",
            height: 140
        },
        categoria: {
            paddingBottom: 0,
            color: '000000',
            letterSpacing: 1,
            fontWeight: 600,
            marginLeft: 300,
            marginTop: 20,
            fontSize: 25,
            fontStyle: 'SemiBold'
        },
        card: {
            boxShadow: "0px 4px 4px 4px rgb(223,223,223, 0.25)",
            height: 283,
            backgroundColor: '#ffffff',
            "&:hover": {
                backgroundColor: '#ffffff',
                boxShadow: "0px 4px 20px 0px rgb(0,0,0,0.2)",
            },
        },
        cardAction: {
            color: '#fff',
        },
        cardTitulo: {
            color: '#DA1C23',
            textAlign: 'center',
            fontSize: '22px',

        },
        descripcion: {
            color: '#00000099',

            textAlign: 'center',
            whiteSpace: 'wrap'

        },
        container: {
            whiteSpace: 'wrap',
            lineHeight: '5',
        }
    }));
    var classes = useSt();
    const formik = useFormik({
        initialValues: {
            id: initialValues?.id || '',
            placa: initialValues?.placa || '',
            tipo: initialValues?.tipo || '',
            tipoColor: initialValues?.tipoColor || '',
            estado: initialValues?.estado || '',
            autorizado: initialValues?.autorizado || '',
            foto: initialValues.foto || '',
            fotoContexto: initialValues.fotoContexto || '',
            idRazonSocial: initialValues.idRazonSocial || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log("submit", values);
            postRuta({
                ...values
            });
        },
    });

    const postRuta = async (body) => {
        try {
            const res = formulario === CREAR_REGISTRO ? await RegistrosService.post(body) : await RegistrosService.put(body);
            onSuccess(res.data);
        } catch (error) {
            onError(error);
        }
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={formulario === CREAR_REGISTRO ? 12 : initialValues.origen === 'M' ? 12 : 6}>
                        <form onSubmit={formik.handleSubmit}>
                            {formulario === CREAR_REGISTRO ? null : <TextField
                                autoFocus
                                fullWidth
                                margin="dense"
                                id="id"
                                name="id"
                                label="Identificador"
                                value={formik.values.id}
                                disabled='true'
                                onChange={formik.handleChange}
                                error={formik.touched.id && Boolean(formik.errors.id)}
                                helperText={formik.touched.id && formik.errors.id}
                            />}
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="idRazonSocial">Razon Social Empresa</InputLabel>
                                <Select
                                    defaultValue={formik.values.idRazonSocial}
                                    labelId="idRazonSocial"
                                    id="idRazonSocial"
                                    name="idRazonSocial"
                                    label="Razon Social Empresa"
                                    onChange={formik.handleChange}
                                >
                                    {empresas.map((e, index) => {
                                        return (
                                            <MenuItem key={index} value={e.razonSocialEmpresa}>{e.razonSocialEmpresa}</MenuItem>
                                        )
                                    })}
                                </Select>
                                {formik.errors.idRazonSocial}
                            </FormControl>
                            <TextField
                                autoFocus
                                fullWidth
                                margin="dense"
                                id="placa"
                                name="placa"
                                label="Placa Vehiculo"
                                value={formik.values.placa}
                                onChange={formik.handleChange}
                                error={formik.touched.placa && Boolean(formik.errors.placa)}
                                helperText={formik.touched.placa && formik.errors.placa}
                            />

                            <FormControl fullWidth margin="dense">
                                <InputLabel id="tipo">Tipo</InputLabel>
                                <Select
                                    defaultValue={formik.values.tipo}
                                    labelId="tipo"
                                    id="tipo"
                                    name="tipo"
                                    label="Tipo"
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value={1}>Disposicion</MenuItem>
                                    <MenuItem value={2}>Chancadora</MenuItem>
                                </Select>
                                {formik.errors.tipo}
                            </FormControl>
                            <TextField
                                fullWidth
                                margin="dense"
                                id="tipoColor"
                                name="tipoColor"
                                label="Tipo/Color"
                                value={formik.values.tipoColor}
                                onChange={formik.handleChange}
                                error={formik.touched.tipoColor && Boolean(formik.errors.tipoColor)}
                                helperText={formik.touched.tipoColor && formik.errors.tipoColor}
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="autorizado">Autorizado</InputLabel>
                                <Select
                                    defaultValue={formik.values.autorizado}
                                    labelId="autorizado"
                                    id="autorizado"
                                    name="autorizado"
                                    label="autorizado"
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value={'SI'}>SI</MenuItem>
                                    <MenuItem value={'NO'}>NO</MenuItem>
                                </Select>
                                {formik.errors.autorizado}
                            </FormControl>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="estado">Etapa</InputLabel>
                                <Select
                                    defaultValue={formik.values.estado}
                                    labelId="estado"
                                    id="estado"
                                    name="estado"
                                    label="estado"
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value={'I'}>Ingreso</MenuItem>
                                    <MenuItem value={'O'}>Operacion</MenuItem>
                                    <MenuItem value={'S'}>Salida</MenuItem>
                                </Select>
                                {formik.errors.estado}
                            </FormControl>

                            <Button color="primary" variant="contained" fullWidth type="submit">
                                Guardar
                            </Button>

                        </form>
                    </Grid>
                    <Grid item xs={6} style={formulario === CREAR_REGISTRO ? { display: 'none' } : initialValues.origen === 'M' ? { display: 'none' } : {}}>
                        <Card >
                            <CardHeader title="Foto Contexto" style={{ fontWeight: '500', fontSize: '16px' }} />
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="auto"
                                    width="auto"
                                    image={formik.values.fotoContexto}
                                />
                            </CardActionArea>
                        </Card>
                        <br />
                        <Card >
                            <CardHeader title="Foto de Placa" />
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="auto"
                                    width="auto"
                                    image={formik.values.foto}
                                />
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}