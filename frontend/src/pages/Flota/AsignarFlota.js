import { useFormik } from 'formik';
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import RutaService from '../../services/RutaService';
import FlotaService from '../../services/FlotaService';

const validationSchema = yup.object({
    idRuta: yup
        .string('Ingresa la placa del vehiculo')
        .required('Placa del vehiculo es requerido'),
});

export default function AsignarFlota({ formulario, initialValues, onSuccess, onError }) {
    
    const { flotaId } = useParams();
    const [asignarRutas, setAsignarRutas] = useState([]);
    console.log(flotaId);
    useEffect(() => {
        const getRutas = async () => {
            const rutas = await RutaService.getAll();
            setAsignarRutas(rutas.data);
        };
        getRutas();
    }, []);

    const formik = useFormik({
        initialValues: {
            idFlotaVehiculos: initialValues?.idFlotaVehiculos || '',
            idRuta: initialValues?.idRuta || '',
            idEtt: initialValues?.idEtt || '',
            placaVehiculo: initialValues?.placaVehiculo || ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            postAsignarRuta({
                ...values,
                idEtt: flotaId
            });
        },
    });

    const postAsignarRuta = async (body) => {
        try {
            const res = await FlotaService.putRuta(body);
            onSuccess(res.data);
        } catch (error) {
            onError(error);
        }
    }
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="ruta">Ruta </InputLabel>
                    <Select
                        defaultValue={formik.values.idRuta}
                        labelId="ruta"
                        id="idRuta"
                        name="idRuta"
                        label="Ruta"
                        onChange={formik.handleChange}
                        error={formik.touched.idTipoVehiculo && Boolean(formik.errors.idTipoVehiculo)}
                    >
                        {asignarRutas.map(ruta => {
                            return (
                                <MenuItem value={ruta.idRuta}>{ruta.idRuta} - {ruta.codigoRuta} - {ruta.nombreRuta}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}