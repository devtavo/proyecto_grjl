import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ConstructoraService from '../../services/ConstructoraService';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { CREAR_CONSTRUCTORA } from './Constructora';
import FormControl from '@mui/material/FormControl';

const validationSchema = yup.object({
    rucConstructora: yup
        .string('Ingresa el ruc de la Constructora')
        .min(11, 'La ruc debe tener al menos 11 caracteres')
        .max(11, "El ruc debe tener 11 números")
        .required('Ruc es requerido'),
    constructora: yup
        .string('Ingresa la Razón social')
        .required('Rázon social es requerido'),
    estado: yup
        .string('Ingresa un valor para el Estado de la Constructora')
        .required('Estado es requerido'),
});

export default function CrearConstructora({ formulario, initialValues, onSuccess, onError }) {
    const formik = useFormik({
        initialValues: {
            id: initialValues?.id || 0,
            constructora: initialValues?.constructora || '',
            rucConstructora: initialValues?.rucConstructora || '',
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
            const res = formulario === CREAR_CONSTRUCTORA ? await ConstructoraService.post(body) : await ConstructoraService.put(body);
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
                    id="constructora"
                    name="constructora"
                    label="Constructora"
                    value={formik.values.constructora}
                    onChange={formik.handleChange}
                    error={formik.touched.constructora && Boolean(formik.errors.constructora)}
                    helperText={formik.touched.constructora && formik.errors.constructora}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="rucConstructora"
                    name="rucConstructora"
                    label="RUC"
                    value={formik.values.rucConstructora}
                    onChange={formik.handleChange}
                    error={formik.touched.rucConstructora && Boolean(formik.errors.rucConstructora)}
                    helperText={formik.touched.rucConstructora && formik.errors.rucConstructora}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="estado">Estado Constructora</InputLabel>
                    <Select
                        defaultValue={formik.values.estado}
                        labelId="estado"
                        id="estado"
                        name="estado"
                        label="Estado"
                        onChange={formik.handleChange}
                    >
                        <MenuItem value={'A'}>Activo</MenuItem>
                        <MenuItem value={'I'}>Inactivo</MenuItem>
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