import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ObrasService from '../../services/ObraService';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { CREAR_OBRA } from './Obras';
import FormControl from '@mui/material/FormControl';

const validationSchema = yup.object({
    nombre: yup
        .string('Ingresa un nombre para la obra')
        .required('Nombre es requerido'),
    direccion: yup
        .string('Ingresa una dirección de la obra')
        .min(4, 'La dirección debe tener al menos 4 caracteres')
        .required('descripcion es requerido'),
    distrito: yup
        .string('Ingresa un valor para el distrito')
        .required('distrito es requerido'),
});

export default function CrearObras({ formulario, initialValues, onSuccess, onError }) {
    const formik = useFormik({
        initialValues: {
            id: initialValues?.id || 0,
            nombre: initialValues?.nombre || '',
            direccion: initialValues?.direccion || '',
            distrito: initialValues?.distrito || '',
            estado: initialValues?.estado || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // console.log('parametros',values);
            postParametro(values);
        },
    });

    const postParametro = async (body) => {
        try {
            const res = formulario === CREAR_OBRA ? await ObrasService.post(body) : await ObrasService.put(body);
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
                    id="nombre"
                    name="nombre"
                    label="Nombre"
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                    helperText={formik.touched.nombre && formik.errors.nombre}
                />
                <TextField
                    fullWidth
                    multiline
                    margin="dense"
                    rows={4}
                    id="direccion"
                    name="direccion"
                    label="Dirección"
                    value={formik.values.direccion}
                    onChange={formik.handleChange}
                    error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                    helperText={formik.touched.direccion && formik.errors.direccion}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="distrito"
                    name="distrito"
                    label="Distrito"
                    value={formik.values.distrito}
                    onChange={formik.handleChange}
                    error={formik.touched.distrito && Boolean(formik.errors.distrito)}
                    helperText={formik.touched.distrito && formik.errors.distrito}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="estado">Estado Obra</InputLabel>
                    <Select
                        defaultValue={formik.values.estado}
                        labelId="estado"
                        id="estado"
                        name="estado"
                        label="Estado"
                        onChange={formik.handleChange}
                    >
                        <MenuItem value={'ACTIVO'}>Activo</MenuItem>
                        <MenuItem value={'INACTIVO'}>Inactivo</MenuItem>
                    </Select>
                    {formik.errors.estado}
                </FormControl>
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}