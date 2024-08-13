import { useState, useEffect } from 'react';
import BasicTable from '../../../components/Table/Table';
import ReporteService from '../../../services/ReporteService';
import Link from '@mui/material/Link';

export default function Rutas({ reporteId, empresaId, handleClickRuta }) {
    const [rutas, setRutas] = useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await ReporteService.getRutas(reporteId, empresaId);
            setRutas(rutas.data.detalle);
        };
        getRutas();
    }, [reporteId, empresaId]);

    const columns = [
        {
            Header: 'Reporte del tiempo acumulado de los Vehículos en la prestación del Servicio, por Rutas (en días y horas) ',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
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
                    accessor: 'codigoRuta'

                },
                {
                    Header: 'Total Tiempo Acumulado en la Operación del Servicio (días y horas)',
                    accessor: 'totTiempoAcumuladoOS',
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
                isExportable
                columns={columns}
                data={rutas}
            />

        </>
    );
}