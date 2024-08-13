import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Link from '@mui/material/Link';
import CharBarra from '../../../components/Charts/ChartBarra';

export default function Rutas({ consultaId, empresaId, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [rutasOpt,setRutasOpt]=useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ConsultaService.getRutas(consultaId, empresaId);
            setRutas(rutas.data.detalle);
            setRutasOpt(rutas.data.chart);
        };
        getRutas();
    }, [consultaId, empresaId]);

    const columns = [
        {
            Header: 'KILÓMETROS RECORRIDOS FUERA DE RUTA',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                    align: 'center'
                },
                {
                    Header: "Ruta",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { id, ruta } = rutas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, id)
                            }}>
                                {ruta}
                            </Link>
                        );
                    },
                    align: 'center'
                },
                {
                    Header: 'Kilómetros recorridos en Ruta',
                    accessor: 'kmRecorridosRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Kilómetros recorridos fuera de Ruta',
                    accessor: 'kmRecorridosFueraRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },
                {
                    Header: 'Porcentaje de Kilómetros Recorridos fuera de Ruta',
                    accessor: 'porcKmRecorridosFueraRuta',
                    alignBody: 'center',
                    alignHeader: 'center'
                },       
            ],
            alignHeader: 'center',
        },
    ];

    return (
        <>
            <CharBarra options={rutasOpt}/>
            <BasicTable isExportable columns={columns} data={rutas} />
            
        </>
    );
}