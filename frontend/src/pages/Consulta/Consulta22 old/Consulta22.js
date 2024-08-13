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

export default function Consulta22({ consultaId }) {
    const [empresaId, setEmpresaId] = useState(0);
    const [razonSocial, setRazonSocial] = useState('');
    const [rutaId, setRutaId] = useState(0);
    const [rutaGlosa, setRutaGlosa] = useState(0);
    const [vista, setVista] = useState(VISTA_EMPRESAS);

    const handleClickBack = () => {
        if (vista === VISTA_RUTAS) setVista(VISTA_EMPRESAS);
        if (vista === VISTA_VEHICULOS) setVista(VISTA_RUTAS);
    }

    const handleClickEmpresa = (e, id, razonSocial) => {
        e.preventDefault();
        setEmpresaId(id);
        setRazonSocial(razonSocial);
        setVista(VISTA_RUTAS);
    }

    const handleClickRuta = (e, id, rutaGlosa) => {
        e.preventDefault();
        setRutaId(id);
        setRutaGlosa(rutaGlosa);
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
                    title="Cantidad de vehículos por geocerca, ruta, empresa, rango de fecha"
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
                    title="Cantidad de vehículos por geocerca, ruta, empresa, rango de fecha"
                    breadcrumb={breadCrumb}
                />
                <Breadcrumb 
                    title='Nivel Rutas'
                    breadcrumb={[
                    {
                    name:'Nivel Empresas',
                    path:'./22'
                    }]}
                />
                <Rutas consultaId={consultaId} empresaId={empresaId} razonSocial={razonSocial} handleClickRuta={handleClickRuta} />
            </>
        );

    if (vista === VISTA_VEHICULOS)
        return (
            <>
                <BackButton handleClickBack={handleClickBack} />
                <Navigation
                    title="Cantidad de vehículos por geocerca, ruta, empresa, rango de fecha"
                    breadcrumb={breadCrumb}
                />
                <Breadcrumb 
                    title='Nivel Vehículos'
                    breadcrumb={[
                    {
                        name:'Nivel Empresas',
                        path:'./22'
                    },
                    {
                        name:'Nivel Rutas',
                        path:'./22'
                    }]}
                />
                <Vehiculos consultaId={consultaId} empresaId={empresaId} razonSocial={razonSocial} rutaId={rutaId} rutaGlosa={rutaGlosa} />
            </>
        );
}