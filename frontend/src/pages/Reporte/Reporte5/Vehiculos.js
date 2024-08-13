import { useState, useEffect } from 'react';
import { Popup } from 'react-leaflet';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Map from '../../../components/Map/Map';
import Marker from '../../../components/Marker/Marker';
import TabPanel from '../../../components/TabPanel/TabPanel';
import ReporteService from '../../../services/ReporteService';

const markers = [
    [-16.418091361839714, -71.54817598557482],
    [-16.40742937600073, -71.5253687754693],
    [-16.406321603702487, -71.54586639467807]
];

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Title = ({ title }) => {
    return <b>{title}</b>
}

function PopupDet() {
    const obj = {
        transmision: {
            latitud: -16.36261510607744,
            longitud: -71.53738302548516,
            velocidad: 50,
            orientacion: 85,
            fechaEmv: '19/10/2021 20:38:03',
            fechaRecepcion: '19/10/2021 20:39:04'
        },
        vehiculo: {
            placa: 'AVX107',
            anioFab: '2010',
            estado: 'Activo',
            codigoSoat: '0011304848',
            vencimientoSoat: '23/08/2022'
        },
        ett: {
            ruc: '20123356366',
            razonSocial: 'ET. El Rápido MML S.A',
            direccion: 'Caudivilla Huacoy P Nro. 182a Coo. Agraria de Usuarios',
            fechaRegistro: '23/09/2015',
            estado: 'Activo',
            telefono: '997411544 - 2254144',
            correo: 'et_elrapido@gmail.com',
        },
        emv: {
            ruc: '20123356366',
            razonSocial: 'JH Monitoring EIRL',
            direccion: 'Caudivilla Huacoy P Nro. 182a Coo. Agraria de Usuarios',
            fechaRegistro: '23/09/2015',
            estado: 'Activo',
            telefono: '997411544 - 2254144',
            correo: 'monitoreo11@gmail.com',
        },
    };

    const [tab, setTab] = useState(0);

    const handleChange = (event, newValue) => {
        setTab(parseInt(newValue));
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Transmisión" {...a11yProps(0)} />
                    <Tab label="Vehículo" {...a11yProps(1)} />
                    <Tab label="EETT" {...a11yProps(2)} />
                    <Tab label="EMV" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <Title title='Latitud' />: {obj.transmision.latitud} <br />
                <Title title='Longitud' />: {obj.transmision.longitud} <br />
                <Title title='Velocidad' />: {obj.transmision.velocidad} <br />
                <Title title='Orientación' />: {obj.transmision.orientacion} <br />
                <Title title='Fecha EMV' />: {obj.transmision.fechaEmv} <br />
                <Title title='Fecha recepción coordenada' />: {obj.transmision.fechaRecepcion}
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Title title='Placa' />: {obj.vehiculo.placa} <br />
                <Title title='Año de fabricación' />: {obj.vehiculo.anioFab} <br />
                <Title title='Estado' />: {obj.vehiculo.estado} <br />
                <Title title='Código SOAT' />: {obj.vehiculo.codigoSoat} <br />
                <Title title='Vencimiento SOAT' />: {obj.vehiculo.vencimientoSoat}
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <Title title='Ruc' />: {obj.ett.ruc} <br />
                <Title title='Razón social' />: {obj.ett.razonSocial} <br />
                <Title title='Dirección' />: {obj.ett.direccion} <br />
                <Title title='Fecha de registro' />: {obj.ett.fechaRegistro} <br />
                <Title title='Estado' />: {obj.ett.estado} <br />
                <Title title='Teléfono' />: {obj.ett.telefono} <br />
                <Title title='Correo' />: {obj.ett.correo}
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <Title title='Ruc' />: {obj.emv.ruc} <br />
                <Title title='Razón social' />: {obj.emv.razonSocial} <br />
                <Title title='Dirección' />: {obj.emv.direccion} <br />
                <Title title='Fecha de registro' />: {obj.emv.fechaRegistro} <br />
                <Title title='Estado' />: {obj.emv.estado} <br />
                <Title title='Teléfono' />: {obj.emv.telefono} <br />
                <Title title='Correo' />: {obj.emv.correo}
            </TabPanel>
        </Box>
    )
}

export default function Vehiculos({ reporteId, empresaId, rutaId, inicio, final, codigoRuta, razonSocial, setShowVehiculos }) {

    const [vehiculos, setVehiculos] = useState([]);

    useEffect(() => {
        const getVehiculos = async () => {
            const vehiculo = await ReporteService.getVehiculos(reporteId, empresaId, rutaId, inicio, final);
            setVehiculos(vehiculo.data);
            if (vehiculo.data.length == 0) {
                alert("No se encontraron resultados")
            }
        };
        getVehiculos();
    }, [reporteId, empresaId, rutaId, inicio, final]);

    return (
        <Map>

            {
                (vehiculos && vehiculos.length > 0) &&
                vehiculos.map((marker, index) => (
                    <Marker key={index} position={[marker.longitud, marker.latitud]}>
                        {/* <Popup minWidth='auto'>
                            <PopupDet />
                        </Popup> */}
                    </Marker>
                ))
            }
        </Map>
    )
}