import { useState, useEffect, useParams } from "react";
import BasicTable from '../../components/Table/Table';
import RutaService from '../../services/RutaService';
import useStyle from './style';
import Stack from '@mui/material/Stack';

import { useFormik } from 'formik';
import * as yup from 'yup';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import EettService from '../../services/EettService';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

export const CREAR_EMPRESA = 'CREAR_EMPRESA';
export const EDITAR_EMPRESA = 'EDITAR_EMPRESA';

const validationSchema = yup.object({
    comprobante: yup
        .string('Debe ingresar el comprobante')
        .min(4, 'Pocos caracteres Mínimo 4 ')
        .required('Comprobante es requerido'),
    cantidad: yup
        .string('Debe ingresar la cantidad')
        .required('La cantidad es requerida requerido'),
    monto: yup
    .string('Debe ingresar el monto')
    .required('Monto en soles es requerido')

});

export default function CrearComprobante({  formulario, initialValues, onSuccess, onError } ) {
    const formik = useFormik({
        initialValues: {
            id: initialValues?.id || 0,
            idEtt: initialValues?.idEtt || 0,
            cantidad: initialValues?.cantidad || 0,
            monto: initialValues?.monto || 0,
            comprobante: initialValues?.comprobante || '',
            estado: initialValues?.estado || 1,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            postComprobante(values);
            // console.log(values)
        },
    });

    const postComprobante = async (body) => {
        try {
            const res = formulario === CREAR_EMPRESA ? await EettService.postViaje(body) : await EettService.putViaje(body);
            onSuccess(res.data);
        } catch (error) {
            onError(error);
        }
    }

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    margin="dense"
                    id="comprobante"
                    name="comprobante"
                    
                    label="Comprobante"
                    value={formik.values.comprobante}
                    onChange={formik.handleChange}
                    error={formik.touched.comprobante && Boolean(formik.errors.comprobante)}
                    helperText={formik.touched.comprobante && formik.errors.comprobante}
                />
                <TextField
                    autoFocus
                    fullWidth
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                    margin="dense"
                    id="cantidad"
                    name="cantidad"
                    label="Cantidad"
                    value={formik.values.cantidad}
                    onChange={formik.handleChange}
                    error={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
                    helperText={formik.touched.cantidad && formik.errors.cantidad}
                />
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="monto"
                    inputProps={{ inputMode: 'numeric'}} 
                    name="monto"
                    label="monto"
                    value={formik.values.monto}
                    onChange={formik.handleChange}
                    error={formik.touched.monto && Boolean(formik.errors.monto)}
                    helperText={formik.touched.monto && formik.errors.monto}
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
                </FormControl>
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}