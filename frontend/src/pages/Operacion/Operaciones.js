import { useState, useEffect, useParams } from "react";

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearEmpresa from './IniciarOperacion';
import EettService from '../../services/EettService';
import useStyle from './style';

export const CREAR_EMPRESA = 'CREAR_EMPRESA';
export const EDITAR_EMPRESA = 'EDITAR_EMPRESA';
const MENSAJES_DE_RESPUESTA = {
    CREAR_EMPRESA: 'Empresa registrada correctamente',
    EDITAR_EMPRESA: 'Empresa actualizada correctamente'
};

export default function Empresas() {
    var classes = useStyle();

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_EMPRESA);
    const [initialValues, setInitialValues] = useState({});
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await EettService.getAll();
            setEmpresas(empresas.data);
        };
        getEmpresas();
    }, []);

    const columns = [
        {
            Header: 'Lista de Empresas',
            columns: [
                {
                    Header: '#',
                    accessor: 'idEtt',
                },
                {
                    Header: 'Ruc',
                    accessor: 'rucEtt',
                },
                {
                    Header: 'Razón social',
                    accessor: 'razonSocialEmpresa',
                },
                {
                    Header: 'Dirección',
                    accessor: 'direccion',
                },
                {
                    Header: 'Fecha Registro',
                    accessor: 'fechaRegistro',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const empresa = empresas[rowIdx];
                        return (
                            <>
                                <Stack spacing={1} direction="row">
                                    <Button variant="contained" size="small" onClick={() => {
                                        setInitialValues(empresa);
                                        setFormulario(EDITAR_EMPRESA);
                                        setOpenDialog(true);
                                    }}>
                                        Editar
                                    </Button>

                                    <Button component={Link} to={`/flotas/${empresa.idEtt}`} variant="contained" size="small" >
                                        Flota
                                    </Button>

                                    <Button variant="contained" size="small" onClick={() => {
                                        setInitialValues(empresa);
                                        setFormulario(EDITAR_EMPRESA);
                                        setOpenDialog(false);
                                    }}>
                                        Rutas
                                    </Button>
                                </Stack>
                            </>
                        );
                    },
                    alignHeader: 'center'
                }
            ],
        },
    ];

    const onSuccess = (empresa) => {
        if (formulario === CREAR_EMPRESA)
            setEmpresas([...empresas, ...empresa]);

        if (formulario === EDITAR_EMPRESA) {
            const nEmpresas = empresas.map(e => e.idEtt === empresa.idEtt ? { ...e, ...empresa } : e);
            setEmpresas(nEmpresas);
            setInitialValues({});
        }

        setOpenDialog(false);
        setSnack({ ...snack, open: true, severity: 'success', message: MENSAJES_DE_RESPUESTA[formulario] });
    }

    const onCloseDialog = () => {
        setInitialValues({});
        setOpenDialog(false);
    }

    return (
        <>
            <Notification snack={snack} setSnack={setSnack} />

            <Stack direction="row" spacing={1} style={{ float: 'right' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_EMPRESA);
                    setOpenDialog(true);
                }}>Registrar Empresa</Button>
            </Stack>

            <Dialog open={openDialog} title={formulario === CREAR_EMPRESA ? 'Registrar Empresa' : 'Editar empresa'} handleClose={onCloseDialog}>
                <CrearEmpresa
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(empresa) => {
                        onSuccess(empresa);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la empresa: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>

            <BasicTable
                columns={columns}
                data={empresas}
                className={classes.container}
            />
        </>
    );
}