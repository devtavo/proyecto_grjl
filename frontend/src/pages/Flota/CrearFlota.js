import { useFormik ,ErrorMessage } from 'formik';

import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import FlotaService from '../../services/FlotaService';
import { CREAR_VEHICULO_FLOTA } from './Flotas';

const validationSchema = yup.object({
    placaVehiculo: yup
        .string('Ingresa la placa del vehiculo')
        .max(6, 'Demasiados caracteres Máximo 6')
        .min(6, 'Pocos caracteres Mínimo 6 ')
        .required('Placa del vehiculo es requerido'),
    idEstadoVehiculo: yup
        .string('Debe seleccionar el estado del vehiculo')
        .required('Estado del vehiculo es requerido'),
    vencimientoSoat: yup
    .string('Debe ingresar la fecha dd/mm/yyyy')
    .required('Fecha de vencimiento de SOAT es requerido'),
    codigoSoat: yup
    .string('Debe ingresar el Código SOAT')
    .required('Código SOAT es requerido')
    .min(4, 'Pocos caracteres Mínimo 4')

});

export default function CrearFlota({ formulario, initialValues, onSuccess, onError }) {
    const formik = useFormik({
        initialValues: {
            idEtt: initialValues?.idEtt || 0,
            placaVehiculo: initialValues?.placaVehiculo || '',
            codigoSoat: initialValues?.codigoSoat || '',
            afabricacionVehiculo: initialValues?.afabricacionVehiculo || '',
            idTipoVehiculo: initialValues?.idTipoVehiculo || '',
            idEstadoVehiculo: initialValues?.idEstadoVehiculo || 1,
            vencimientoSoat: initialValues?.vencimientoSoat || '',
            pasajeros: initialValues?.nAsientos || '',
            asientos: initialValues?.nPasajeros || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            postFlota(values);
        },
    });

    const postFlota = async (body) => {
        try {
            const res = formulario === CREAR_VEHICULO_FLOTA ? await FlotaService.post(body) : await FlotaService.put(body);
            if(res.data.mgs=='ok'){
                onError('Placa duplicada para esta empresa')
            }else{
                onSuccess(res.data);
            }
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
                    disabled={formulario === CREAR_VEHICULO_FLOTA ? false : true}
                    margin="dense"
                    id="placaVehiculo"
                    name="placaVehiculo"
                    label="Placa Vehículo"
                    value={formik.values.placaVehiculo}
                    onChange={formik.handleChange}
                    error={formik.touched.placaVehiculo && Boolean(formik.errors.placaVehiculo)}
                    helperText={formik.touched.placaVehiculo && formik.errors.placaVehiculo}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="codigoSoat"
                    name="codigoSoat"
                    label="Cod. Soat"
                    value={formik.values.codigoSoat}
                    onChange={formik.handleChange}
                    error={formik.touched.codigoSoat && Boolean(formik.errors.codigoSoat)}
                    helperText={formik.touched.codigoSoat && formik.errors.codigoSoat}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="vencimientoSoat"
                    name="vencimientoSoat"
                    label="SOAT Fecha Vencimiento - dd/mm/yyyy"
                    value={formik.values.vencimientoSoat}
                    onChange={formik.handleChange}
                    error={formik.touched.vencimientoSoat && Boolean(formik.errors.vencimientoSoat)}
                    helperText={formik.touched.vencimientoSoat && formik.errors.vencimientoSoat}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="eVehiculo" >Estado Vehículo</InputLabel>
                    <Select
                        defaultValue={formik.values.idEstadoVehiculo}
                        labelId="eVehiculo"
                        id="idEstadoVehiculo"
                        name="idEstadoVehiculo"
                        label="Estadp Vehículo"
                        onChange={formik.handleChange}
                        error={formik.touched.idEstadoVehiculo && Boolean(formik.errors.idEstadoVehiculo)}
                        helperText={formik.touched.idEstadoVehiculo && formik.errors.idEstadoVehiculo}
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