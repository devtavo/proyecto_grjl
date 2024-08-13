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

    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [inicio, setInicio] = useState(diaAnteriorConformato);
    const [final, setFinal] = useState(diaAnteriorConformato);

    const [fechaInicio, setFechaInicio] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0));
    const [fechaFin, setFechaFin] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 0));

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await ReporteService.getEmpresas(reporteId, inicio, final);
            const total =
                [{
                    id: 'Totales',
                    idEtt: '',
                    razonSocialEmpresa: '',
                    kmRecorridosGps: getTotals(empresas.data.detalle, 'kmRecorridosGps'),
                    kmRecorridosRuta: getTotals(empresas.data.detalle, 'kmRecorridosRuta'),
                    porcKmRecorridosRutaGps: getTotals(empresas.data.detalle, 'porcKmRecorridosRutaGps').toFixed(2)+' %',
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            empresas.data.resumen[0].kilometros = getTotals(empresas.data.detalle, 'kmRecorridosRuta') +' km/h';
            empresas.data.resumen[0].porcentaje = getTotals(empresas.data.detalle, 'porcKmRecorridosRutaGps').toFixed(2)+' %';

            setEmpresas(concatEmpresas);
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
                    alignHeader:'center',
                    alignBody: 'center',

                }, {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Kilometraje',
                    accessor: 'kilometros',
                    alignHeader:'center',
                    alignBody: 'center',
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje',
                    alignHeader:'center',
                    alignBody: 'center',
                }
            ]
        }
    ];

    const columnsDet = [
        {
            Header: 'Reporte de Vehículos que cumplen con kilómetros válidos para Subsidio, por Empresas de Transporte registradas',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader:'center',
                    alignBody: 'center',
                },
                {
                    Header: "Nombre de Empresa",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idEtt, razonSocialEmpresa } = empresas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickEmpresa(e, idEtt, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'),razonSocialEmpresa)
                            }}>
                                {razonSocialEmpresa}
                            </Link>
                        );
                    },
                    accessor:'razonSocialEmpresa',
                },
                {
                    Header: 'Kilómetros Recorridos según GPS',
                    accessor: 'kmRecorridosGps',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros Recorridos según Ruta',
                    accessor: 'kmRecorridosRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% de Km Recorridos Rutas vs. GPS',
                    accessor: 'porcKmRecorridosRutaGps',
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
                    kmRecorridosGps: getTotals(empresas.data.detalle, 'kmRecorridosGps'),
                    kmRecorridosRuta: getTotals(empresas.data.detalle, 'kmRecorridosRuta'),
                    porcKmRecorridosRutaGps: getTotals(empresas.data.detalle, 'porcKmRecorridosRutaGps').toFixed(2)+' %',
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            empresas.data.resumen[0].kilometros = getTotals(empresas.data.detalle, 'kmRecorridosRuta');
            empresas.data.resumen[0].porcentaje = getTotals(empresas.data.detalle, 'porcKmRecorridosRutaGps').toFixed(2)+' %';

            setEmpresas(concatEmpresas);
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
            props={`Reporte ${reporteId} - ${columnsDet[0].Header}`}
            isExportable
            isReporte
            columns={columnsDet}
            data={empresas}
            pdfExport={{ columnsDet, columnsRes, empresas, resumen }}
            inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')} />
        <br />
        <BasicTable
            // isExportable
            columns={columnsRes}
            data={resumen}
            pdfExport={{ columnsDet, columnsRes, empresas, resumen }}
        />
    </>
    );
}