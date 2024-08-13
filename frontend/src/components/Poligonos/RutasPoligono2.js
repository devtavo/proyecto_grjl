import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import RutaService from '../../services/RutaService';

export const STYLE_GEOM_2_1 = {
    fillColor: "transparent",
    color: "#3388ff",
};

export const STYLE_GEOM_1_2 = {
    fillColor: "transparent",
    color: "#E53D00",
};

export default function RutasPoligono2({idRuta} ) {
    const [rutas, setRutas] = useState([]);
    const [idR, setIdR] = useState(idRuta);

    if (idR != idRuta) {
        setIdR(idRuta);
    }
    console.log("rutaPoligono", idRuta);
    console.log("idR", idR);
    // setIdR(idRuta);
    useEffect(() => {
        const getRutaValida = async () => {
            const rutas = idRuta ? await RutaService.getRutaValida({ 'idRuta': idRuta }) : await RutaService.getAll();
            setRutas(rutas.data);
            console.log("p_ruta", rutas)
        }
        getRutaValida();
    }, [idR]);


    return (
        <>
            {
                rutas.map((ruta, index) => (
                    <React.Fragment key={index}>
                        <GeoJSON key={'rutas' + Math.random()} data={ruta.geom12} style={STYLE_GEOM_1_2}></GeoJSON>
                        <GeoJSON key={'rutass' + Math.random()} data={ruta.geom21} style={STYLE_GEOM_2_1}></GeoJSON>
                    </React.Fragment>
                ))
            }
            {console.log("r", rutas)}
        </>
    );
}