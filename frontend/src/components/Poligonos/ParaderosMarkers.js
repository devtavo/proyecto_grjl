import { useState, useEffect } from 'react';
import L from "leaflet";
import Marker from '../Marker/Marker';
import { GeoJSON } from 'react-leaflet';
import ParaderoService from '../../services/ParaderoService';
import paradero from './img/paradero.png';
import paradero_12 from './img/parada_12.png';
import paradero_21 from './img/parada_21.png';

let DefaultIcon = L.icon({
    iconUrl: paradero,
    iconSize: [22, 19],
    iconAnchor: [12, 21],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

let DefaultIcon12 = L.icon({
    iconUrl: paradero_12,
    iconSize: [22, 19],
    iconAnchor: [12, 21],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

let DefaultIcon21 = L.icon({
    iconUrl: paradero_21,
    iconSize: [22, 19],
    iconAnchor: [12, 21],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

export default function ParaderosMarkers({ isEdited = false, idRuta = 0, sentido }) {
    const [paraderos, setParaderos] = useState([]);
    const [sent, setSentido] = useState('');
    console.log(isEdited,idRuta,sentido);

    useEffect(() => {
        const getParaderos = async (idRuta, sentido) => {
            const paraderos = await ParaderoService.getAll(idRuta, sentido);
            setParaderos(paraderos.data);
            console.log(paraderos);

        };
        getParaderos(idRuta, sentido);
    }, []);

    return (
        <>
            {isEdited==true?
                paraderos.map((paradero,index)=>
                <GeoJSON key={index} data={paradero.theGeomEstacion}></GeoJSON>
                )
            :
                paraderos.map((paradero, index) =>
                    paradero.sentido == '1-2' ?
                        <Marker isParadero key={index} icon={DefaultIcon12} position={[paradero.latitud, paradero.longitud]} detalle={[paradero.nombreParadero, paradero.sentido]} />
                        :
                        <Marker isParadero key={index} icon={DefaultIcon21} position={[paradero.latitud, paradero.longitud]} detalle={[paradero.nombreParadero, paradero.sentido]} />
                )
            }
        </>
    );
}