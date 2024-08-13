import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useUserState } from "../../context/UserContext";
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckRounded from '@mui/icons-material/CheckRounded';
import RegistrosService from '../../services/RegistrosService';
import Dialog from '../../components/Dialog/Dialog';
import CrearRegistro from './CrearRegistro';
import CrearCalidad from './CrearCalidad';
import BasicTable from '../../components/Table/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import io from 'socket.io-client';
export const CREAR_REGISTRO = 'CREAR_REGISTRO';
export const EDITAR_REGISTRO = 'EDITAR_REGISTRO';
const socket = io("http://78.46.16.8:2006");
const MENSAJES_DE_RESPUESTA = {
    CREAR_REGISTRO: 'Ruta registrado correctamente',
    EDITAR_REGISTRO: 'Ruta actualizado correctamente'
};


export default function Inicio() {
    var { idRol } = useUserState();
    const [idRoles, setIdRoles] = useState(idRol);
    const [registros, setRegistros] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogCalidad, setOpenDialogCalidad] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_REGISTRO);
    const [initialValues, setInitialValues] = useState({});
    const [checked, setChecked] = React.useState(true);

    useEffect(() => {

        const getRegistros = async () => {
            const registros = await RegistrosService.getAll();
            setRegistros(registros.data);
        };
        getRegistros();

        socket.on('recibir_app', (message) => {
            // setRegistros((registro) => [message, ...registro]);
            getRegistros();
        });

        socket.on('actualizar_app', (message) => {
            // setRegistros((registro) => [...[message], ...registro]);
            getRegistros();
        });

        return () => {
            socket.off('recibir_app');
        };
    }, []);

    const handleChange = async (event) => {
        console.log(event)
        const r = registros.findIndex(x => x.id == Number(event.target.name));
        const reg = registros[r].calidad = (event.target.checked == true ? 'T' : 'F');
        const reg2 = registros[r].estado = 'O';
        const res = await RegistrosService.put(registros[r]);
        const nRegistros = registros.map(r => r.id === res.id ? { ...r, ...res } : r);
        setRegistros(nRegistros);

    };

    const useSt = makeStyles((theme) => ({
        cardstyle: {
            marginTop: theme.spacing(0),
            margin: 'auto',
            textAlign: 'center',
            flexDirection: 'column',

        },
        imgCard: {
            paddingTop: "76px",
            paddingLeft: "146px",
            paddingRight: "135px",
            height: 140
        },
        categoria: {
            paddingBottom: 0,
            color: '000000',
            letterSpacing: 1,
            fontWeight: 600,
            marginLeft: 300,
            marginTop: 20,
            fontSize: 25,
            fontStyle: 'SemiBold'
        },
        card: {
            boxShadow: "0px 4px 4px 4px rgb(223,223,223, 0.25)",
            height: 283,
            backgroundColor: '#ffffff',
            "&:hover": {
                backgroundColor: '#ffffff',
                boxShadow: "0px 4px 20px 0px rgb(0,0,0,0.2)",
            },
        },
        cardAction: {
            color: '#fff',
        },
        cardTitulo: {
            color: '#DA1C23',
            textAlign: 'center',
            fontSize: '22px',

        },
        descripcion: {
            color: '#00000099',

            textAlign: 'center',
            whiteSpace: 'wrap'

        },
        container: {
            whiteSpace: 'wrap',
            lineHeight: '5',
        }
    }));
    var classes = useSt();
    // const rows = [
    //     { id: 1, fecha: '16/05/2023 12:00:35', tipo: 'Disposición', razonSocialEmpresa: 'emp1', placa: 'abz-143', },
    //     { id: 2, fecha: '16/05/2023 12:01:30', tipo: 'Disposición', razonSocialEmpresa: 'emp1', placa: 'abz-163' },
    //     { id: 3, fecha: '16/05/2023 12:23:35', tipo: 'Disposición', razonSocialEmpresa: 'emp1', placa: 'abz-183' },
    //     { id: 4, fecha: '16/05/2023 12:35:03', tipo: 'Disposición', razonSocialEmpresa: 'emp1', placa: 'abz-123' },
    //     { id: 5, fecha: '16/05/2023 12:36:35', tipo: 'Chancadora', razonSocialEmpresa: 'emp1', placa: 'abz-423' },
    //     { id: 6, fecha: '16/05/2023 12:42:10', tipo: 'Chancadora', razonSocialEmpresa: 'emp1', placa: 'abz-122' },
    //     { id: 7, fecha: '16/05/2023 12:43:18', tipo: 'Chancadora', razonSocialEmpresa: 'emp1', placa: 'abz-527' },
    //     { id: 8, fecha: '16/05/2023 12:44:30', tipo: 'Chancadora', razonSocialEmpresa: 'emp1', placa: 'abz-629' },
    //     { id: 9, fecha: '16/05/2023 12:55:32', tipo: 'Chancadora', razonSocialEmpresa: 'emp1', placa: 'abz-821' },
    // ];
    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    const columnsDet = [
        {
            Header: 'Registro de placas ',
            columns: [
                {
                    Header: '#',
                    accessor: 'idn',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: '# Reg.',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: 'Origen',
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const registro = registros[rowIdx];

                        return (
                            <>
                                <Chip avatar={<Avatar>{`${registro.origen}`}</Avatar>} label={`${registro.origen == 'M' ? 'Manual' : 'LPR'}`} />
                            </>
                        );
                    },
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: 'Fecha',
                    accessor: 'fechaRegistro',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Tipo',
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const registro = registros[rowIdx];

                        return (
                            <p>{registro.tipo === '1' ? 'Disposición' : registro.tipo === '2' ? 'Chancadora' : ''}</p>
                        );
                    },
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Nombre de Empresa",
                    accessor: 'idRazonSocial'
                },
                {
                    Header: 'Placa',
                    accessor: 'placa',
                    alignHeader: 'center',
                    alignBody: 'center'
                },
                {
                    Header: 'Foto/Evidencia',
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const registro = registros[rowIdx];

                        return (
                            <> {
                                registro.foto != null ?
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                height="67"
                                                width="136"
                                                image={`${registro.foto}`}
                                            />
                                        </CardActionArea>
                                    </Card>
                                    : null
                            }
                            </>
                        );
                    },
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Tipo/Color',
                    accessor: 'tipoColor',
                    alignHeader: 'center',
                    alignBody: 'center'
                },
                {
                    Header: 'Autorizado',
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const registro = registros[rowIdx];

                        return (
                            <>
                                <Chip size="small" color={`${registro.autorizado == 'SI' ? 'primary' : 'error'}`} avatar={<Avatar>{`${registro.autorizado}`}</Avatar>} label={`${registro.autorizado == 'SI' ? 'AUTORIZADO' : 'AUTORIZADO'}`} />
                            </>
                        );
                    },
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Estado/Etapa',
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const registro = registros[rowIdx];

                        return (
                            <>
                                <Chip size="small" color={`${registro.estado == 'S' ? 'error' : registro.estado == 'O' ? 'warning' : 'success'}`} avatar={<Avatar>{`${registro.estado}`}</Avatar>} label={`${registro.estado == 'S' ? 'SALIDA' : registro.estado == 'O' ? 'OPERACIÓN' : 'ENTRADA'}`} />
                            </>
                        );
                    },
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Acciones",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const registro = registros[rowIdx];
                        return (
                            <>
                                <Stack spacing={1} direction="row">
                                    <Button size="small" disabled={registro.estado === 'S' || idRol=== 3 ? true : false} variant="outlined" startIcon={<EditIcon />} onClick={() => {
                                        setInitialValues(registro);
                                        setFormulario(EDITAR_REGISTRO);
                                        setOpenDialog(true);
                                    }}>
                                        Editar
                                    </Button>
                                </Stack>
                            </>
                        );
                    },
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Control Calidad",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const registro = registros[rowIdx];
                        return (
                            <>
                                <Stack spacing={1} direction="row">
                                    <Switch {...label} onChange={handleChange} name={registro.id} checked={registro.calidad === 'T' ? true : false} disabled={registro.calidad === 'T' ? true : false} />
                                </Stack>
                            </>
                        );
                    },
                    alignBody: 'center',
                    alignHeader: 'center'
                }
            ],
            alignHeader: 'left',
        },
    ];
    const onSuccess = (registro) => {
        if (formulario === CREAR_REGISTRO)
            setRegistros([...registro, ...registros]);

        if (formulario === EDITAR_REGISTRO) {
            const nRegistros = registros.map(r => r.id === registro.id ? { ...r, ...registro } : r);
            setRegistros(nRegistros);
            setInitialValues({});
        }

        setOpenDialog(false);
    }
    const onCloseDialog = () => {
        setInitialValues({});
        setOpenDialog(false);
    }
    const onCloseDialogCalidad = () => {
        setInitialValues({});
        setOpenDialogCalidad(false);
    }
    if (idRol === 1)
        return (
            <>
                <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                    <Button variant="outlined" onClick={() => {
                        setFormulario(CREAR_REGISTRO);
                        setOpenDialog(true);
                    }} startIcon={<AddIcon />}>Registro Manual </Button>
                </Stack>
                <Dialog open={openDialog} maxWidth="lg" title={formulario === CREAR_REGISTRO ? 'Registrar' : 'Editar'} handleClose={onCloseDialog}>
                    <CrearRegistro
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(registro) => {
                            onSuccess(registro);
                        }}
                        onError={(error) => {
                            // setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la ruta: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>
                <Dialog open={openDialogCalidad} maxWidth="lg" title={formulario === CREAR_REGISTRO ? 'Registrar' : 'Editar'} handleClose={onCloseDialogCalidad}>
                    <CrearCalidad
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(registro) => {
                            onSuccess(registro);
                        }}
                        onError={(error) => {
                            // setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la ruta: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>
                <BasicTable
                    props={`Registro Principal  - ${columnsDet[0].Header}`}
                    columns={columnsDet}
                    data={registros}
                />
                <br />
            </>
        );
    if (idRol === 2)
        return (
            <>
                <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                    <Button variant="outlined" onClick={() => {
                        setFormulario(CREAR_REGISTRO);
                        setOpenDialog(true);
                    }} startIcon={<AddIcon />}>Registro Manual </Button>
                </Stack>
                <Dialog open={openDialog} maxWidth="lg" title={formulario === CREAR_REGISTRO ? 'Registrar' : 'Editar'} handleClose={onCloseDialog}>
                    <CrearRegistro
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(registro) => {
                            onSuccess(registro);
                        }}
                        onError={(error) => {
                            // setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la ruta: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>
                <Dialog open={openDialogCalidad} maxWidth="lg" title={formulario === CREAR_REGISTRO ? 'Registrar' : 'Editar'} handleClose={onCloseDialogCalidad}>
                    <CrearCalidad
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(registro) => {
                            onSuccess(registro);
                        }}
                        onError={(error) => {
                            // setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la ruta: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>
                <BasicTable
                    props={`Registro Principal  - ${columnsDet[0].Header}`}
                    columns={columnsDet}
                    data={registros}
                />
                <br />
            </>
        );
        if (idRol === 3)
        return (
            <>
                {/* <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                    <Button variant="outlined" onClick={() => {
                        setFormulario(CREAR_REGISTRO);
                        setOpenDialog(true);
                    }} startIcon={<AddIcon />}>Registro Manual </Button>
                </Stack> */}
                <Dialog open={openDialog} maxWidth="lg" title={formulario === CREAR_REGISTRO ? 'Registrar' : 'Editar'} handleClose={onCloseDialog}>
                    <CrearRegistro
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(registro) => {
                            onSuccess(registro);
                        }}
                        onError={(error) => {
                            // setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la ruta: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>
                <Dialog open={openDialogCalidad} maxWidth="lg" title={formulario === CREAR_REGISTRO ? 'Registrar' : 'Editar'} handleClose={onCloseDialogCalidad}>
                    <CrearCalidad
                        formulario={formulario}
                        initialValues={initialValues}
                        onSuccess={(registro) => {
                            onSuccess(registro);
                        }}
                        onError={(error) => {
                            // setSnack({ ...snack, open: true, severity: 'error', message: `Ocurrió un error registrando la ruta: ${error}` });
                            setOpenDialog(false);
                        }}
                    />
                </Dialog>
                <BasicTable
                    isPaginador
                    isBuscador
                    props={`Registro Principal  - ${columnsDet[0].Header}`}
                    columns={columnsDet}
                    data={registros}
                />
                <br />
            </>
        );
        

}