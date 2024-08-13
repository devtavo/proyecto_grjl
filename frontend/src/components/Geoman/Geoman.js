import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import L from "leaflet";
import sec from "./sectores.geojson";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Popup } from 'react-leaflet';
import Dialog from '../../components/Dialog/Dialog';
import MostrarHistorico from '../../pages/Rutas/MostrarHistorico';

const obj = {
    type: "FeatureCollection",
    features: [
        {
        }
    ]
};

const markers = [
    [-16.418091361839714, -71.54817598557482],
    [-16.40742937600073, -71.5253687754693],
    [-16.406321603702487, -71.54586639467807]
];
export default function Geoman({ setOpen, setParadas12, setParadas21, data, setInitialValues }) {
    console.log("data", data);

    function onEachFeature(feature, layer) {
        layer.on('click', function (e) {
            var obj = layer.feature.properties;
             setOpen(true);
            setInitialValues(obj);
        });
    }
    const context = useLeafletContext();
    useEffect(() => {
        const leafletContainer = context.map || context.layerContainer;
        leafletContainer.pm.addControls({
            drawMarker: false,
            drawCircleMarker: false,
            drawRectangle: false,
            drawCircle: false,
            cutPolygon: false,
        });

        const sector = new L.geoJSON(data, { onEachFeature: onEachFeature });
        leafletContainer.addLayer(sector);

        // console.log("luego",leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
        leafletContainer.pm.setGlobalOptions({ pmIgnore: true });
        // leafletContainer.pm.enableGlobalDragMode();
        // leafletContainer.pm.removeLayer(true);
        // console.log("todo",leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
        // console.log("desp",leafletContainer.pm);

        leafletContainer.on("pm:create", (e) => {
            
            // console.log("exa", leafletContainer);
            // console.log("create", leafletContainer.pm.getGeomanLayers(true).toGeoJSON())
            // setParadas12(leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
            console.log("exx", leafletContainer.pm);
            if (e.layer && e.layer.pm) {
                const shape = e;
                // console.log(e);
                shape.layer.pm.enable();
                // console.log(leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
                // leafletContainer.pm
                //     .getGeomanLayers(true)
                //     .bindPopup("i am whole")
                //     .openPopup();
                // leafletContainer.pm
                //     .getGeomanLayers()
                //     .map((layer, index) => { console.log("dentro", layer); layer.bindPopup(`I am figure N° ${layer}`); });
                shape.layer.on('click', function (e) {
                    // var obj = shape.layer.feature.properties;
                     setOpen(true);
                    // setInitialValues(obj);
                });
                shape.layer.on("pm:edit", (e) => {
                    const event = e;
                    console.log("edirt", leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
                });
            }
        });

        sector.on("pm:edit", (e) => {

            const shape = e;
            shape.layer.pm.enable();
            // leafletContainer.pm
            //     .getGeomanLayers()
            //     .map((layer, index) => { console.log("dentro", layer); layer.bindPopup(`I am figure N° ${layer.feature.properties.id_paradero}`); });
            // setGeom(leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
            setOpen(true)
            
            console.log("edit", leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
        });

        leafletContainer.on("pm:remove", (e) => {
            console.log("remo", leafletContainer.pm.getGeomanLayers(true).toGeoJSON());
        });

        return () => {
            leafletContainer.pm.removeControls();
            leafletContainer.pm.setGlobalOptions({ pmIgnore: true });
        };
    });

    return null;

};

// export default Geoman;
