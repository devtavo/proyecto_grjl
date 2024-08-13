import { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import BasicTable from '../../components/Table/Table';
import Dialog from '../../components/Dialog/Dialog';
import Notification from '../../components/Notification/Notification';
import CrearEmv from './CrearEmv';
import EmvService from '../../services/EmvService';
import useStyle from './style';
import BackButton from '../../components/BackButton/BackButton';
import Navigation from '../../components/Navigation/Navigation';

export const CREAR_EMV = 'CREAR_EMV';
export const EDITAR_EMV = 'EDITAR_EMV';
const MENSAJES_DE_RESPUESTA = {
    CREAR_EMV: 'Emv registrado correctamente',
    EDITAR_EMV: 'Emv actualizado correctamente'
};

export default function Emv() {
    var classes = useStyle();

    const [snack, setSnack] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_EMV);
    const [initialValues, setInitialValues] = useState({});
    const [emvs, setEmvs] = useState([]);

    useEffect(() => {
        const getEmvs = async () => {
            const emvs = await EmvService.getAll();
            setEmvs(emvs.data);
        };
        getEmvs();
    }, []);

    const columns = [
        {
            Header: 'Empresa de Monitoreo Vehicular',
            columns: [
                {
                    Header: '#',
                    accessor: 'idEmv',
                },
                {
                    Header: 'Razón Social',
                    accessor: 'razonSocial',
                },
                {
                    Header: 'Ruc',
                    accessor: 'ruc',
                },
                {
                    Header: 'Direccion',
                    accessor: 'direccion',
                },
                {
                    Header: 'Fecha Registro',
                    accessor: 'fechaRegistro',
                },
                {
                    Header: 'Estado',
                    accessor: 'estadoEmv',
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const emv = emvs[rowIdx];

                        return (
                            <Button variant="contained" size="small" onClick={() => {
                                setInitialValues(emv);
                                setFormulario(EDITAR_EMV);
                                setOpenDialog(true);
                            }}>
                                Editar
                            </Button>
                        );
                    }
                }
            ],
        },
    ];

    const onSuccess = (emv) => {
        if (formulario === CREAR_EMV)
            setEmvs([...emvs, ...emv]);

        if (formulario === EDITAR_EMV) {
            const nEmvs = emvs.map(e => e.idEmv === emv.idEmv ? { ...e, ...emv } : e);
            setEmvs(nEmvs);
            setInitialValues({});
        }

        setOpenDialog(false);
        setSnack({ ...snack, open: true, severity: 'success', message: MENSAJES_DE_RESPUESTA[formulario] });
    }

    const onCloseDialog = () => {
        setInitialValues({});
        setOpenDialog(false);
    }

    const breadCrumb=[
        {
            name:'Inicio',
            path:'../'
        },
        {
            name:'Administración',
            path:'../'
        }
    ]

    return (
        <>
            <Notification snack={snack} setSnack={setSnack} />
            <BackButton to='../'  />
            <Navigation
                title="EMV" 
                breadcrumb={breadCrumb}
            />

            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom:'24px' }}>
                <Button variant="outlined" onClick={() => {
                    setFormulario(CREAR_EMV);
                    setOpenDialog(true);
                }}>Registrar Emv</Button>
            </Stack>

            <Dialog open={openDialog} title={formulario === CREAR_EMV ? 'Registrar Emv' : 'Editar Emv'} handleClose={onCloseDialog}>
                <CrearEmv
                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(emv) => {
                        onSuccess(emv);
                    }}
                    onError={(error) => {
                        setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la EMV: ${error}` });
                        setOpenDialog(false);
                    }}
                />
            </Dialog>

            <BasicTable
                columns={columns}
                data={emvs}
                className={classes.container}
                sizePro='small'
            />
        </>
    );
}