import { useFormik } from 'formik';

import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ParametroService from '../../services/ParametroService';
import { CREAR_PARAMETRO } from './Parametros';

const validationSchema = yup.object({
    nombreParametro: yup
        .string('Ingresa un nombre para el parámetro')
        .required('Nombre de parámetro es requerido'),
    glosaParametro: yup
        .string('Ingresa una glosa para el parámetro')
        .min(4, 'La glosa debe tener al menos 4 caracteres')
        .required('Glosa es requerido'),
    valorParametro: yup
        .string('Ingresa un valor para el parámetro')
        .required('Valor es requerido'),
});

export default function CrearParametro({ formulario, initialValues, onSuccess, onError }) {
    const formik = useFormik({
        initialValues: {
            idParametro: initialValues?.idParametro || 0,
            nombreParametro: initialValues?.nombreParametro || '',
            glosaParametro: initialValues?.glosaParametro || '',
            valorParametro: JSON.stringify(initialValues?.valorParametro) || '', 
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // console.log('parametros',values);
            postParametro(values);
        },
    });

    const postParametro = async (body) => {
        try {
            const res = formulario === CREAR_PARAMETRO ? await ParametroService.post(body) : await ParametroService.put(body);
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
                    id="nombreParametro"
                    name="nombreParametro"
                    label="Nombre"
                    value={formik.values.nombreParametro}
                    onChange={formik.handleChange}
                    error={formik.touched.nombreParametro && Boolean(formik.errors.nombreParametro)}
                    helperText={formik.touched.nombreParametro && formik.errors.nombreParametro}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="glosaParametro"
                    name="glosaParametro"
                    label="Glosa"
                    value={formik.values.glosaParametro}
                    onChange={formik.handleChange}
                    error={formik.touched.glosaParametro && Boolean(formik.errors.glosaParametro)}
                    helperText={formik.touched.glosaParametro && formik.errors.glosaParametro}
                />
                <TextField
                    fullWidth
                    multiline
                    margin="dense"
                    id="valorParametro"
                    name="valorParametro"
                    label="Valor"
                    rows={4}
                    value={formik.values.valorParametro}
                    onChange={formik.handleChange}
                    error={formik.touched.valorParametro && Boolean(formik.errors.valorParametro)}
                    helperText={formik.touched.valorParametro && formik.errors.valorParametro}
                />
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}