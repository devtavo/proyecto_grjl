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
    const [vehiculos12, setVehiculos12] = useState([]);
    const [vehiculos21, setVehiculos21] = useState([]);

    const [empresas12, setEmpresas12] = useState([]);
    const [empresas21, setEmpresas21] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [inicio, setInicio] = useState(diaAnteriorConformato);
    const [final, setFinal] = useState(diaAnteriorConformato);

    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 0));

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await ReporteService.getEmpresas(reporteId, inicio, final);
            const total12 =
                [{
                    id: 'Totales',
                    razonSocialEmpresa: '',
                    nRutas: getTotals(empresas.data.sentido_1_2, 'nRutas'),
                    vAutorizados: getTotals(empresas.data.sentido_1_2, 'vAutorizados'),
                    longitudRutas: getTotals(empresas.data.sentido_1_2, 'longitudRutas'),
                    nParaderosRuta: getTotals(empresas.data.sentido_1_2, 'nParaderosRuta'),
                    nViajesDetenciones100: getTotals(empresas.data.sentido_1_2, 'nViajesDetenciones100'),
                    nViajesDetencionesInc: getTotals(empresas.data.sentido_1_2, 'nViajesDetencionesInc'),
                    nDetencionesNoRealizadasParaderos: getTotals(empresas.data.sentido_1_2, 'nDetencionesNoRealizadasParaderos'),
                    porcViajesDetencionesParaderos12: getTotals(empresas.data.sentido_1_2, 'porcViajesDetencionesParaderos12') + ' %'
                }];
            const concatEmpresas12 = [...empresas.data.sentido_1_2, ...total12];
            const total21 =
                [{
                    id: 'Totales',
                    razonSocialEmpresa: '',
                    nRutas: getTotals(empresas.data.sentido_2_1, 'nRutas'),
                    vAutorizados: getTotals(empresas.data.sentido_2_1, 'vAutorizados'),
                    longitudRutas: getTotals(empresas.data.sentido_2_1, 'longitudRutas'),
                    nParaderosRuta: getTotals(empresas.data.sentido_2_1, 'nParaderosRuta'),
                    nViajesDetenciones100: getTotals(empresas.data.sentido_2_1, 'nViajesDetenciones100'),
                    nViajesDetencionesInc: getTotals(empresas.data.sentido_2_1, 'nViajesDetencionesInc'),
                    nDetencionesNoRealizadasParaderos: getTotals(empresas.data.sentido_2_1, 'nDetencionesNoRealizadasParaderos'),
                    porcViajesDetencionesParaderos21: getTotals(empresas.data.sentido_2_1, 'porcViajesDetencionesParaderos21') + ' %'
                }];
            const concatEmpresas21 = [...empresas.data.sentido_2_1, ...total21];
            empresas.data.resumen[0].detenciones = getTotals(empresas.data.sentido_1_2, 'nDetencionesNoRealizadasParaderos');
            empresas.data.resumen[1].detenciones = getTotals(empresas.data.sentido_2_1, 'nDetencionesNoRealizadasParaderos');
            empresas.data.resumen[2].detenciones = (getTotals(empresas.data.sentido_1_2, 'nDetencionesNoRealizadasParaderos') + getTotals(empresas.data.sentido_2_1, 'nDetencionesNoRealizadasParaderos')) / 2;

            empresas.data.resumen[0].porcentaje = getTotals(empresas.data.sentido_1_2, 'porcViajesDetencionesParaderos12') + ' %';
            empresas.data.resumen[1].porcentaje = getTotals(empresas.data.sentido_2_1, 'porcViajesDetencionesParaderos21') + ' %';
            empresas.data.resumen[2].porcentaje = ((getTotals(empresas.data.sentido_1_2, 'porcViajesDetencionesParaderos12') + getTotals(empresas.data.sentido_2_1, 'porcViajesDetencionesParaderos21')) / 2) + ' %';

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
                    alignBody: 'center',

                }, {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Detenciones',
                    accessor: 'detenciones',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje',
                    alignHeader: 'center',
                    alignBody: 'center',
                },
            ]
        }
    ];

    const columnsDet12 = [
        {
            Header: 'Reporte del Cumplimiento de Detención de Vehículos en Paraderos en las Empresas de Transporte registradas',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
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
                    accessor: 'razonSocialEmpresa',
                },
                {
                    Header: 'Rutas',
                    accessor: 'nRutas',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Buses Autorizados',
                    accessor: 'vAutorizados',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Longitud de la Ruta (km)',
                    accessor: 'longitudRutas',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Paraderos en Ruta',
                    accessor: 'nParaderosRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes con Detenciones al 100%',
                    accessor: 'nViajesDetenciones100',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Detenciones No Realizadas en Paraderos',
                    accessor: 'nViajesDetencionesInc',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Detenciones Realizadas en Paraderos ',
                    accessor: 'nDetencionesNoRealizadasParaderos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% Detenciones de Vehículos en Paraderos ',
                    accessor: 'porcViajesDetencionesParaderos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center'
        },
    ];
    const columnsDet21 = [
        {
            Header: 'Reporte del Cumplimiento de Detención de Vehículos en Paraderos en las Empresas de Transporte registradas',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignBody: 'center',
                    alignHeader: 'center'
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
                    Header: 'Rutas',
                    accessor: 'nRutas',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Buses Autorizados',
                    accessor: 'vAutorizados',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Longitud de la Ruta (km)',
                    accessor: 'longitudRutas',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Paraderos en Ruta',
                    accessor: 'nParaderosRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes con Detenciones al 100%',
                    accessor: 'nViajesDetenciones100',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Detenciones No Realizadas en Paraderos',
                    accessor: 'nViajesDetencionesInc',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Detenciones Realizadas en Paraderos ',
                    accessor: 'nDetencionesNoRealizadasParaderos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Detenciones de Vehículos en Paraderos ',
                    accessor: 'porcViajesDetencionesParaderos21',
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
                    razonSocialEmpresa: '',
                    nRutas: getTotals(empresas.data.sentido_1_2, 'nRutas'),
                    vAutorizados: getTotals(empresas.data.sentido_1_2, 'vAutorizados'),
                    longitudRutas: getTotals(empresas.data.sentido_1_2, 'longitudRutas'),
                    nParaderosRuta: getTotals(empresas.data.sentido_1_2, 'nParaderosRuta'),
                    nViajesDetenciones100: getTotals(empresas.data.sentido_1_2, 'nViajesDetenciones100'),
                    nViajesDetencionesInc: getTotals(empresas.data.sentido_1_2, 'nViajesDetencionesInc'),
                    nDetencionesNoRealizadasParaderos: getTotals(empresas.data.sentido_1_2, 'nDetencionesNoRealizadasParaderos'),
                    porcViajesDetencionesParaderos12: getTotals(empresas.data.sentido_1_2, 'porcViajesDetencionesParaderos12') + ' %'
                }];
            const concatEmpresas12 = [...empresas.data.sentido_1_2, ...total12];
            const total21 =
                [{
                    id: 'Totales',
                    razonSocialEmpresa: '',
                    nRutas: getTotals(empresas.data.sentido_2_1, 'nRutas'),
                    vAutorizados: getTotals(empresas.data.sentido_2_1, 'vAutorizados'),
                    longitudRutas: getTotals(empresas.data.sentido_2_1, 'longitudRutas'),
                    nParaderosRuta: getTotals(empresas.data.sentido_2_1, 'nParaderosRuta'),
                    nViajesDetenciones100: getTotals(empresas.data.sentido_2_1, 'nViajesDetenciones100'),
                    nViajesDetencionesInc: getTotals(empresas.data.sentido_2_1, 'nViajesDetencionesInc'),
                    nDetencionesNoRealizadasParaderos: getTotals(empresas.data.sentido_2_1, 'nDetencionesNoRealizadasParaderos'),
                    porcViajesDetencionesParaderos21: getTotals(empresas.data.sentido_2_1, 'porcViajesDetencionesParaderos21') + ' %'
                }];
            const concatEmpresas21 = [...empresas.data.sentido_2_1, ...total21];
            empresas.data.resumen[0].detenciones = getTotals(empresas.data.sentido_1_2, 'nDetencionesNoRealizadasParaderos');
            empresas.data.resumen[1].detenciones = getTotals(empresas.data.sentido_2_1, 'nDetencionesNoRealizadasParaderos');
            empresas.data.resumen[2].detenciones = (getTotals(empresas.data.sentido_1_2, 'nDetencionesNoRealizadasParaderos') + getTotals(empresas.data.sentido_2_1, 'nDetencionesNoRealizadasParaderos')) / 2;

            empresas.data.resumen[0].porcentaje = getTotals(empresas.data.sentido_1_2, 'porcViajesDetencionesParaderos12') + ' %';
            empresas.data.resumen[1].porcentaje = getTotals(empresas.data.sentido_2_1, 'porcViajesDetencionesParaderos21') + ' %';
            empresas.data.resumen[2].porcentaje = ((getTotals(empresas.data.sentido_1_2, 'porcViajesDetencionesParaderos12') + getTotals(empresas.data.sentido_2_1, 'porcViajesDetencionesParaderos21')) / 2) + ' %';

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
                columns={columnsDet21}
                data={empresas21}
                pdfExport={{ columnsDet21, columnsRes, empresas21, resumen }}
                inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')} />
            <br />
            <BasicTable
                // isExportable
                columns={columnsRes}
                data={resumen}
                pdfExport={{ columnsDet12, columnsRes, empresas12, resumen }}
            />
        </>
    );
}