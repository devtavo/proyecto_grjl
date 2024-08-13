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

export default function Reporte9({ reporteId }) {
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

    const handleClickRuta = (e, id, inicio, final,codigoRuta) => {
        e.preventDefault();
        setRutaId(id);
        setInicio(inicio);
        setFinal(final);
        setCodigoRuta(codigoRuta);
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
            name:'Reportes',
            path:'./'
        },
    ];
    if (vista === VISTA_EMPRESAS)
    return (
        <>
            <BackButton to='/reportes' bread={[{ name: 'Inicio', path: '../' }, { name: 'Supervision', path: '.' },{ name: 'Reportes', path: '../reportes' },{ name: 'Nivel Empresas', path: '.' }]} />
            <Navigation
                title="Cálculo de los kilómetros recorridos válidos para el pago de subsidios"
                breadcrumb={breadCrumb}
            />
            <Breadcrumb 
                title='Nivel Empresas'
                breadcrumb={[]}
            />
            <Empresas reporteId={reporteId} handleClickEmpresa={handleClickEmpresa} inicio={inicio} final={final} />
        </>
    );

if (vista === VISTA_RUTAS)
    return (
        <>
            <BackButton handleClickBack={handleClickBack} bread={[{ name: 'Inicio', path: '../' }, { name: 'Supervision', path: '.' },{ name: 'Reportes', path: '../reportes' },{ name: 'Nivel Empresas', path: '../reportes/1' },{ name: 'Nivel Rutas', path: '.' }]}  />
            <Navigation
                title="Cálculo de los kilómetros recorridos válidos para el pago de subsidios"
                breadcrumb={breadCrumb}
            />
            <Breadcrumb 
                title='Nivel Rutas'
                breadcrumb={[
                {
                name:'Nivel Empresas',
                path:'./9'
                }]}
            />
            <Rutas reporteId={reporteId} empresaId={empresaId} inicio={inicio} final={final} razonSocial={razonSocial} handleClickRuta={handleClickRuta} />
        </>
    );

if (vista === VISTA_VEHICULOS)
    return (
        <>
            <BackButton handleClickBack={handleClickBack} bread={[{ name: 'Inicio', path: '../' }, { name: 'Supervision', path: '.' },{ name: 'Reportes', path: '../reportes' },{ name: 'Nivel Empresas', path: '../reportes/1' },{ name: 'Nivel Rutas', path: '.' },{ name: 'Nivel Vehiculos', path: '.' }]}  />
            <Navigation
                title="Cálculo de los kilómetros recorridos válidos para el pago de subsidios"
                breadcrumb={breadCrumb}
            />
            <Breadcrumb 
                title='Nivel Vehículos'
                breadcrumb={[
                {
                    name:'Nivel Empresas',
                    path:'./9'
                },
                {
                    name:'Nivel Rutas',
                    path:'./9'
                }]}
            />
            <Vehiculos reporteId={reporteId} empresaId={empresaId} rutaId={rutaId} inicio={inicio} final={final} codigoRuta={codigoRuta} razonSocial={razonSocial}/>
        </>
    );
}