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

export default function Consulta10({ consultaId }) {
    const [empresaId, setEmpresaId] = useState(0);
    const [inicio, setInicio] = useState('');
    const [final, setFinal] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [codigoRuta, setCodigoRuta] = useState('');
    const [rutaId, setRutaId] = useState(0);
    const [vista, setVista] = useState(VISTA_EMPRESAS);

    const handleClickBack = () => {
        if (vista === VISTA_RUTAS) setVista(VISTA_EMPRESAS);
        if (vista === VISTA_VEHICULOS) setVista(VISTA_RUTAS);
    }

    const handleClickEmpresa = (e, id, inicio, final,razonSocial) => {
        e.preventDefault();
        setEmpresaId(id);
        setInicio(inicio);
        setFinal(final);
        setRazonSocial(razonSocial);
        setVista(VISTA_RUTAS);
    }

    const handleClickRuta = (e, id, inicio, final,codigoRuta,razonSocial) => {
        e.preventDefault();
        setRutaId(id);
        setInicio(inicio);
        setFinal(final);
        setCodigoRuta(codigoRuta);
        setRazonSocial(razonSocial);
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
                    title="Vehículos que no se detuvieron en paraderos autorizados"
                    breadcrumb={breadCrumb}
                />
                <Breadcrumb 
                    title='Nivel Empresas'
                    breadcrumb={[]}
                />
                <Empresas consultaId={consultaId} handleClickEmpresa={handleClickEmpresa} inicio={inicio} final={final}/>
            </>
        );

    if (vista === VISTA_RUTAS)
        return (
            <>
                <BackButton handleClickBack={handleClickBack} />
                <Navigation
                    title="Vehículos que no se detuvieron en paraderos autorizados"
                    breadcrumb={breadCrumb}
                />
                <Breadcrumb 
                    title='Nivel Rutas'
                    breadcrumb={[
                    {
                    name:'Nivel Empresas',
                    path:'./10'
                    }]}
                />
                <Rutas consultaId={consultaId} empresaId={empresaId} inicio={inicio} final={final} razonSocial={razonSocial} handleClickRuta={handleClickRuta} />
            </>
        );

    if (vista === VISTA_VEHICULOS)
        return (
            <>
                <BackButton handleClickBack={handleClickBack} />
                <Navigation
                    title="Vehículos que no se detuvieron en paraderos autorizados"
                    breadcrumb={breadCrumb}
                />
                <Breadcrumb 
                    title='Nivel Vehículos'
                    breadcrumb={[
                    {
                        name:'Nivel Empresas',
                        path:'./10'
                    },
                    {
                        name:'Nivel Rutas',
                        path:'./10'
                    }]}
                />
                <Vehiculos consultaId={consultaId} empresaId={empresaId} rutaId={rutaId} inicio={inicio} final={final} codigoRuta={codigoRuta} razonSocial={razonSocial} />
            </>
        );
}