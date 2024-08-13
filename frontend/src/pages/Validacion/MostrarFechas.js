import { useState, useEffect, useParams } from "react";
import BasicTable from '../../components/Table/Table';


export default function MostrarFechas({fechas}) {

    const [fecha, setFecha] = useState(fechas);
    

    const columns = [
        {
            Header: ' ',
            columns: [
                {
                    Header: '#',
                    accessor: 'id',
                },
                {
                    Header: 'Fecha',
                    accessor: 'fecha',
                },
                {
                    Header: 'Cantidad',
                    accessor: 'cantidad',
                },
            ],
        },
    ];

    return (
        <>

            <BasicTable
                columns={columns}
                data={fecha}
            />
        </>
    );
}