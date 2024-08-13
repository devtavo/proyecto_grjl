import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import { getTotals, getPromedio } from '../../../helper/helper';

export default function Vehiculos({ reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {
    const [vehiculos12, setVehiculos12] = useState([]);
    const [vehiculos21, setVehiculos21] = useState([]);
    const [empresas12, setEmpresas12] = useState([]);
    const [empresas21, setEmpresas21] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ReporteService.getVehiculos(reporteId, empresaId, rutaId, inicio, final);
            const total12 =
                [{
                    id: '',
                    placa: 'Totales',
                    h05: parseInt(getPromedio(vehiculos.data.sentido12, 'h05')).toFixed(0) + ' %',
                    h06: parseInt(getPromedio(vehiculos.data.sentido12, 'h06')).toFixed(0) + ' %',
                    h07: parseInt(getPromedio(vehiculos.data.sentido12, 'h07')).toFixed(0) + ' %',
                    h08: parseInt(getPromedio(vehiculos.data.sentido12, 'h08')).toFixed(0) + ' %',
                    h09: parseInt(getPromedio(vehiculos.data.sentido12, 'h09')).toFixed(0) + ' %',
                    h10: parseInt(getPromedio(vehiculos.data.sentido12, 'h10')).toFixed(0) + ' %',
                    h11: parseInt(getPromedio(vehiculos.data.sentido12, 'h11')).toFixed(0) + ' %',
                    h12: parseInt(getPromedio(vehiculos.data.sentido12, 'h12')).toFixed(0) + ' %',
                    h13: parseInt(getPromedio(vehiculos.data.sentido12, 'h13')).toFixed(0) + ' %',
                    h14: parseInt(getPromedio(vehiculos.data.sentido12, 'h14')).toFixed(0) + ' %',
                    h15: parseInt(getPromedio(vehiculos.data.sentido12, 'h15')).toFixed(0) + ' %',
                    h16: parseInt(getPromedio(vehiculos.data.sentido12, 'h16')).toFixed(0) + ' %',
                    h17: parseInt(getPromedio(vehiculos.data.sentido12, 'h17')).toFixed(0) + ' %',
                    h18: parseInt(getPromedio(vehiculos.data.sentido12, 'h18')).toFixed(0) + ' %',
                    h19: parseInt(getPromedio(vehiculos.data.sentido12, 'h19')).toFixed(0) + ' %',
                    h20: parseInt(getPromedio(vehiculos.data.sentido12, 'h20')).toFixed(0) + ' %',
                    h21: parseInt(getPromedio(vehiculos.data.sentido12, 'h21')).toFixed(0) + ' %',
                    h22: parseInt(getPromedio(vehiculos.data.sentido12, 'h22')).toFixed(0) + ' %',
                    h23: parseInt(getPromedio(vehiculos.data.sentido12, 'h23')).toFixed(0) + ' %',
                    h24: parseInt(getPromedio(vehiculos.data.sentido12, 'h24')).toFixed(0) + ' %',
                    porcSentido: getPromedio(vehiculos.data.sentido12, 'porcSentido').toFixed(0) + ' %'
                }];
            const total21 =
                [{
                    id: '',
                    placa: 'Totales',
                    h05: parseInt(getPromedio(vehiculos.data.sentido21, 'h05')).toFixed(0) + ' %',
                    h06: parseInt(getPromedio(vehiculos.data.sentido21, 'h06')).toFixed(0) + ' %',
                    h07: parseInt(getPromedio(vehiculos.data.sentido21, 'h07')).toFixed(0) + ' %',
                    h08: parseInt(getPromedio(vehiculos.data.sentido21, 'h08')).toFixed(0) + ' %',
                    h09: parseInt(getPromedio(vehiculos.data.sentido21, 'h09')).toFixed(0) + ' %',
                    h10: parseInt(getPromedio(vehiculos.data.sentido21, 'h10')).toFixed(0) + ' %',
                    h11: parseInt(getPromedio(vehiculos.data.sentido21, 'h11')).toFixed(0) + ' %',
                    h12: parseInt(getPromedio(vehiculos.data.sentido21, 'h12')).toFixed(0) + ' %',
                    h13: parseInt(getPromedio(vehiculos.data.sentido21, 'h13')).toFixed(0) + ' %',
                    h14: parseInt(getPromedio(vehiculos.data.sentido21, 'h14')).toFixed(0) + ' %',
                    h15: parseInt(getPromedio(vehiculos.data.sentido21, 'h15')).toFixed(0) + ' %',
                    h16: parseInt(getPromedio(vehiculos.data.sentido21, 'h16')).toFixed(0) + ' %',
                    h17: parseInt(getPromedio(vehiculos.data.sentido21, 'h17')).toFixed(0) + ' %',
                    h18: parseInt(getPromedio(vehiculos.data.sentido21, 'h18')).toFixed(0) + ' %',
                    h19: parseInt(getPromedio(vehiculos.data.sentido21, 'h19')).toFixed(0) + ' %',
                    h20: parseInt(getPromedio(vehiculos.data.sentido21, 'h20')).toFixed(0) + ' %',
                    h21: parseInt(getPromedio(vehiculos.data.sentido21, 'h21')).toFixed(0) + ' %',
                    h22: parseInt(getPromedio(vehiculos.data.sentido21, 'h22')).toFixed(0) + ' %',
                    h23: parseInt(getPromedio(vehiculos.data.sentido21, 'h23')).toFixed(0) + ' %',
                    h24: parseInt(getPromedio(vehiculos.data.sentido21, 'h24')).toFixed(0) + ' %',
                    porcSentido: getPromedio(vehiculos.data.sentido21, 'porcSentido').toFixed(0) + ' %'
                }];
            const concatVehiculos12 = [...vehiculos.data.sentido12, ...total12];
            const concatVehiculos21 = [...vehiculos.data.sentido21, ...total21];

            vehiculos.data.resumen[0].porcentaje = getPromedio(vehiculos.data.sentido12, 'porcSentido') + ' %';
            vehiculos.data.resumen[0].concepto = vehiculos.data.resumen[0].concepto;
            vehiculos.data.resumen[1].porcentaje = getPromedio(vehiculos.data.sentido21, 'porcSentido') + ' %';
            vehiculos.data.resumen[1].concepto = vehiculos.data.resumen[1].concepto;
            vehiculos.data.resumen[2].porcentaje = (getPromedio(vehiculos.data.sentido12, 'porcSentido') + getPromedio(vehiculos.data.sentido21, 'porcSentido')) / 2 + ' %';
            vehiculos.data.resumen[2].concepto = vehiculos.data.resumen[2].concepto;

            setVehiculos12(concatVehiculos12);
            setVehiculos21(concatVehiculos21);
            setEmpresas12(concatVehiculos12);
            setEmpresas21(concatVehiculos21);
            setResumen(vehiculos.data.resumen);

        };
        getVehiculos();
    }, [reporteId, empresaId, rutaId, inicio, final]);

    const hourColumns = [...Array(25).keys()].filter(hour => hour >= 5).map(hour => {
        return {
            Header: hour > 9 ? `H-${hour}` : `H-0${hour}`,
            accessor: hour > 9 ? `h${hour}` : `h0${hour}`,
            alignBody: 'center',
            alignHeader: 'center'
        }
    });

    const columnsRes = [{
        Header: `Tabla Resumen de la ruta ${codigoRuta} de la empresa ${razonSocial}`,
        columns: [
            {
                Header: '#',
                accessor: 'id'
            },
            {
                Header: 'Concepto',
                accessor: 'concepto'
            },
            {
                Header: 'Porcentaje',
                accessor: 'porcentaje',
                alignBody: 'center',
                alignHeader: 'center'
            },
        ]
    }];
    const columnsDet12 = [
        {
            Header: `Reporte de transmision de GPS en sentido 1-2 de la ruta ${codigoRuta} de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Placa",
                    accessor: 'placa',
                },
                ...hourColumns,
                {
                    Header: "% de transmisión del GPS por minuto Sentido 1-2",
                    accessor: 'porcSentido',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center'
        }];

    const columnsDet21 = [
        {
            Header: `Reporte de transmision de GPS en sentido 2-1 de la ruta ${codigoRuta} de la empresa ${razonSocial} desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Placa",
                    accessor: 'placa',
                },
                ...hourColumns,
                {
                    Header: "% de transmisión del GPS por minuto Sentido 2-1",
                    accessor: 'porcSentido',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center'
        }];

    return (
        <>
            <BasicTable
                props={`Reporte ${reporteId} - ${columnsDet12[0].Header}`}
                isExportable
                isReporte
                isVehiculo
                columns={columnsDet12}
                data={vehiculos12}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen, inicio, final }}

            />
            <br />
            <BasicTable
                columns={columnsDet21}
                data={vehiculos21}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen, inicio, final }}
            />
            <br />

            <BasicTable
                isReporte
                isVehiculo
                columns={columnsRes}
                data={resumen}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen ,inicio, final}}

            />
        </>
    );
}