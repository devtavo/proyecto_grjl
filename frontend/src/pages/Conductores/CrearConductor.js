import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import ConductorService from '../../services/ConductorService';
import { CREAR_CONDUCTOR } from './Conductores';
import EettService from '../../services/EettService';

const today = new Date();

const validationSchema = yup.object({
    numeroLicencia: yup
        .string('Número de licencia es requerido')
        .required('Número de licencia es requerido'),
    apellidoPaterno: yup
        .string('Apellido paterno es requerido')
        .required('Apellido paterno es requerido'),
    apellidoMaterno: yup
        .string('Apellido materno es requerido')
        .required('Apellido materno es requerido'),
    nombresCompletos: yup
        .string('Nombres completos es requerido')
        .required('Nombres completos es requerido'),
    clase: yup
        .string('Clase es requerido')
        .required('Clase es requerido'),
    categoria: yup
        .string('Categoría es requerido')
        .required('Categoría es requerido'),
    fechaExpedicion: yup
        .string('Fecha de expedición es requerido')
        .required('Fecha de expedición es requerido'),
    fechaRevalidacion: yup
        .string('Fecha de revalidación es requerido')
        .required('Fecha de revalidación es requerido'),
});

export default function CrearConductor({ formulario, initialValues, onSuccess, onError }) {
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await EettService.getAll();
            setEmpresas(empresas.data);
        };
        getEmpresas();
    }, []);

    const formik = useFormik({
        initialValues: {
            idConductor: initialValues?.idConductor || 0,
            numeroLicencia: initialValues?.numeroLicencia || '',
            apellidoPaterno: initialValues?.apellidoPaterno || '',
            apellidoMaterno: initialValues?.apellidoMaterno || '',
            nombresCompletos: initialValues?.nombresCompletos || '',
            clase: initialValues?.clase || '',
            categoria: initialValues?.categoria || '',
            fechaExpedicion: initialValues?.fechaExpedicion || '',
            fechaRevalidacion: initialValues?.fechaRevalidacion || '',
            idEtt: initialValues?.idEtt || 0
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            postSancion(values);
        },
    });


    const postSancion = async (body) => {
        try {
            const res = formulario === CREAR_CONDUCTOR ? await ConductorService.post(body) : await ConductorService.put(body);
            onSuccess(res.data);
        } catch (error) {
            onError(error);
        }
    }

    return (
        <>
            <form onSubmit={formik.handleSubmit}>

                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="numeroLicencia"
                    name="numeroLicencia"
                    label="Nro. Licencia"
                    value={formik.values.numeroLicencia}
                    onChange={formik.handleChange}
                    error={formik.touched.numeroLicencia && Boolean(formik.errors.numeroLicencia)}
                    helperText={formik.touched.numeroLicencia && formik.errors.numeroLicencia}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="apellidoPaterno"
                    name="apellidoPaterno"
                    label="Apellido Paterno"
                    value={formik.values.apellidoPaterno}
                    onChange={formik.handleChange}
                    error={formik.touched.apellidoPaterno && Boolean(formik.errors.apellidoPaterno)}
                    helperText={formik.touched.apellidoPaterno && formik.errors.apellidoPaterno}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="apellidoMaterno"
                    name="apellidoMaterno"
                    label="Apellido Materno"
                    value={formik.values.apellidoMaterno}
                    onChange={formik.handleChange}
                    error={formik.touched.apellidoMaterno && Boolean(formik.errors.apellidoMaterno)}
                    helperText={formik.touched.apellidoMaterno && formik.errors.apellidoMaterno}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="nombresCompletos"
                    name="nombresCompletos"
                    label="Nombres"
                    value={formik.values.nombresCompletos}
                    onChange={formik.handleChange}
                    error={formik.touched.nombresCompletos && Boolean(formik.errors.nombresCompletos)}
                    helperText={formik.touched.nombresCompletos && formik.errors.nombresCompletos}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="clase"
                    name="clase"
                    label="Clase"
                    value={formik.values.clase}
                    onChange={formik.handleChange}
                    error={formik.touched.clase && Boolean(formik.errors.clase)}
                    helperText={formik.touched.clase && formik.errors.clase}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="categoria"
                    name="categoria"
                    label="Categoría"
                    value={formik.values.categoria}
                    onChange={formik.handleChange}
                    error={formik.touched.categoria && Boolean(formik.errors.categoria)}
                    helperText={formik.touched.categoria && formik.errors.categoria}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="fechaExpedicion"
                    name="fechaExpedicion"
                    label="Fecha de expedición"
                    value={formik.values.fechaExpedicion}
                    onChange={formik.handleChange}
                    error={formik.touched.fechaExpedicion && Boolean(formik.errors.fechaExpedicion)}
                    helperText={formik.touched.fechaExpedicion && formik.errors.fechaExpedicion}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="fechaRevalidacion"
                    name="fechaRevalidacion"
                    label="Fecha de revalidación"
                    value={formik.values.fechaRevalidacion}
                    onChange={formik.handleChange}
                    error={formik.touched.fechaRevalidacion && Boolean(formik.errors.fechaRevalidacion)}
                    helperText={formik.touched.fechaRevalidacion && formik.errors.fechaRevalidacion}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="idEtt">Empresa autorizada</InputLabel>
                    <Select
                        defaultValue={formik.values.idEtt}
                        labelId="idEtt"
                        id="idEtt"
                        name="idEtt"
                        label="Empresa autorizada"
                        onChange={formik.handleChange}
                    >
                        {empresas.map(ett => {
                            return (
                                <MenuItem value={ett.idEtt}>{ett.razonSocialEmpresa}</MenuItem>
                            )
                        })
                        }
                    </Select>
                    {formik.errors.idEtt}
                </FormControl>
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}