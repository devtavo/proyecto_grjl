import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';
import '../../../assets/styles/pages/reporte.css';
const today = new Date();

export default function Empresas({ reporteId, handleClickEmpresa }) {
    const fecha = new Date();
    const diaAnteriorConformato = fechaActual(fecha, 'dd-mm-yyyy')
    const diaAnteriorSinformato = restarDias(fecha, -1);

    const [empresas12, setEmpresas12] = useState([]);
    const [empresas21, setEmpresas21] = useState([]);
    const [vehiculos12, setVehiculos12] = useState([]);
    const [vehiculos21, setVehiculos21] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [inicio, setInicio] = useState(diaAnteriorConformato);
    const [final, setFinal] = useState(diaAnteriorConformato);

    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 0));

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await ReporteService.getEmpresas(reporteId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
            const total12 =
                [{
                    id: 'Totales',
                    idEtt: '',
                    razonSocialEmpresa: '',
                    vAutorizados: getTotals(empresas.data.sentido_1_2, 'vAutorizados'),
                    longitudRutas: getTotals(empresas.data.sentido_1_2, 'longitudRutas'),
                    nCompletosEtt: getTotals(empresas.data.sentido_1_2, 'nCompletosEtt'),
                    nIncompletosEtt: getTotals(empresas.data.sentido_1_2, 'nIncompletosEtt'),
                    kmRecorridosCompletos12: getTotals(empresas.data.sentido_1_2, 'kmRecorridosCompletos12').toFixed(2),
                    kmRecorridosIncompletos12: getTotals(empresas.data.sentido_1_2, 'kmRecorridosIncompletos12').toFixed(2),
                    totalKmRecorridosS12: getTotals(empresas.data.sentido_1_2, 'totalKmRecorridosS12').toFixed(2)
                }];
            const concatEmpresas12 = [...empresas.data.sentido_1_2, ...total12];
            const total21 =
                [{
                    id: 'Totales',
                    idEtt: '',
                    razonSocialEmpresa: '',
                    vAutorizados: getTotals(empresas.data.sentido_2_1, 'vAutorizados'),
                    longitudRutas: getTotals(empresas.data.sentido_2_1, 'longitudRutas'),
                    nCompletosEtt: getTotals(empresas.data.sentido_2_1, 'nCompletosEtt'),
                    nIncompletosEtt: getTotals(empresas.data.sentido_2_1, 'nIncompletosEtt'),
                    kmRecorridosCompletos21: getTotals(empresas.data.sentido_2_1, 'kmRecorridosCompletos21').toFixed(2),
                    kmRecorridosIncompletos21: getTotals(empresas.data.sentido_2_1, 'kmRecorridosIncompletos21').toFixed(2),
                    totalKmRecorridosS21: getTotals(empresas.data.sentido_2_1, 'totalKmRecorridosS21').toFixed(2)
                }];
            const concatEmpresas21 = [...empresas.data.sentido_2_1, ...total21];
            empresas.data.resumen[0].kilometraje = getTotals(empresas.data.sentido_1_2, 'totalKmRecorridosS12') + ' km/h';
            empresas.data.resumen[1].kilometraje = getTotals(empresas.data.sentido_2_1, 'totalKmRecorridosS21') + ' km/h';
            empresas.data.resumen[2].kilometraje = ((getTotals(empresas.data.sentido_1_2, 'totalKmRecorridosS12') + getTotals(empresas.data.sentido_2_1, 'totalKmRecorridosS21'))).toFixed(2)+' km/h';

    setEmpresas12(concatEmpresas12);
    setEmpresas21(concatEmpresas21);
    setVehiculos12(concatEmpresas12);
    setVehiculos21(concatEmpresas21);
    setResumen(empresas.data.resumen);
};
getEmpresas();
    }, [reporteId, inicio, final]);

const columnsRes = [
    {
        Header: 'Tabla Resumen',
        columns: [
            {
                Header: '#',
                accessor: 'id',
                alignHeader: 'center',
                alignBody: 'center'

            }, {
                Header: 'Concepto',
                accessor: 'concepto',
            },
            {
                Header: 'Kilometraje',
                accessor: 'kilometraje',
                alignHeader: 'center',
                alignBody: 'center'
            },
        ],
        alignHeader: 'center',
    }
];

const columnsDet12 = [
    {
        Header: 'Reporte de los Kilómetros recorridos por los Vehículos durante la prestación del Servicio por cada Vehículo en cada Ruta de una Empresa de Transporte registrada en sentido 1-2',
        columns: [
            {
                Header: '#',
                accessor: 'id',
                alignHeader: 'center',
                alignBody: 'center'
            },
            {
                Header: "Nombre de Empresa",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    const { idEtt, razonSocialEmpresa } = empresas12[rowIdx];

                    return (
                        <Link href="#" underline="none" onClick={(e) => {
                            handleClickEmpresa(e, idEtt, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'), razonSocialEmpresa)
                        }}>
                            {razonSocialEmpresa}
                        </Link>
                    );
                },
                accessor: 'razonSocialEmpresa'

            },
            {
                Header: 'Buses Autorizados',
                accessor: 'vAutorizados',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Longitud de las Rutas de la EETT (km)',
                accessor: 'longitudRutas',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Viajes completos de la EETT',
                accessor: 'nCompletosEtt',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Viajes incompletos de la EETT',
                accessor: 'nIncompletosEtt',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Kilómetros Recorridos completos de la EETT',
                accessor: 'kmRecorridosCompletos12',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Kilómetros Recorridos incompletos de la EETT',
                accessor: 'kmRecorridosIncompletos12',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Total Kilómetros Recorridos 1→2',
                accessor: 'totalKmRecorridosS12',
                alignBody: 'center',
                alignHeader: 'center'
            },
        ],
        alignHeader: 'center'
    },
];

const columnsDet21 = [
    {
        Header: 'Reporte de los Kilómetros recorridos por los Vehículos durante la prestación del Servicio por cada Vehículo en cada Ruta de una Empresa de Transporte registrada en sentido 2-1',
        columns: [
            {
                Header: '#',
                accessor: 'id',
                alignHeader: 'center',
                alignBody: 'center',
            },
            {
                Header: "Nombre de Empresa",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    const { idEtt, razonSocialEmpresa } = empresas21[rowIdx];

                    return (
                        <Link href="#" underline="none" onClick={(e) => {
                            handleClickEmpresa(e, idEtt, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'), razonSocialEmpresa)
                        }}>
                            {razonSocialEmpresa}
                        </Link>
                    );
                },
               
            },
            {
                Header: 'Buses Autorizados',
                accessor: 'vAutorizados',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Longitud de las Rutas de la EETT (km)',
                accessor: 'longitudRutas',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'N° Viajes completos de la EETT',
                accessor: 'nCompletosEtt',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'N° Viajes incompletos de la EETT',
                accessor: 'nIncompletosEtt',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Kilómetros Recorridos completos de la EETT',
                accessor: 'kmRecorridosCompletos21',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Kilómetros Recorridos incompletos de la EETT',
                accessor: 'kmRecorridosIncompletos21',
                alignBody: 'center',
                alignHeader: 'center'
            },
            {
                Header: 'Total Kilómetros Recorridos 2→1',
                accessor: 'totalKmRecorridosS21',
                alignBody: 'center',
                alignHeader: 'center'
            },
        ],
        alignHeader: 'center'
    },
];
const handleChangeFechaInicio = (fecha) => {
    setFechaInicio(fecha);
};

const handleChangeFechaFin = (fecha) => {
    setFechaFin(fecha);
};

const handleClickBuscar = () => {
    const getEmpresas = async () => {
        const empresas = await ReporteService.getEmpresas(reporteId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
        const total12 =
            [{
                id: 'Totales',
                idEtt: '',
                razonSocialEmpresa: '',
                vAutorizados: getTotals(empresas.data.sentido_1_2, 'vAutorizados'),
                longitudRutas: getTotals(empresas.data.sentido_1_2, 'longitudRutas'),
                nCompletosEtt: getTotals(empresas.data.sentido_1_2, 'nCompletosEtt'),
                nIncompletosEtt: getTotals(empresas.data.sentido_1_2, 'nIncompletosEtt'),
                kmRecorridosCompletos12: getTotals(empresas.data.sentido_1_2, 'kmRecorridosCompletos12').toFixed(2),
                kmRecorridosIncompletos12: getTotals(empresas.data.sentido_1_2, 'kmRecorridosIncompletos12').toFixed(2),
                totalKmRecorridosS12: getTotals(empresas.data.sentido_1_2, 'totalKmRecorridosS12').toFixed(2)
            }];
        const concatEmpresas12 = [...empresas.data.sentido_1_2, ...total12];
        const total21 =
            [{
                id: 'Totales',
                idEtt: '',
                razonSocialEmpresa: '',
                vAutorizados: getTotals(empresas.data.sentido_2_1, 'vAutorizados'),
                longitudRutas: getTotals(empresas.data.sentido_2_1, 'longitudRutas'),
                nCompletosEtt: getTotals(empresas.data.sentido_2_1, 'nCompletosEtt'),
                nIncompletosEtt: getTotals(empresas.data.sentido_2_1, 'nIncompletosEtt'),
                kmRecorridosCompletos21: getTotals(empresas.data.sentido_2_1, 'kmRecorridosCompletos21').toFixed(2),
                kmRecorridosIncompletos21: getTotals(empresas.data.sentido_2_1, 'kmRecorridosIncompletos21').toFixed(2),
                totalKmRecorridosS21: getTotals(empresas.data.sentido_2_1, 'totalKmRecorridosS21').toFixed(2)
            }];
        const concatEmpresas21 = [...empresas.data.sentido_2_1, ...total21];
        empresas.data.resumen[0].kilometraje = getTotals(empresas.data.sentido_1_2, 'totalKmRecorridosS12') + ' km/h';
        empresas.data.resumen[1].kilometraje = getTotals(empresas.data.sentido_2_1, 'totalKmRecorridosS21') + ' km/h';
        empresas.data.resumen[2].kilometraje = ((getTotals(empresas.data.sentido_1_2, 'totalKmRecorridosS12') + getTotals(empresas.data.sentido_2_1, 'totalKmRecorridosS21')) ).toFixed(2)+' km/h';

        setEmpresas12(concatEmpresas12);
        setEmpresas21(concatEmpresas21);
        setVehiculos12(concatEmpresas12);
        setVehiculos21(concatEmpresas21);
        setResumen(empresas.data.resumen);
        // console.log(resumen);
    };
    getEmpresas();
}
return (
    <>
        <Grid container spacing={2}>

            <Grid item xs={12} md={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <FormControl margin="dense" fullWidth>
                        <DateTimePicker
                            label="Rango de inicio"
                            value={fechaInicio}
                            onChange={handleChangeFechaInicio}
                            inputFormat="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </FormControl>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <FormControl margin="dense" fullWidth>
                        <DateTimePicker
                            label="Rango final"
                            value={fechaFin}
                            onChange={handleChangeFechaFin}
                            inputFormat="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </FormControl>
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={2} justifyContent="center" alignItems="center">
                <div style={{ display: "flex", alignItems: "center", height: '100%' }}>
                    <Button variant="contained" onClick={handleClickBuscar} size="large" className="reporte__boton">Buscar</Button>
                </div>
            </Grid>
        </Grid>
        <BasicTable
            props={`Reporte ${reporteId} - ${columnsDet12[0].Header}`}
            isExportable
            isReporte
            isVehiculo
            columns={columnsDet12}
            data={empresas12}
            pdfExport={{ columnsDet12, columnsDet21, columnsRes, empresas12, vehiculos12, vehiculos21, resumen }}
            inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')} />
        <br />
        <BasicTable
            isReporte
            isVehiculo
            columns={columnsDet21}
            data={empresas21}
            pdfExport={{ columnsDet12, columnsDet21, columnsRes, empresas12, vehiculos12, vehiculos21, resumen }}
            inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')} />
        <br />
        <BasicTable
            // isExportable
            columns={columnsRes}
            data={resumen}
            pdfExport={{ columnsDet12, columnsDet21, columnsRes, empresas12, vehiculos12, vehiculos21, resumen }}
        />
    </>
);
}