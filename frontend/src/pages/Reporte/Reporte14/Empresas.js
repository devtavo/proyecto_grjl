import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import Navigation from '../../../components/Navigation/Navigation';
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
import Breadcrumb from '../../../components/Navigation/Breadcrumb';
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
            console.log(empresas);
            const total =
                [{
                    id: '',
                    idEtt: '',
                    razonSocialEmpresa: 'Totales',
                    rutas: getTotals(empresas.data.detalle, 'rutas'),
                    buses: getTotals(empresas.data.detalle, 'buses'),
                    salidas12: getTotals(empresas.data.detalle, 'salidas12'),
                    viajesIncompletos12: getTotals(empresas.data.detalle, 'viajesIncompletos12'),
                    viajesCompletos12: getTotals(empresas.data.detalle, 'viajesCompletos12') ,
                    salidas21: getTotals(empresas.data.detalle, 'salidas21') ,
                    viajesIncompletos21: getTotals(empresas.data.detalle, 'viajesIncompletos21') ,
                    viajesCompletos21: getTotals(empresas.data.detalle, 'viajesCompletos21') ,
                    porcViajesCompletos12: getPromedio(empresas.data.detalle, 'porcViajesCompletos12') + '%' ,
                    porcViajesCompletos21: getPromedio(empresas.data.detalle, 'porcViajesCompletos21') + '%',
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            empresas.data.resumen[0].completos = getTotals(empresas.data.detalle, 'viajesCompletos12');
            empresas.data.resumen[1].completos = getTotals(empresas.data.detalle, 'viajesCompletos21');
            empresas.data.resumen[2].completos = parseInt((getTotals(empresas.data.detalle, 'viajesCompletos12')+getTotals(empresas.data.detalle, 'viajesCompletos21'))/2) ;
            empresas.data.resumen[0].porcentaje = getPromedio(empresas.data.detalle, 'porcViajesCompletos12')+'%';
            empresas.data.resumen[1].porcentaje = getPromedio(empresas.data.detalle, 'porcViajesCompletos21')+'%';
            empresas.data.resumen[2].porcentaje = parseInt((getPromedio(empresas.data.detalle, 'porcViajesCompletos12')+getPromedio(empresas.data.detalle, 'porcViajesCompletos21'))/2) +'%';

            setEmpresas(concatEmpresas);
            setResumen(empresas.data.resumen);
            console.log(concatEmpresas);
        };
        getEmpresas();

    }, [reporteId,inicio,final]);

    const columnsRes = [
        {
            Header: 'Tabla Resumen',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader:'center',
                    alignBody:'center',

                }, {
                    Header: 'Concepto',
                    accessor: 'concepto',
                },
                {
                    Header: 'Viajes Completos',
                    accessor: 'completos',
                    alignHeader:'center',
                    alignBody:'center',
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje',
                    alignHeader:'center',
                    alignBody:'center',
                },
            ],
            alignHeader: 'center',
        }
    ];   
    const columnsDet = [
        {
            Header: 'Reporte de Viajes por Empresas de Transporte Registradas',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader:'center',
                    alignBody:'center',
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
                    accessor:'razonSocialEmpresa'
                },
                
                {
                    Header: 'Salidas 1→2',
                    accessor: 'salidas12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes incompletos 1→2',
                    accessor: 'viajesIncompletos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes completos 1→2',
                    accessor: 'viajesCompletos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Salidas 2→1',
                    accessor: 'salidas21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes incompletos 2→1',
                    accessor: 'viajesIncompletos21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Viajes completos 2→1',
                    accessor: 'viajesCompletos21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% Viajes completos 1→2',
                    accessor: 'porcViajesCompletos12',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: '% Viajes completos 2-1',
                    accessor: 'porcViajesCompletos21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center',
        },
    ];

    // console.log(empresas.keys(columnsDet.columns));
    // console.log(columnsDet[0].columns);
    // console.log(empresas[0]);

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
                    rutas: getTotals(empresas.data.detalle, 'rutas'),
                    buses: getTotals(empresas.data.detalle, 'buses'),
                    salidas12: getTotals(empresas.data.detalle, 'salidas12'),
                    viajesIncompletos12: getTotals(empresas.data.detalle, 'viajesIncompletos12'),
                    viajesCompletos12: getTotals(empresas.data.detalle, 'viajesCompletos12') ,
                    salidas21: getTotals(empresas.data.detalle, 'salidas21') ,
                    viajesIncompletos21: getTotals(empresas.data.detalle, 'viajesIncompletos21') ,
                    viajesCompletos21: getTotals(empresas.data.detalle, 'viajesCompletos21') ,
                    porcViajesCompletos12: getPromedio(empresas.data.detalle, 'porcViajesCompletos12') + '%' ,
                    porcViajesCompletos21: getPromedio(empresas.data.detalle, 'porcViajesCompletos21') + '%',
                }];
            const concatEmpresas = [...empresas.data.detalle, ...total];
            empresas.data.resumen[0].completos = getTotals(empresas.data.detalle, 'viajesCompletos12');
            empresas.data.resumen[1].completos = getTotals(empresas.data.detalle, 'viajesCompletos21');
            empresas.data.resumen[2].completos = parseInt((getTotals(empresas.data.detalle, 'viajesCompletos12')+getTotals(empresas.data.detalle, 'viajesCompletos21'))/2) ;
            empresas.data.resumen[0].porcentaje = getPromedio(empresas.data.detalle, 'porcViajesCompletos12')+'%';
            empresas.data.resumen[1].porcentaje = getPromedio(empresas.data.detalle, 'porcViajesCompletos21')+'%';
            empresas.data.resumen[2].porcentaje = parseInt((getPromedio(empresas.data.detalle, 'porcViajesCompletos12')+getPromedio(empresas.data.detalle, 'porcViajesCompletos21'))/2) +'%';

            setEmpresas(concatEmpresas);
            setResumen(empresas.data.resumen);
            console.log(concatEmpresas);
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
                <div style={{ 
                    display: "flex", 
                    alignItems: "center",
                    height: '100%',
                    width:'100%' }}>
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