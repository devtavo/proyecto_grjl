import { useState } from "react";
import { useFormik } from 'formik';

import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EmvService from '../../services/EmvService';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import RefreshIcon from '@mui/icons-material/Refresh';
import ConfirmDialog from '../../components/Dialog/ConfirmDialog';
import Notification from '../../components/Notification/Notification';

import { CREAR_EMV, EDITAR_EMV } from './Emv';

const validationSchema = yup.object({
    razonSocial: yup
        .string('Ingresa correctamente la razón social')
        .required('La Razón Social es requerida'),
    glosaEmpresa: yup
        .string('Ingresa una glosa para la Empresa')
        .required('Glosa es requerido'),
    ruc: yup
        .string('Ingrese el RUC de la empresa')
        .required('Ruc es requerido'),
    direccion: yup
        .string('Ingresa la dirección')
        .required('Direccion es requerido'),
    correo: yup
        .string('Ingresa un correo valido')
        .required('Correo es requerido'),
    idEstadoEmpresa: yup
        .string('Seleccione el estado de la empresa')
        .required('Estado EMV es  requerido'),
});

export default function CrearEmv({ formulario, initialValues, onSuccess, onError }) {
    const [snack, setSnack] = useState({
        open: false,
        message: 'Token actualizado correctamente',
        severity: 'success'
    });
    const [dialog, setDialog] = useState({
        open: false,
        title: 'Desea volver a generar el token?',
        description: 'El token anterior quedará invalidado y la emv deberá autenticar con el nuevo token'
    });

    const formik = useFormik({
        initialValues: {
            idEmv: initialValues?.idEmv || 0,
            razonSocial: initialValues?.razonSocial || '',
            glosaEmpresa: initialValues?.glosaEmpresa || '',
            ruc: initialValues?.ruc || '',
            direccion: initialValues?.direccion || '',
            correo: initialValues?.correo || '',
            token: initialValues?.token || '',
            ip: initialValues?.ip || '',
            idEmv: initialValues?.idEmv || '',
            estadoEtt: initialValues?.estadoEtt || '',
            loginUsuario: initialValues?.loginUsuario || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            postEmv(values);
            // console.log(values);
        },
    });

    const postEmv = async (body) => {
        try {
            const res = formulario === CREAR_EMV ? await EmvService.post(body) : await EmvService.put(body);
            onSuccess(res.data);
        } catch (error) {
            onError(error);
        }
    }

    const refreshToken = async (loginUsuario) => {
        const newToken = await EmvService.refreshToken({ loginUsuario });
        if (newToken) {
            formik.setFieldValue('token', newToken.data.token);
            setSnack({ ...snack, open: true });
            setDialog({ ...dialog, open: false });
        }
    }

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="razonSocial"
                    name="razonSocial"
                    label="Razon Social"
                    value={formik.values.razonSocial}
                    onChange={formik.handleChange}
                    error={formik.touched.razonSocial && Boolean(formik.errors.razonSocial)}
                    helperText={formik.touched.razonSocial && formik.errors.razonSocial}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="glosaEmpresa"
                    name="glosaEmpresa"
                    label="Glosa Empresa"
                    value={formik.values.glosaEmpresa}
                    onChange={formik.handleChange}
                    error={formik.touched.glosaEmpresa && Boolean(formik.errors.glosaEmpresa)}
                    helperText={formik.touched.glosaEmpresa && formik.errors.glosaEmpresa}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="ruc"
                    name="ruc"
                    label="Ruc"
                    value={formik.values.ruc}
                    onChange={formik.handleChange}
                    error={formik.touched.ruc && Boolean(formik.errors.ruc)}
                    helperText={formik.touched.ruc && formik.errors.ruc}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="direccion"
                    name="direccion"
                    label="Direccion"
                    value={formik.values.direccion}
                    onChange={formik.handleChange}
                    error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                    helperText={formik.touched.direccion && formik.errors.direccion}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="estado">Estado</InputLabel>
                    <Select
                        defaultValue={formik.values.idEstadoEmpresa}
                        labelId="estado"
                        id="idEstadoEmpresa"
                        name="idEstadoEmpresa"
                        label="Estado"
                        onChange={formik.handleChange}
                        helperText={formik.touched.direccion && formik.errors.direccion}
                    >
                        <MenuItem value={1}>Activo</MenuItem>
                        <MenuItem value={2}>Inactivo</MenuItem>
                    </Select>
                    {formik.errors.idEstadoEmpresa}
                </FormControl>
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
                {formulario === EDITAR_EMV && <TextField
                    fullWidth
                    margin="dense"
                    id="token"
                    name="token"
                    label="Token"
                    title={formik.values.token}
                    value={formik.values.token}
                    onChange={formik.handleChange}
                    error={formik.touched.token && Boolean(formik.errors.token)}
                    helperText={formik.touched.token && formik.errors.token}
                    InputProps={{ endAdornment: <IconButton onClick={() => setDialog({ ...dialog, open: true })}><RefreshIcon /></IconButton> }}
                />}
                <ConfirmDialog
                    open={dialog.open}
                    title={dialog.title}
                    description={dialog.description}
                    handleClose={() => setDialog({ ...dialog, open: false })}
                    handleAgree={() => refreshToken(formik.values.loginUsuario)} />
                <Notification snack={snack} setSnack={setSnack} />
                <TextField
                    fullWidth
                    margin="dense"
                    id="ip"
                    name="ip"
                    label="Ip"
                    value={formik.values.ip}
                    onChange={formik.handleChange}
                    error={formik.touched.ip && Boolean(formik.errors.ip)}
                    helperText={formik.touched.ip && formik.errors.ip}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="loginUsuario"
                    name="loginUsuario"
                    label="Usuario Emv"
                    value={formik.values.loginUsuario}
                    onChange={formik.handleChange}
                    error={formik.touched.loginUsuario && Boolean(formik.errors.loginUsuario)}
                    helperText={formik.touched.loginUsuario && formik.errors.loginUsuario}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="passwordUsuario"
                    name="passwordUsuario"
                    label="Contraseña"
                    value={formik.values.passwordUsuario}
                    onChange={formik.handleChange}
                    error={formik.touched.passwordUsuario && Boolean(formik.errors.passwordUsuario)}
                    helperText={formik.touched.passwordUsuario && formik.errors.passwordUsuario}
                />
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}