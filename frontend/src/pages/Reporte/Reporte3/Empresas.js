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
            const empresas = await ReporteService.getEmpresas(reporteId, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'));
            const total =
                [{
                    id: '',
                    idEtt: '',
                    razonSocialEmpresa: 'Totales',
                    longitud: getTotals(empresas.data.detalle, 'longitud'),
                    nParadasRuta: getTotals(empresas.data.detalle, 'nParadasRuta'),
                    nViajesCompleto: getTotals(empresas.data.detalle, 'nViajesCompleto'),
                    vMediaRuta12: getPromedio(empresas.data.detalle, 'vMediaRuta12'),
                    vMediaRuta21: getPromedio(empresas.data.detalle, 'vMediaRuta21') ,
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            empresas.data.resumen[0].kilometraje = getPromedio(empresas.data.detalle, 'vMediaRuta12')+' km/h';
            empresas.data.resumen[1].kilometraje = getPromedio(empresas.data.detalle, 'vMediaRuta21')+' km/h';
            empresas.data.resumen[2].kilometraje = (getPromedio(empresas.data.detalle, 'vMediaRuta12')+getPromedio(empresas.data.detalle, 'vMediaRuta21'))/2+' km/h';

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
                    alignBody:'center',

                }, 
                {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Kilometraje',
                    accessor: 'kilometraje',
                    alignHeader:'center',
                    alignBody:'center',
                },
            ],
            alignHeader: 'center'
        }
    ];

    const columnsDet = [
        {
            Header: 'Reporte de la Velocidad promedio por Empresas de Transporte Registradas',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader:'center',
                    alignBody:'center',
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
                                handleClickEmpresa(e, idEtt, fechaInicio.toLocaleDateString().split('/').join('-'), fechaFin.toLocaleDateString().split('/').join('-'),razonSocialEmpresa)
                            }}>
                                {razonSocialEmpresa}
                            </Link>
                        );
                    },                    
                    accessor:'razonSocialEmpresa'

                },
                {
                    Header: 'Longitud de las Rutas (Km)',
                    accessor: 'longitud',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Paraderos en las Rutas',
                    accessor: 'nParadasRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes Completos',
                    accessor: 'nViajesCompleto',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad promedio por Ruta 1→2',
                    accessor: 'vMediaRuta12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Velocidad promedio por Ruta 2→1',
                    accessor: 'vMediaRuta21',
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
                    id: '',
                    idEtt: '',
                    razonSocialEmpresa: 'Totales',
                    longitud: getTotals(empresas.data.detalle, 'longitud'),
                    nParadasRuta: getTotals(empresas.data.detalle, 'nParadasRuta'),
                    nViajesCompleto: getTotals(empresas.data.detalle, 'nViajesCompleto'),
                    vMediaRuta12: getPromedio(empresas.data.detalle, 'vMediaRuta12'),
                    vMediaRuta21: getPromedio(empresas.data.detalle, 'vMediaRuta21') ,
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            empresas.data.resumen[0].kilometraje = getPromedio(empresas.data.detalle, 'vMediaRuta12')+' km/h';
            empresas.data.resumen[1].kilometraje = getPromedio(empresas.data.detalle, 'vMediaRuta21')+' km/h';
            empresas.data.resumen[2].kilometraje = (getPromedio(empresas.data.detalle, 'vMediaRuta12')+getPromedio(empresas.data.detalle, 'vMediaRuta21'))/2+' km/h';

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