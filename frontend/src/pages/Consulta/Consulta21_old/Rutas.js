import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Link from '@mui/material/Link';
import CharBarra from '../../../components/Charts/ChartBarra';

export default function Rutas({ consultaId, empresaId, inicio, final, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);
    const [rutasOpt,setRutasOpt]=useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ConsultaService.getRutas(consultaId, empresaId, inicio, final);
            setRutas(rutas.data.detalle);
            setRutasOpt(rutas.data.chart);
        };
        getRutas();
    }, [consultaId, empresaId, inicio, final]);

    const columns = [
        {
            Header: 'PROMEDIO DE KILÓMETROS RECORRIDOS POR RUTAS Y EMPRESAS',
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
                        const { id, codigoRuta } = rutas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickRuta(e, id, inicio, final)
                            }}>
                                {codigoRuta}
                            </Link>
                        );
                    },
                    align: 'center'
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
            <CharBarra options={rutasOpt}/>
            <BasicTable isExportable columns={columns} data={rutas} />
            
        </>
    );
}