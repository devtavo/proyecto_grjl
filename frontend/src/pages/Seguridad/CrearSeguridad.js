import { useFormik } from 'formik';
import { useState, useEffect } from "react";

import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PersonaService from '../../services/SeguridadService';
import { CREAR_PERSONA } from './Seguridad'
import FormControl from '@mui/material/FormControl';
import EettService from '../../services/EettService';

const validationSchema = yup.object({
    loginUsuario: yup
        .string('Ingresa un nombre de usuario')
        .required('Nombre de usuario es requerido'),
    nombre: yup
        .string('Ingresa el nombre del usuario')
        .min(3, 'El nombre debe tener minimo 3 caracteres')
        .required('Nombre es requerido'),
    apellidoPaterno: yup
        .string('Ingresa los apellidos del usuario')
        .min(3, 'El nombre debe tener minimo 3 caracteres')
        .required('Apellidos es requerido'),
    nroDocIdentidad: yup
        .string('Ingresa el DNI del usuario')
        .min(8, 'El DNI debe ser de 8 digitos')
        .max(8, 'El DNI debe ser de 8 digitos')
        .required('DNI es requerido'),
    correo: yup
        .string('Ingrese el correo')
        .email('Correo electronico invalido')
        .required('Correo es requerido'),
});

export default function CrearSeguridad({ formulario, initialValues, onSuccess, onError }) {
    const [roles, setRoles] = useState([]);
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const getRoles = async () => {
            const roles = await PersonaService.getRoles();
            setRoles(roles.data);
            const empresas = await EettService.getAll();
            setEmpresas(empresas.data);
            console.log(empresas.data);
        };
        getRoles();
    }, []);

    const formik = useFormik({
        initialValues: {
            idPersona: initialValues?.idPersona || 0,
            loginUsuario: initialValues?.loginUsuario || '',
            passwordUsuario: '',
            nombre: initialValues?.nombre || '',
            apellidoPaterno: initialValues?.apellidoPaterno || '',
            nroDocIdentidad: initialValues?.nroDocIdentidad || '',
            ultimoAcceso: initialValues?.ultimoAcceso || '',
            idEstadousuario: initialValues?.idEstadousuario || '',
            fechaRegistro: initialValues?.fechaRegistro || '',
            correo: initialValues?.correo || '',
            idRol: initialValues?.idRol || '',
            idEtt: initialValues?.idEtt || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            postPersona(values);
        },
    });

    const postPersona = async (body) => {
        try {
            const res = formulario === CREAR_PERSONA ? await PersonaService.post(body) : await PersonaService.put(body);
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
                    margin="dense"
                    id="apellidosPaterno"
                    name="apellidoPaterno"
                    label="Apellidos"
                    value={formik.values.apellidoPaterno}
                    onChange={formik.handleChange}
                    error={formik.touched.apellidoPaterno && Boolean(formik.errors.apellidoPaterno)}
                    helperText={formik.touched.apellidoPaterno && formik.errors.apellidoPaterno}
                />

                <TextField
                    fullWidth
                    disabled={formulario === CREAR_PERSONA ? false : true}
                    margin="dense"
                    id="loginUsuario"
                    name="loginUsuario"
                    label="Usuario"
                    value={formik.values.loginUsuario}
                    onChange={formik.handleChange}
                    error={formik.touched.loginUsuario && Boolean(formik.errors.loginUsuario)}
                    helperText={formik.touched.loginUsuario && formik.errors.loginUsuario}
                />
                <TextField
                    fullWidth
                    type="password"
                    margin="dense"
                    id="passwordUsuario"
                    name="passwordUsuario"
                    label="Contraseña"
                    value={formik.values.passwordUsuario}
                    onChange={formik.handleChange}
                    error={formik.touched.passwordUsuario && Boolean(formik.errors.passwordUsuario)}
                    helperText={formik.touched.passwordUsuario && formik.errors.passwordUsuario}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="nroDocIdentidad"
                    name="nroDocIdentidad"
                    label="DNI"
                    value={formik.values.nroDocIdentidad}
                    onChange={formik.handleChange}
                    error={formik.touched.nroDocIdentidad && Boolean(formik.errors.nroDocIdentidad)}
                    helperText={formik.touched.nroDocIdentidad && formik.errors.nroDocIdentidad}
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
                <FormControl fullWidth margin="dense">
                    <InputLabel id="estado">Estado</InputLabel>
                    <Select
                        defaultValue={formik.values.idEstadousuario}
                        labelId="estado"
                        id="idEstadousuario"
                        name="idEstadousuario"
                        label="Estado"
                        onChange={formik.handleChange}
                    >
                        <MenuItem value={1}>Activo</MenuItem>
                        <MenuItem value={2}>Inactivo</MenuItem>
                    </Select>
                    {formik.errors.idEstadousuario}
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="rol">Rol Usuario</InputLabel>
                    <Select
                        defaultValue={formik.values.idRol}
                        labelId="rol"
                        id="idRol"
                        name="idRol"
                        label="Rol Usuario"
                        onChange={formik.handleChange}
                    >
                        {roles.map(rol => {
                            return (
                                <MenuItem value={rol.idRol}>{rol.nombreRol}</MenuItem>
                            )
                        })
                        }
                        {/* <MenuItem value={2}>Operador</MenuItem>
                        <MenuItem value={3}>Analista</MenuItem> */}
                    </Select>
                    {formik.errors.idEstadousuario}
                </FormControl>
                
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}