import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { fechaActual, restarDias, getTotals, getPromedio } from '../../../helper/helper';
import '../../../assets/styles/pages/reporte.css';

const today = new Date();

export default function Empresas({ reporteId, handleClickEmpresa, inicio, final }) {
    // console.log("in", inicio, 'today', today);

    const fecha = new Date();
    const diaAnteriorConformato = fechaActual(new Date(inicio), 'dd-mm-yyyy')
    const diaAnteriorSinformato = restarDias(fecha, -1);
    // console.log(diaAnteriorConformato);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [value, setValue] = useState([diaAnteriorSinformato, diaAnteriorSinformato]);
    // const [inicio, setInicio] = useState(diaAnteriorConformato);
    // const [final, setFinal] = useState(diaAnteriorConformato);

    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 0));

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await ReporteService.getEmpresas(reporteId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
            const total =
                [{
                    id: 'Totales',
                    idEtt: '',
                    razonSocialEmpresa: '',
                    vAutorizados: getTotals(empresas.data.detalle, 'vAutorizados'),
                    vConGps: getTotals(empresas.data.detalle, 'vConGps'),
                    aBotonPanico: getTotals(empresas.data.detalle, 'aBotonPanico'),
                    nVehiculosActBtn: getTotals(empresas.data.detalle, 'nVehiculosActBtn'),
                    pVehiculosServicioCGps: getPromedio(empresas.data.detalle, 'pVehiculosServicioCGps') + '%',
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            empresas.data.resumen[0].nAlertas = getTotals(empresas.data.detalle, 'aBotonPanico');
            empresas.data.resumen[0].porcentaje = getPromedio(empresas.data.detalle, 'pVehiculosServicioCGps') + '%';

            setEmpresas(concatEmpresas);
            setResumen(empresas.data.resumen);
        };
        getEmpresas();
    }, [reporteId]);

    const columnsRes = [
        {
            Header: 'Tabla Resumen',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody: 'center',

                },
                {
                    Header: 'Concepto',
                    accessor: 'concepto',
                    align: 'center'

                },
                {
                    Header: 'N° Alertas',
                    accessor: 'nAlertas',
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
    const columnsDet = [
        {
            Header: 'Reporte de Alertas de boton de Pánico en las Empresas de Transporte registradas',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody: 'center',

                },
                // {
                //     Header: 'Código de Empresa',
                //     accessor: 'idEtt',
                //     alignHeader:'center',
                //     alignBody:'center',

                // },
                {
                    Header: "Nombre de Empresa",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idEtt, razonSocialEmpresa } = empresas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickEmpresa(e, idEtt, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'), razonSocialEmpresa)
                            }}>
                                {razonSocialEmpresa}
                            </Link>
                        );
                    },
                    accessor:'razonSocialEmpresa'

                },
                {
                    Header: 'Vehículos Autorizados',
                    accessor: 'vAutorizados',
                    alignBody: 'center',
                    alignHeader: 'center'

                },
                {
                    Header: 'Vehículos con GPS',
                    accessor: 'vConGps',
                    alignBody: 'center',
                    alignHeader: 'center'

                },
                {
                    Header: 'Alertas de Botón de Pánico',
                    accessor: 'aBotonPanico',
                    alignBody: 'center',
                    alignHeader: 'center'

                },
                {
                    Header: 'Vehículos que Activaron Botón de Pánico',
                    accessor: 'nVehiculosActBtn',
                    alignBody: 'center',
                    alignHeader: 'center'

                },
                {
                    Header: '% de Alertas de Panico por Vehículos con GPS',
                    accessor: 'pVehiculosServicioCGps',
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
            const total =
                [{
                    id: 'Totales',
                    idEtt: '',
                    razonSocialEmpresa: '',
                    vAutorizados: getTotals(empresas.data.detalle, 'vAutorizados'),
                    vConGps: getTotals(empresas.data.detalle, 'vConGps'),
                    aBotonPanico: getTotals(empresas.data.detalle, 'aBotonPanico'),
                    nVehiculosActBtn: getTotals(empresas.data.detalle, 'nVehiculosActBtn'),
                    pVehiculosServicioCGps: getPromedio(empresas.data.detalle, 'pVehiculosServicioCGps') + '%',
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            empresas.data.resumen[0].nAlertas = getTotals(empresas.data.detalle, 'aBotonPanico');
            empresas.data.resumen[0].porcentaje = getPromedio(empresas.data.detalle, 'pVehiculosServicioCGps') + '%';

            setEmpresas(concatEmpresas);
            setResumen(empresas.data.resumen);
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
            props={`Reporte ${reporteId} - ${columnsDet[0].Header}`} isExportable isReporte columns={columnsDet} data={empresas} pdfExport={{ columnsDet, columnsRes, empresas, resumen }} inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')} />
            <br />
            <BasicTable
                columns={columnsRes} data={resumen}
                pdfExport={{ columnsDet, columnsRes, empresas, resumen }}
            />
        </>
    );
}