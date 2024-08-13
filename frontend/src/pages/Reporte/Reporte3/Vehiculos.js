import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import { getTotals, getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {
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
                    h5:getPromedio(vehiculos.data.sentido12, 'h5').toFixed(2),
                    h6:getPromedio(vehiculos.data.sentido12, 'h6').toFixed(2),
                    h7:getPromedio(vehiculos.data.sentido12, 'h7').toFixed(2),
                    h8:getPromedio(vehiculos.data.sentido12, 'h8').toFixed(2),
                    h9:getPromedio(vehiculos.data.sentido12, 'h9').toFixed(2),
                    h10:getPromedio(vehiculos.data.sentido12, 'h10').toFixed(2),
                    h11:getPromedio(vehiculos.data.sentido12, 'h11').toFixed(2),
                    h12:getPromedio(vehiculos.data.sentido12, 'h12').toFixed(2),
                    h13:getPromedio(vehiculos.data.sentido12, 'h13').toFixed(2),
                    h14:getPromedio(vehiculos.data.sentido12, 'h14').toFixed(2),
                    h15:getPromedio(vehiculos.data.sentido12, 'h15').toFixed(2),
                    h16:getPromedio(vehiculos.data.sentido12, 'h16').toFixed(2),
                    h17:getPromedio(vehiculos.data.sentido12, 'h17').toFixed(2),
                    h18:getPromedio(vehiculos.data.sentido12, 'h18').toFixed(2),
                    h19:getPromedio(vehiculos.data.sentido12, 'h19').toFixed(2),
                    h20:getPromedio(vehiculos.data.sentido12, 'h20').toFixed(2),
                    h21:getPromedio(vehiculos.data.sentido12, 'h21').toFixed(2),
                    h22:getPromedio(vehiculos.data.sentido12, 'h22').toFixed(2),
                    h23:getPromedio(vehiculos.data.sentido12, 'h23').toFixed(2),
                    h24:getPromedio(vehiculos.data.sentido12, 'h24').toFixed(2),
                    vAutorizados: getTotals(vehiculos.data.sentido12, 'vAutorizados').toFixed(2),
                    promedio: getPromedio(vehiculos.data.sentido12, 'promedio').toFixed(2)
                }];
            const total21 =
                [{
                    id: '',
                    placa: 'Totales',
                    h5:parseInt(getPromedio(vehiculos.data.sentido21, 'h5')).toFixed(2),
                    h6:parseInt(getPromedio(vehiculos.data.sentido21, 'h6')).toFixed(2),
                    h7:parseInt(getPromedio(vehiculos.data.sentido21, 'h7')).toFixed(2),
                    h8:parseInt(getPromedio(vehiculos.data.sentido21, 'h8')).toFixed(2),
                    h9:parseInt(getPromedio(vehiculos.data.sentido21, 'h9')).toFixed(2),
                    h10:parseInt(getPromedio(vehiculos.data.sentido21, 'h10')).toFixed(2),
                    h11:parseInt(getPromedio(vehiculos.data.sentido21, 'h11')).toFixed(2),
                    h12:parseInt(getPromedio(vehiculos.data.sentido21, 'h12')).toFixed(2),
                    h13:parseInt(getPromedio(vehiculos.data.sentido21, 'h13')).toFixed(2),
                    h14:parseInt(getPromedio(vehiculos.data.sentido21, 'h14')).toFixed(2),
                    h15:parseInt(getPromedio(vehiculos.data.sentido21, 'h15')).toFixed(2),
                    h16:parseInt(getPromedio(vehiculos.data.sentido21, 'h16')).toFixed(2),
                    h17:parseInt(getPromedio(vehiculos.data.sentido21, 'h17')).toFixed(2),
                    h18:parseInt(getPromedio(vehiculos.data.sentido21, 'h18')).toFixed(2),
                    h19:parseInt(getPromedio(vehiculos.data.sentido21, 'h19')).toFixed(2),
                    h20:parseInt(getPromedio(vehiculos.data.sentido21, 'h20')).toFixed(2),
                    h21:parseInt(getPromedio(vehiculos.data.sentido21, 'h21')).toFixed(2),
                    h22:parseInt(getPromedio(vehiculos.data.sentido21, 'h22')).toFixed(2),
                    h23:parseInt(getPromedio(vehiculos.data.sentido21, 'h23')).toFixed(2),
                    h24:parseInt(getPromedio(vehiculos.data.sentido21, 'h24')).toFixed(2),
                    vAutorizados: getTotals(vehiculos.data.sentido21, 'vAutorizados'),
                    promedio: getPromedio(vehiculos.data.sentido21, 'promedio').toFixed(2)
                }];
            const concatVehiculos12 = [...vehiculos.data.sentido12, ...total12];
            const concatVehiculos21 = [...vehiculos.data.sentido21, ...total21];

            vehiculos.data.resumen[0].kilometraje = getPromedio(vehiculos.data.sentido12, 'promedio')+' km/h';
            vehiculos.data.resumen[0].concepto = vehiculos.data.resumen[0].concepto + `:${codigoRuta}` + ` de la empresa ${razonSocial}`;
            vehiculos.data.resumen[1].kilometraje = getPromedio(vehiculos.data.sentido21, 'promedio')+' km/h';
            vehiculos.data.resumen[1].concepto = vehiculos.data.resumen[1].concepto + `:${codigoRuta}` + ` de la empresa ${razonSocial}`;
            vehiculos.data.resumen[2].kilometraje = (getPromedio(vehiculos.data.sentido12, 'promedio') + getPromedio(vehiculos.data.sentido21, 'promedio')) / 2 +' km/h';
            vehiculos.data.resumen[2].concepto = vehiculos.data.resumen[2].concepto + `:${codigoRuta}` + ` de la empresa ${razonSocial}`;

            setVehiculos12(concatVehiculos12);
            setVehiculos21(concatVehiculos21);
            setResumen(vehiculos.data.resumen);
        };
        getVehiculos();
    }, [reporteId, empresaId, rutaId, inicio, final]);

    const hourColumns = [...Array(25).keys()].filter(hour => hour >= 5).map(hour => {
        return {
            Header: `H-${hour} Km/h`,
            accessor: `h${hour}`,
            alignBody: 'center',
            alignHeader: 'center'
        }
    });
    const columnsRes =
        [
            {
                Header: 'Tabla Resumen',
                columns: [
                    {
                        Header: 'Concepto',
                        accessor: 'concepto',

                    },
                    {
                        Header: 'Kilometraje',
                        accessor: 'kilometraje',
                        align: 'center'
                    },
                ]
            }
        ];
    const columnsDet12 = [
        {
            Header: `Reporte de la Velocidad promedio de la ruta ${codigoRuta} de ${razonSocial}  1→2 desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Placa",
                    accessor: 'placa',
                    align: 'center'
                },
                ...hourColumns,
                {
                    Header: "Velocidad Media (km/h)",
                    accessor: 'promedio',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center'
        }];
    const columnsDet21 = [
        {
            Header: `Reporte de la Velocidad promedio de la ruta ${codigoRuta} de ${razonSocial} 2→1 desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Placa",
                    accessor: 'placa',
                    align: 'center'
                },
                ...hourColumns,
                {
                    Header: "Velocidad Media (km/h)",
                    accessor: 'promedio',
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
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen ,inicio, final }}
            />
            <br />
            <BasicTable
                columns={columnsDet21}
                data={vehiculos21}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen }}
            />
            <br />
            <BasicTable
                isReporte
                isVehiculo
                columns={columnsRes}
                data={resumen}
                pdfExport={{ columnsDet12, columnsDet21, columnsRes, vehiculos12, vehiculos21, resumen }}
            />

        </>
    );
}