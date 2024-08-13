import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import Navigation from '../../../components/Navigation/Navigation';
import Breadcrumb from '../../../components/Navigation/Breadcrumb';
import ReporteService from '../../../services/ReporteService';
import { getTotals, getPromedio } from '../../../helper/helper';

export default function Vehiculos({ reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial,setShowVehiculos }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculos = await ReporteService.getVehiculos(reporteId, empresaId, rutaId,inicio,final);
            const total =
                [{
                    id: '',
                    placa: 'Totales',
                    salidas12: getTotals(vehiculos.data.detalle, 'salidas12'),
                    viajesIncompletos12: getTotals(vehiculos.data.detalle, 'viajesIncompletos12'),
                    viajesCompletos12: getTotals(vehiculos.data.detalle, 'viajesCompletos12'),
                    salidas21: getTotals(vehiculos.data.detalle, 'salidas21'),
                    viajesIncompletos21: getTotals(vehiculos.data.detalle, 'viajesIncompletos21'),
                    viajesCompletos21: getTotals(vehiculos.data.detalle, 'viajesCompletos21'),
                    porcViajesCompletos12: getPromedio(vehiculos.data.detalle, 'porcViajesCompletos12') + '%',
                    porcViajesCompletos21: getPromedio(vehiculos.data.detalle, 'porcViajesCompletos21') + '%',
                }];

            const concatVehiculos = [...vehiculos.data.detalle, ...total];
            vehiculos.data.resumen[0].concepto = vehiculos.data.resumen[0].concepto ;
            vehiculos.data.resumen[1].concepto = vehiculos.data.resumen[1].concepto ;
            vehiculos.data.resumen[2].concepto = vehiculos.data.resumen[2].concepto ;

            vehiculos.data.resumen[0].completos = getTotals(vehiculos.data.detalle, 'viajesCompletos12');
            vehiculos.data.resumen[1].completos = getTotals(vehiculos.data.detalle, 'viajesCompletos21');
            vehiculos.data.resumen[2].completos = parseInt((getTotals(vehiculos.data.detalle, 'viajesCompletos12') + getTotals(vehiculos.data.detalle, 'viajesCompletos21')) / 2);
            vehiculos.data.resumen[0].porcentaje = getPromedio(vehiculos.data.detalle, 'porcViajesCompletos12') + '%';
            vehiculos.data.resumen[1].porcentaje = getPromedio(vehiculos.data.detalle, 'porcViajesCompletos21') + '%';
            vehiculos.data.resumen[2].porcentaje = parseInt((getPromedio(vehiculos.data.detalle, 'porcViajesCompletos12') + getPromedio(vehiculos.data.detalle, 'porcViajesCompletos21')) / 2 )+ '%';

            setVehiculos(concatVehiculos);
            setEmpresas(concatVehiculos);
            setResumen(vehiculos.data.resumen);
        };
        getVehiculos();
    }, [reporteId, empresaId, rutaId,inicio,final]);

    const columnsRes = [
        {
            Header: `Tabla Resumen de la ruta ${codigoRuta} de ${razonSocial}`,
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
                    Header: 'Viajes Completos',
                    accessor: 'completos',
                    alignHeader: 'center',
                    alignBody: 'center'
                },
                {
                    Header: 'Porcentaje',
                    accessor: 'porcentaje',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center',
        }
    ];
    const columnsDet = [
        {
            Header: `Reporte de Viajes de la ruta ${codigoRuta} de la empresa ${razonSocial}  desde el ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody: 'center'
                },
                {
                    Header: "Placa Vehiculo",
                    accessor: 'placa',
                    alignHeader: 'center',
                    alignBody: 'center',
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
                    Header: '% Viajes completos 2→1',
                    accessor: 'porcViajesCompletos21',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
            ],
            alignHeader: 'center',
        },
    ];

  
    return (
        <>
            
            <BasicTable 
            props={`Reporte ${reporteId} - ${columnsDet[0].Header}`}
            isExportable 
            isReporte
            columns={columnsDet} 
            data={vehiculos}
            pdfExport={{ columnsDet, columnsRes, empresas, resumen ,inicio,final}}
            />
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