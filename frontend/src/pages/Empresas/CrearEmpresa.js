import { useFormik } from 'formik';

import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import EettService from '../../services/EettService';
import { CREAR_EMPRESA } from './Empresas'

const validationSchema = yup.object({
    rucEtt: yup
        .string('Ingresa el ruc de la empresa')
        .min(11, 'La ruc debe tener al menos 11 caracteres')
        .max(11, "El ruc debe tener 11 números")
        .required('Ruc es requerido'),
    razonSocialEmpresa: yup
        .string('Ingresa la Razón social')
        .required('Rázon social es requerido'),
});

export default function CrearEmpresa({ formulario, initialValues, onSuccess, onError }) {
    const formik = useFormik({
        initialValues: {
            id: initialValues?.id || 0,
            rucEtt: initialValues?.rucEtt || '',
            razonSocialEmpresa: initialValues?.razonSocialEmpresa || '',
            direccion: initialValues?.direccion || '',
            telefono: initialValues?.direccion || '',
            correo: initialValues?.correo || '',
            idEstadoEtt: initialValues?.idEstadoEtt || '',
            tipo: initialValues?.tipo || '',
            viajes: initialValues?.viajes || ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            postEmpresa(values);
            // console.log(values)
        },
    });

    const postEmpresa = async (body) => {
        try {
            const res = formulario === CREAR_EMPRESA ? await EettService.post(body) : await EettService.put(body);
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
                    id="rucEtt"
                    name="rucEtt"
                    label="Ruc"
                    value={formik.values.rucEtt}
                    onChange={formik.handleChange}
                    error={formik.touched.rucEtt && Boolean(formik.errors.rucEtt)}
                    helperText={formik.touched.rucEtt && formik.errors.rucEtt}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="razonSocialEmpresa"
                    name="razonSocialEmpresa"
                    label="Razón Social"
                    value={formik.values.razonSocialEmpresa}
                    onChange={formik.handleChange}
                    error={formik.touched.razonSocialEmpresa && Boolean(formik.errors.razonSocialEmpresa)}
                    helperText={formik.touched.razonSocialEmpresa && formik.errors.razonSocialEmpresa}
                />
                <TextField
                    fullWidth
                    multiline
                    margin="dense"
                    id="direccion"
                    name="direccion"
                    label="Dirección"
                    rows={3}
                    value={formik.values.direccion}
                    onChange={formik.handleChange}
                    error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                    helperText={formik.touched.direccion && formik.errors.direccion}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="telefono"
                    name="telefono"
                    label="Telefono"
                    value={formik.values.telefono}
                    onChange={formik.handleChange}
                    error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                    helperText={formik.touched.telefono && formik.errors.telefono}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="correo"
                    name="correo"
                    label="Correo"
                    value={formik.values.correo}
                    onChange={formik.handleChange}
                    error={formik.touched.correo && Boolean(formik.errors.correo)}
                    helperText={formik.touched.correo && formik.errors.correo}
                />
                <TextField
                    disabled
                    fullWidth
                    margin="dense"
                    id="viajes"
                    name="viajes"
                    label="Saldo Viajes"
                    value={formik.values.viajes <=0 ? '0' : formik.values.viajes}
                    onChange={formik.handleChange}
                    error={formik.touched.viajes && Boolean(formik.errors.viajes)}
                    helperText={formik.touched.viajes && formik.errors.viajes}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="tipo">Tipo Operación</InputLabel>
                    <Select
                        defaultValue={formik.values.tipo}
                        labelId="tipo"
                        id="tipo"
                        name="tipo"
                        label="tipo"
                        onChange={formik.handleChange}
                    >
                        <MenuItem value={'chancadora'}>Chancadora</MenuItem>
                        <MenuItem value={'disposicion'}>Disposición</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="estado">Estado</InputLabel>
                    <Select
                        defaultValue={formik.values.idEstadoEtt}
                        labelId="estado"
                        id="idEstadoEtt"
                        name="idEstadoEtt"
                        label="Estado"
                        onChange={formik.handleChange}
                    >
                        <MenuItem value={1}>Activo</MenuItem>
                        <MenuItem value={2}>Inactivo</MenuItem>
                    </Select>
                </FormControl>
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}