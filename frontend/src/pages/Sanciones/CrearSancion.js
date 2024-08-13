import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SancionService from '../../services/SancionService';
import { CREAR_SANCION } from './Sanciones';

const validationSchema = yup.object({
    
    placa: yup
        .string('Ingresa placa')
        .required('Valor es requerido'),
});

export default function CrearSancion({ formulario, initialValues, onSuccess, onError }) {
    
    const [listaSanciones, setListaSanciones] = useState([]);
    const [idInfraccion, setIdInfraccion] = useState(-1);
    const [descripcionInfra, setDescripcionInfra] = useState('');
    const [importeInfra, setImporteInfra] = useState('');
    const [estado, setEstado] = useState(1);
    
    useEffect(() => {
        const getListaSanciones = async () => {
            const listaSanciones = await SancionService.getLista();
            setListaSanciones(listaSanciones.data);
            setIdInfraccion(initialValues?.idInfraccion);
            setDescripcionInfra(initialValues?.descripcionSancion);
            setImporteInfra(initialValues?.importe);
            setEstado(initialValues?.estadoSancion);

        };
        getListaSanciones();

    }, []);

    const formik = useFormik({
        initialValues: {
            idSancion: initialValues?.idSancion || 0,
            idInfraccion: initialValues?.idInfraccion || 0,
            fechaDocumento: initialValues?.fechaDocumento || '',
            descripcionSancion: descripcionInfra, 
            importe: initialValues?.importe || '',
            placa: initialValues?.placa || '',
            estadoSancion: initialValues?.estadoSancion || 1,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            values.idInfraccion=idInfraccion;
            values.descripcionSancion=descripcionInfra;
            values.importe=importeInfra;

            postSancion(values);
        },
    });

    const postSancion = async (body) => {
        try {
            const res = formulario === CREAR_SANCION ? await SancionService.post(body) : await SancionService.put(body);
            onSuccess(res.data);
        } catch (error) {
            onError(error);
        }
    }
    const handleChangeInfra = (e) => {
        const idxInfra = e.target.value;
        setIdInfraccion(idxInfra);
        setDescripcionInfra(listaSanciones[idxInfra-1]?.descripcionInfraccion);
        setImporteInfra(listaSanciones[idxInfra-1]?.sancion );
    }

    return (
        <>
            <form onSubmit={formik.handleSubmit} >               
                <FormControl fullWidth margin="dense">
                    <InputLabel id="idInfraccion">Listado de Infracciones</InputLabel>
                    <Select
                        defaultValue={formik.values.idInfraccion}
                        labelId="idInfraccion"
                        id="idInfraccion"
                        name="idInfraccion"
                        label="Listado de Infracciones"
                        onChange={handleChangeInfra}
                    >
                        {listaSanciones.map((infra,index) => {
                            return (
                                <MenuItem key={index} value={infra.id}>{infra.codFalta} - {infra.descripcionInfraccion}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    multiline
                    margin="dense"
                    id="descripcionSancion"
                    name="descripcionSancion"
                    label="Descripción sanción"
                    rows={4}
                    value={descripcionInfra}
                    onChange={formik.handleChange}
                    error={formik.touched.descripcionSancion && Boolean(formik.errors.descripcionSancion)}
                    helperText={formik.touched.descripcionSancion && formik.errors.descripcionSancion}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="importe"
                    name="importe"
                    label="Importe"
                    value={importeInfra}
                    onChange={formik.handleChange}
                    error={formik.touched.importe && Boolean(formik.errors.importe)}
                    helperText={formik.touched.importe && formik.errors.importe}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id="placa"
                    name="placa"
                    label="Placa"
                    value={formik.values.placa}
                    onChange={formik.handleChange}
                    error={formik.touched.placa && Boolean(formik.errors.placa)}
                    helperText={formik.touched.placa && formik.errors.placa}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="estadoSancion">Estado de la infracción</InputLabel>
                    <Select
                        defaultValue={formik.values.estadoSancion}
                        labelId="estadoSancion"
                        id="estadoSancion"
                        name="estadoSancion"
                        label="Estado de la infracción"
                        onChange={formik.handleChange}
                        disabled={formik.values.estadoSancion == 1 ? false : true}
                    >
                                <MenuItem key={1} value={1}>{"Activo"}</MenuItem>
                                <MenuItem key={2} value={2}>{"Inactivo"}</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="dense"
                    id="fechaDocumento"
                    name="fechaDocumento"
                    label="Fecha Caducidad"
                    value={formik.values.fechaDocumento}
                    onChange={formik.handleChange}
                    disabled={formik.values.estadoSancion == 1 ? false : true}
                    error={formik.touched.fechaDocumento && Boolean(formik.errors.fechaDocumento)}
                    helperText={formik.touched.fechaDocumento && formik.errors.fechaDocumento}
                />
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Guardar
                </Button>
            </form>
        </>
    );
}