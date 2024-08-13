import { useFormik } from 'formik';

import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AlertaService from '../../services/AlertaService';
import { CREAR_ALERTA } from './AlertasAdmin'

const validationSchema = yup.object({
    nombreAlerta: yup
        .string('Ingresa un nombre para la alerta')
        .required('Nombre de alerta es requerido'),
    tituloAlerta: yup
        .string('Ingrese un titulo para la alerta')
        .required('Titulo es requerido'),
    descripcionAlerta: yup
        .string('Ingresa una descripcion de la alerta')
        .required('Descripción es requerido'),
    glosaAlerta: yup
        .string('Ingresa un glosa para la alerta')
        .required('Valor es requerido'),
});

export default function CrearAlerta({ formulario, initialValues, onSuccess, onError }) {
    const formik = useFormik({
        initialValues: {
            idAlerta: initialValues?.idAlerta || 0,
            nombreAlerta: initialValues?.nombreAlerta || '',
            tituloAlerta: initialValues?.tituloAlerta || '',
            descripcionAlerta: initialValues?.descripcionAlerta || '',
            glosaAlerta: initialValues?.glosaAlerta || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            postAlerta(values);
            // console.log(values);
        },
    });

    const postAlerta = async (body) => {
        try {
            const res = formulario === CREAR_ALERTA ? await AlertaService.post(body) : await AlertaService.put(body);
            onSuccess(res.data);
            // console.log(res.data);
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
                    id="nombreAlerta"
                    name="nombreAlerta"
                    label="Nombre"
                    value={formik.values.nombreAlerta}
                    onChange={formik.handleChange}
                    error={formik.touched.nombreAlerta && Boolean(formik.errors.nombreAlerta)}
                    helperText={formik.touched.nombreAlerta && formik.errors.nombreAlerta}
                />
                {/* <TextField
                    fullWidth
                    margin="dense"
                    id="tituloAlerta"
                    name="tituloAlerta"
                    label="Titulo"
                    value={formik.values.tituloAlerta}
                    onChange={formik.handleChange}
                    error={formik.touched.tituloAlerta && Boolean(formik.errors.tituloAlerta)}
                    helperText={formik.touched.tituloAlerta && formik.errors.tituloAlerta}
                /> */}
                {/* <TextField
                    fullWidth
                    margin="dense"
                    id="descripcionAlerta"
                    name="descripcionAlerta"
                    label="Descripcion"
                    value={formik.values.descripcionAlerta}
                    onChange={formik.handleChange}
                    error={formik.touched.descripcionAlerta && Boolean(formik.errors.descripcionAlerta)}
                    helperText={formik.touched.descripcionAlerta && formik.errors.descripcionAlerta}
                /> */}
                <TextField
                    fullWidth
                    margin="dense"
                    id="glosaAlerta"
                    name="glosaAlerta"
                    label="Glosa"
                    value={formik.values.glosaAlerta}
                    onChange={formik.handleChange}
                    error={formik.touched.glosaAlerta && Boolean(formik.errors.glosaAlerta)}
                    helperText={formik.touched.glosaAlerta && formik.errors.glosaAlerta}
                />
                {/* <TextField
                    fullWidth
                    margin="dense"
                    id="accionAlerta"
                    name="accionAlerta"
                    label="Acción"
                    value={formik.values.accionAlerta}
                    onChange={formik.handleChange}
                    error={formik.touched.accionAlerta && Boolean(formik.errors.accionAlerta)}
                    helperText={formik.touched.accionAlerta && formik.errors.accionAlerta}
                /> */}
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}