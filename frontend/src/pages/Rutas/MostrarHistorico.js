import { useState, useEffect, useParams } from "react";
import BasicTable from '../../components/Table/Table';
import RutaService from '../../services/RutaService';
import useStyle from './style';


export default function MostrarHistorico({idRuta}) {
    var classes = useStyle();

    const [rutas, setRutas] = useState([]);

    useEffect(() => {
        const getRutas = async () => {
            const rutas = await RutaService.getRutasHistorico(
                { 'idRuta':idRuta}
            );
            setRutas(rutas.data);
        };
        getRutas();
    }, []);

    const columns = [
        {
            Header: ' ',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: 'Fecha de cambio',
                    accessor: 'fechaCambio',
                },
                {
                    Header: 'Motivo',
                    accessor: 'motivo',
                },

            ],
        },
    ];

    return (
        <>

            <BasicTable
                columns={columns}
                data={rutas}
                className={classes.container}
            />
        </>
    );
}