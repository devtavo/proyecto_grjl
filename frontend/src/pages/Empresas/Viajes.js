import { useState, useEffect, useParams } from "react";
import BasicTable from '../../components/Table/Table';
import RutaService from '../../services/RutaService';
import useStyle from './style';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import CrearComprobante from './CrearComprobante';
import Dialog from '../../components/Dialog/Dialog';

export const CREAR_EMPRESA = 'CREAR_EMPRESA';
export const EDITAR_EMPRESA = 'EDITAR_EMPRESA';


export default function Viajes({ empresaId }) {
    var classes = useStyle();

    const [rutas, setRutas] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [formulario, setFormulario] = useState(CREAR_EMPRESA);
    const [initialValues, setInitialValues] = useState({});

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await RutaService.getRutasEmpresa(
                { 'idEtt': empresaId }
            );
            setRutas(rutas.data);
        };
        getRutas();
    }, []);

    const columns = [
        {
            Header: ' ',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Comprobante',
                    accessor: 'comprobante',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Cantidad Viajes',
                    accessor: 'cantidad',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'S/. Monto Total',
                    accessor: 'monto',
                    alignBody: 'center',
                    alignHeader: 'center'
                }
            ],
        },
    ];
    const onSuccess = (pago) => {
        if (formulario === CREAR_EMPRESA)
            setPagos([...pagos, ...pago]);

        if (formulario === EDITAR_EMPRESA) {
            const nPagos = pagos.map(e => e.id === pago.id ? { ...e, ...pago } : e);
            setPagos(nPagos);
            setInitialValues({});
        }

        setOpenDialog(false);
    }
    const onCloseDialog = () => {
        setInitialValues({});
        setOpenDialog(false);
    }
    return (
        <>
            <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '24px' }}>
                <Button variant="outlined" startIcon={<AppRegistrationOutlinedIcon />} onClick={() => {
                    setFormulario(CREAR_EMPRESA);
                    setOpenDialog(true);
                    setInitialValues({ "idEtt": empresaId });
                }}>Registrar Comprobante</Button>
            </Stack>
            <Dialog open={openDialog} title={formulario === CREAR_EMPRESA ? 'Registrar Empresa' : 'Editar empresa'} handleClose={onCloseDialog}>
                <CrearComprobante

                    formulario={formulario}
                    initialValues={initialValues}
                    onSuccess={(pago) => {
                        onSuccess(pago);
                    }}
                    onError={(error) => {
                        setOpenDialog(false);
                    }}
                />
            </Dialog>
            <BasicTable
                isBuscador={false}
                columns={columns}
                data={rutas}
                className={classes.container}
            />
        </>
    );
}