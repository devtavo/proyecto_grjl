import { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import BasicTable from '../../../components/Table/Table';
import ConsultaService from '../../../services/ConsultaService';
import Paper from '@mui/material/Paper';
import CharBarra from '../../../components/Charts/ChartBarra';

export default function Empresas({ consultaId, handleClickEmpresa }) {
    const [empresas, setEmpresas] = useState([]);
    const [empresasOpt,setEmpresaOpt]=useState([]);

    useEffect(() => {
        const getEmpresas = async () => {
            const empresas = await ConsultaService.getEmpresas(consultaId);
            setEmpresas(empresas.data.detalle);
            setEmpresaOpt(empresas.data.chart);
            console.log(empresas);
        };
        getEmpresas();
    }, [consultaId]);

    const columnsDet = [
        {
            Header: 'KILÓMETROS RECORRIDOS FUERA DE RUTA',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: "Empresa",
                    Cell: (props) => {
                        const rowIdx = props.row.id;
                        const { id, empresa } = empresas[rowIdx];

                        return (
                            <Link href="#" underline="none" onClick={(e) => {
                                handleClickEmpresa(e, id)
                            }}>
                                {empresa}
                            </Link>
                        );
                    }
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
            <CharBarra options={empresasOpt}/>
            <BasicTable isExportable columns={columnsDet} data={empresas} />
        </>
    );
}