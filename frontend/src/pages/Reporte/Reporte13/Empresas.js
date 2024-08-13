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
            const empresas = await ReporteService.getEmpresas(reporteId, fechaInicio.toLocaleDateString().split('/').join('-').split('-').reverse().join('-'), fechaFin.toLocaleDateString().split('/').join('-').split('-').reverse().join('-'));
            const total =
                [{
                    ide: 'Totales',
                    idEtt: '',
                    empresa: '',
                    rutas: getTotals(empresas.data.detalle, 'rutas'),
                    vehiculos: getTotals(empresas.data.detalle, 'vehiculos'),
                    '%ViajesCompletosSentido12': getPromedio(empresas.data.detalle, '%ViajesCompletosSentido12'),
                    '%ViajesCompletosSentido21': getPromedio(empresas.data.detalle, '%ViajesCompletosSentido21'),
                    '%DeTransmisiónDelGpsPorMinutoSentido12': getPromedio(empresas.data.detalle, '%DeTransmisiónDelGpsPorMinutoSentido12')+'.00%',
                    '%DeTransmisiónDelGpsPorMinutoSentido21': getPromedio(empresas.data.detalle, '%DeTransmisiónDelGpsPorMinutoSentido21')+'.00%',
                    velocidadMediaPorRutaSentido12: getPromedio(empresas.data.detalle, 'velocidadMediaPorRutaSentido12'),
                    velocidadMediaPorRutaSentido21: getPromedio(empresas.data.detalle, 'velocidadMediaPorRutaSentido21'),
                    vehículosEnServicioConGps: getTotals(empresas.data.detalle, 'vehículosEnServicioConGps'),
                    '%DeVehículosEnServicioConGps': getPromedio(empresas.data.detalle, '%DeVehículosEnServicioConGps')+'.00%',
                    'n°VehículosQueActivaronBotónDePánico': getTotals(empresas.data.detalle, 'n°VehículosQueActivaronBotónDePánico'),
                    '%DeAlertasDePanicoPorVehículosConGps': getPromedio(empresas.data.detalle, '%DeAlertasDePanicoPorVehículosConGps')+'.00%',
                    totalKilómetrosRecorridosSentido12: getTotals(empresas.data.detalle, 'totalKilómetrosRecorridosSentido12'),
                    totalKilómetrosRecorridosSentido21: getTotals(empresas.data.detalle, 'totalKilómetrosRecorridosSentido21'),
                    kmRecorridosRuta: getTotals(empresas.data.detalle, 'kmRecorridosRuta'),
                    porcKmRecorridosRutaGps: getTotals(empresas.data.detalle, 'porcKmRecorridosRutaGps'),
                    totKmRecorridosSubsidio: getTotals(empresas.data.detalle, 'totKmRecorridosSubsidio'),
                    pagoSubsidio: getTotals(empresas.data.detalle, 'pagoSubsidio'),
                    kmRecorridosFueraRuta: getTotals(empresas.data.detalle, 'kmRecorridosFueraRuta'),
                    porcKmRecorridosFueraRutaGps: getTotals(empresas.data.detalle, 'porcKmRecorridosFueraRutaGps'),
                    tiempoTransmisionGps: getTotals(empresas.data.detalle, 'tiempoTransmisionGps'),
                    totTiempoAcumulado: getTotals(empresas.data.detalle, 'totTiempoAcumulado')
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            setEmpresas(concatEmpresas);
        };
        getEmpresas();
    }, [reporteId]);

    const columnsDet = [
        {
            Header: 'Indicadores de Empresas de Transporte Registradas.',
            columns: [
                {
                    Header: '#',
                    accessor: 'ide',
                    alignBody: 'center',
                    alignHeader: 'center'
                }, 
                {
                    Header: "Razon Social Empresa",
                    accessor: 'empresa',
                },
                {
                    Header: "Rutas",
                    accessor: 'rutas',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: "Buses Autorizados",
                    accessor: 'vehiculos',
                    alignBody: 'center',
                    alignHeader: 'center'
                    
                },
                {
                    Header: "% Viajes completos 1→2",
                    accessor: '%ViajesCompletosSentido12'
                },
                {
                    Header: "% Viajes completos 2-1",
                    accessor: '%ViajesCompletosSentido21'
                },
                {
                    Header: "% de Transmisión del GPS por minuto 1→2",
                    accessor: '%DeTransmisiónDelGpsPorMinutoSentido12'
                },
                {
                    Header: "% de Transmisión del GPS por minuto 2→1",
                    accessor: '%DeTransmisiónDelGpsPorMinutoSentido21'
                },
                {
                    Header: "Velocidad Media por Ruta 1→2",
                    accessor: 'velocidadMediaPorRutaSentido12'
                },
                {
                    Header: "Velocidad Media por Ruta 2→1",
                    accessor: 'velocidadMediaPorRutaSentido21'
                },
                {
                    Header: "Vehículos en Servicio con GPS",
                    accessor: 'vehículosEnServicioConGps'
                },
                {
                    Header: "% de Vehículos en Servicio con GPS",
                    accessor: '%DeVehículosEnServicioConGps'
                },
                {
                    Header: "N° Vehículos que Activaron Botón de Pánico",
                    accessor: 'n°VehículosQueActivaronBotónDePánico'
                },
                {
                    Header: "% de Alertas de Panico por Vehículos con GPS",
                    accessor: '%DeAlertasDePanicoPorVehículosConGps'
                },
                {
                    Header: "Total Kilómetros Recorridos 1→2",
                    accessor: 'totalKilómetrosRecorridosSentido12'
                },
                {
                    Header: "Total Kilómetros Recorridos 2→1",
                    accessor: 'totalKilómetrosRecorridosSentido21'
                }
                // ,
                // {
                //     Header: "Kilómetros Recorridos según Ruta",
                //     accessor: 'kmRecorridosRuta'
                // }
                // ,
                // {
                //     Header: "%  de Km Recorridos Rutas vs. GPS",
                //     accessor: 'porcKmRecorridosRutaGps'
                // },
                // {
                //     Header: "Total Kilómetros Recorridos válidos para Subsidio",
                //     accessor: 'totKmRecorridosSubsidio'
                // },
                // {
                //     Header: "Pago de Subsidio (S/.)",
                //     accessor: 'pagoSubsidio'
                // },
                // {
                //     Header: "Kilómetros Recorridos fuera de Ruta (según GPS)",
                //     accessor: 'kmRecorridosFueraRuta'
                // },
                // {
                //     Header: "% Km Recorridos Fuera de Ruta según GPS",
                //     accessor: 'porcKmRecorridosFueraRutaGps'
                // },
                // {
                //     Header: "Tiempo sin transmisión de GPS, en ambos sentidos (dias, horas, minutos)",
                //     accessor: 'tiempoTransmisionGps'
                // },
                // {
                //     Header: "Total Tiempo Acumulado en la Operación del Servicio (días y horas)",
                //     accessor: 'totTiempoAcumulado'
                // },
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
            const empresas = await ReporteService.getEmpresas(reporteId, fechaInicio.toLocaleDateString().split('/').join('-').split('-').reverse().join('-'), fechaFin.toLocaleDateString().split('/').join('-').split('-').reverse().join('-'));
            const total =
                [{
                    ide: 'Totales',
                    idEtt: '',
                    empresa: '',
                    rutas: getTotals(empresas.data.detalle, 'rutas'),
                    vehiculos: getTotals(empresas.data.detalle, 'vehiculos'),
                    '%ViajesCompletosSentido12': getPromedio(empresas.data.detalle, '%ViajesCompletosSentido12'),
                    '%ViajesCompletosSentido21': getPromedio(empresas.data.detalle, '%ViajesCompletosSentido21'),
                    '%DeTransmisiónDelGpsPorMinutoSentido12': getPromedio(empresas.data.detalle, '%DeTransmisiónDelGpsPorMinutoSentido12')+'.00%',
                    '%DeTransmisiónDelGpsPorMinutoSentido21': getPromedio(empresas.data.detalle, '%DeTransmisiónDelGpsPorMinutoSentido21')+'.00%',
                    velocidadMediaPorRutaSentido12: getPromedio(empresas.data.detalle, 'velocidadMediaPorRutaSentido12'),
                    velocidadMediaPorRutaSentido21: getPromedio(empresas.data.detalle, 'velocidadMediaPorRutaSentido21'),
                    vehículosEnServicioConGps: getTotals(empresas.data.detalle, 'vehículosEnServicioConGps'),
                    '%DeVehículosEnServicioConGps': getPromedio(empresas.data.detalle, '%DeVehículosEnServicioConGps')+'.00%',
                    'n°VehículosQueActivaronBotónDePánico': getTotals(empresas.data.detalle, 'n°VehículosQueActivaronBotónDePánico'),
                    '%DeAlertasDePanicoPorVehículosConGps': getPromedio(empresas.data.detalle, '%DeAlertasDePanicoPorVehículosConGps')+'.00%',
                    totalKilómetrosRecorridosSentido12: getTotals(empresas.data.detalle, 'totalKilómetrosRecorridosSentido12'),
                    totalKilómetrosRecorridosSentido21: getTotals(empresas.data.detalle, 'totalKilómetrosRecorridosSentido21'),
                    kmRecorridosRuta: getTotals(empresas.data.detalle, 'kmRecorridosRuta'),
                    porcKmRecorridosRutaGps: getTotals(empresas.data.detalle, 'porcKmRecorridosRutaGps'),
                    totKmRecorridosSubsidio: getTotals(empresas.data.detalle, 'totKmRecorridosSubsidio'),
                    pagoSubsidio: getTotals(empresas.data.detalle, 'pagoSubsidio'),
                    kmRecorridosFueraRuta: getTotals(empresas.data.detalle, 'kmRecorridosFueraRuta'),
                    porcKmRecorridosFueraRutaGps: getTotals(empresas.data.detalle, 'porcKmRecorridosFueraRutaGps'),
                    tiempoTransmisionGps: getTotals(empresas.data.detalle, 'tiempoTransmisionGps'),
                    totTiempoAcumulado: getTotals(empresas.data.detalle, 'totTiempoAcumulado')
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            setEmpresas(concatEmpresas);
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
                columns={columnsDet}
                data={empresas}
                pdfExport={{ columnsDet, empresas }}
                inicio={fechaInicio.toLocaleDateString().split('/').join('-')} final={fechaFin.toLocaleDateString().split('/').join('-')} />
            <br />
        </>
    );
}