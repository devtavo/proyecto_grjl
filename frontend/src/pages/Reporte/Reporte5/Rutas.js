import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';
import {  getTotals,getPromedio } from '../../../helper/helper';

export default function Rutas({ reporteId, empresaId, inicio, final, razonSocial,handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [resumen, setResumen] = useState([]);
    const [empresas,setEmpresas]=useState([]);
    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId, inicio,final);
            const total=
            [{ 
                id:'Totales',
                codigoRuta:'',
                vAutorizados:getTotals(rutas.data.detalle,'vAutorizados'),
                vConGps:getTotals(rutas.data.detalle,'vConGps'),
                aBotonPanico:getTotals(rutas.data.detalle,'aBotonPanico'),
                nVehiculosActBtn:getTotals(rutas.data.detalle,'nVehiculosActBtn'),
                pVehiculosServicioCGps:getPromedio(rutas.data.detalle,'pVehiculosServicioCGps') + '%',
            }];
            const concatRutas=[...rutas.data.detalle,...total];
            rutas.data.resumen[0].nAlertas=getTotals(rutas.data.detalle,'aBotonPanico');
            rutas.data.resumen[0].porcentaje=getPromedio(rutas.data.detalle,'pVehiculosServicioCGps') + '%';
            rutas.data.resumen[0].concepto=rutas.data.resumen[0].concepto+`${razonSocial}`;
            setRutas(concatRutas);
            setResumen(rutas.data.resumen);
            setEmpresas(concatRutas);
        };
        getRutas();
    }, [reporteId, empresaId, inicio, final]);

    const columnsRes=[
       
            {
                Header: 'Tabla Resumen',
                columns: [
                    {
                        Header: '#',
                        accessor: 'id',
                        alignHeader: 'center',
                    alignBody:'center',
    
                    },{
                        Header: 'Concepto',
                        accessor: 'concepto',
                    },
                    {
                        Header: 'Numero alertas',
                        accessor: 'nAlertas',
                        alignHeader: 'center',
                        alignBody:'center',
                    },
                    {
                        Header: 'Porcentaje',
                        accessor: 'porcentaje',
                        alignHeader: 'center',
                        alignBody:'center',
                    },
                ],
                alignHeader:'center'
            }
    ];
    const columnsDet = [
        {
            Header: `Reporte de Vehículos con GPS de todas las rutas de la empresa ${razonSocial} desde ${inicio} al ${final}`,
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    alignHeader: 'center',
                    alignBody:'center',
                },
                {
                    Header: "Ruta",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { idRuta, codigoRuta } = rutas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, idRuta, inicio, final, codigoRuta,razonSocial)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                    accessor: 'codigoRuta'

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

    return (
        <>
            <BasicTable
                props={`Reporte ${reporteId} - ${columnsDet[0].Header}`}
                isExportable
                isReporte
                columns={columnsDet}
                data={rutas}
                pdfExport={{columnsDet,columnsRes,empresas,resumen,inicio, final }}
            />
            <br />
            <BasicTable
                columns={columnsRes}
                data={resumen}
                pdfExport={{columnsDet,columnsRes,empresas,resumen}}    

            />
        </>
    );
}