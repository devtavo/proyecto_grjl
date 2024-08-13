import { useState } from 'react';
import Rutas from './Rutas';
import Vehiculos from './Vehiculos';
import Empresas from './Empresas';

import BackButton from '../../../components/BackButton/BackButton';
import Navigation from '../../../components/Navigation/Navigation';
import Breadcrumb from '../../../components/Navigation/Breadcrumb';

const VISTA_EMPRESAS = 'VISTA_EMPRESAS';
const VISTA_RUTAS = 'VISTA_RUTAS';
const VISTA_VEHICULOS = 'VISTA_VEHICULOS';

export default function Consulta24({ consultaId }) {
    const [empresaId, setEmpresaId] = useState(0);
    const [rutaId, setRutaId] = useState(0);
    const [inicio, setInicio] = useState('');
    const [final, setFinal] = useState('');
    const [vista, setVista] = useState(VISTA_EMPRESAS);

    const handleClickBack = () => {
        if (vista === VISTA_RUTAS) setVista(VISTA_EMPRESAS);
        if (vista === VISTA_VEHICULOS) setVista(VISTA_RUTAS);
    }

    const handleClickEmpresa = (e, id,inicio, final) => {
        e.preventDefault();
        setEmpresaId(id);
        setInicio(inicio);
        setFinal(final);
        setVista(VISTA_RUTAS);
    }

    const handleClickRuta = (e, id,inicio, final) => {
        e.preventDefault();
        setRutaId(id);
        setInicio(inicio);
        setFinal(final);
        setVista(VISTA_VEHICULOS);
    }

    const breadCrumb=[
        {
            name:'Inicio',
            path:'../'
        },
        {
            name:'Supervisión',
            path:'../'
        },
        {
            name:'Consultas',
            path:'./'
        },
    ];

    if (vista === VISTA_EMPRESAS)
        return (
            <>
                <BackButton to='/consultas' />
                <Navigation
                    title="Ranking de empresas de transporte según kilómetros recorridos en servicio"
                    breadcrumb={breadCrumb}
                />
                <Breadcrumb 
                    title='Nivel Empresas'
                    breadcrumb={[]}
                />
                <Empresas consultaId={consultaId} handleClickEmpresa={handleClickEmpresa} />
            </>
        );

    if (vista === VISTA_RUTAS)
        return (
            <>
                <BackButton handleClickBack={handleClickBack} />
                <Navigation
                    title="Ranking de empresas de transporte según kilómetros recorridos en servicio"
                    breadcrumb={breadCrumb}
                />
                <Breadcrumb 
                    title='Nivel Rutas'
                    breadcrumb={[
                    {
                    name:'Nivel Empresas',
                    path:'./24'
                    }]}
                />
                <Rutas consultaId={consultaId} empresaId={empresaId} inicio={inicio} final={final} handleClickRuta={handleClickRuta} />
            </>
        );

    if (vista === VISTA_VEHICULOS)
        return (
            <>
                <BackButton handleClickBack={handleClickBack} />
                <Navigation
                    title="Ranking de empresas de transporte según kilómetros recorridos en servicio"
                    breadcrumb={breadCrumb}
                />
                <Breadcrumb 
                    title='Nivel Vehículos'
                    breadcrumb={[
                    {
                        name:'Nivel Empresas',
                        path:'./24'
                    },
                    {
                        name:'Nivel Rutas',
                        path:'./24'
                    }]}
                />
                <Vehiculos consultaId={consultaId} empresaId={empresaId} rutaId={rutaId} inicio={inicio} final={final} />
            </>
        );
}