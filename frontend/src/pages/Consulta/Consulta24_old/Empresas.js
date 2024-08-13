import { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Paper from '@mui/material/Paper';
import CharBarra from '../../../components/Charts/ChartBarra';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import * as React from 'react';
import Box from '@mui/material/Box';
import { fechaActual, restarDias } from '../../../helper/helper';


export default function Empresas({ consultaId, handleClickEmpresa }) {
    const fecha = new Date();
    const diaAnteriorConformato = fechaActual(fecha, 'dd-mm-yyyy')
    const diaAnteriorSinformato = restarDias(fecha, -1);

    const [empresas, setEmpresas] = useState([]);
    const [empresasOpt, setEmpresaOpt] = useState([]);
    const [value, setValue] = useState([diaAnteriorSinformato, diaAnteriorSinformato]);
    const [inicio, setInicio] = useState(diaAnteriorConformato);
    const [final, setFinal] = useState(diaAnteriorConformato);

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await ConsultaService.getEmpresas(consultaId, inicio, final);
            setEmpresas(empresas.data.detalle);
            setEmpresaOpt(empresas.data.chart);
        };
        getEmpresas();
    }, [consultaId, inicio, final]);

    const columnsDet = [
        {
            Header: 'RANKING DE EMPRESAS DE TRANSPORTE SEGÚN KILÓMETROS RECORRIDOS EN SERVICIO',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Empresa",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { id, razonSocialEmpresa } = empresas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickEmpresa(e, id, inicio, final)
                            }}>
                                {razonSocialEmpresa}
                            </Link>
                        );
                    }
                },
                {
                    Header: 'Kilómetros Recorridos',
                    accessor: 'kmRecorridos',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
            <Stack direction="row" spacing={1} style={{ float: 'left' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateRangePicker
                        startText="Fecha inicio"
                        endText="Fecha fin"
                        value={value}
                        clearable={true}
                        calendars={2}
                        inputFormat='dd-MM-yyyy'

                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        renderInput={(startProps, endProps) => (
                            <React.Fragment>
                                {setInicio(startProps.inputProps?.value)}
                                {setFinal(endProps.inputProps?.value)}
                                <TextField  {...startProps} />
                                <Box sx={{ mx: 3 }}> al </Box>
                                <TextField {...endProps} />
                            </React.Fragment>
                        )}
                    />
                </LocalizationProvider>
                {/* <Button color="primary" variant="contained" type="submit" onClick={()=>{filtrar()}}>
                Filtrar
            </Button> */}
            </Stack>
            <br />
            <br />
            <CharBarra options={empresasOpt} />
            <BasicTable isExportable columns={columnsDet} data={empresas} />
        </>
    );
}