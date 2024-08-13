import { useState, useEffect } from 'react';
import { GeoJSON, WMSTileLayer } from 'react-leaflet';
import HexagonoService from '../../services/HexagonoService';
import { BASE_URL_GEO_SERVER } from '../../services/http-common';

const STYLE_HEXAGONOS = {
    fillColor: "transparent",
    color: "#3388ff",
    weight: 1,
    opacity: .65
};

export default function HexagonosPoligono() {
    const [hexagonos, setHexagonos] = useState([]);

    useEffect(() => {
        const getHexagonos = async () => {
            const hexagonos = await HexagonoService.getAll();
            setHexagonos(hexagonos.data);
        };
        getHexagonos();
    }, []);

    const handleOnEachFeature = (feature, layer) => {
        layer.on({
            click: (e) => {
                console.error(e);
            }
        });
    }

    return (
        <>
            <WMSTileLayer
                format='image/png'
                layers='colaboraccion:hex_arequipa'
                url={BASE_URL_GEO_SERVER + '/colaboraccion_2020/wms'}
                transparent='true'
                opacity='0.6'
                cql_filter='quintil > 0'
            />

            {
                hexagonos.map((hexagono, index) => (
                    <GeoJSON key={hexagono.id} data={hexagono.geom} style={STYLE_HEXAGONOS} onEachFeature={handleOnEachFeature}></GeoJSON>
                ))
            }
        </>
    );
}