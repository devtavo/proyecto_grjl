import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import { Grid, Typography, TextField, Button, Fade } from '@mui/material';
import Map from '../../components/Map/Map';
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import CiudadanoService from '../../services/CiudadanoService';
import { Marker, GeoJSON, Popup } from "react-leaflet";
import ReactDOMServer from "react-dom/server";

export const STYLE_GEOM_1_2 = [{
    fillColor: "transparent",
    color: "#3388ff",
},
{
    fillColor: "transparent",
    color: "#0000FF",
},
{
    fillColor: "transparent",
    color: "BLUE",
},
{
    fillColor: "transparent",
    color: "#808080",
},
{
    fillColor: "transparent",
    color: "#008000",
},
{
    fillColor: "transparent",
    color: "#800080",
},
{
    fillColor: "transparent",
    color: "#FF0000",
},
{
    fillColor: "transparent",
    color: "#F0F8FF",
},
{
    fillColor: "transparent",
    color: "#B22222",
},
{
    fillColor: "transparent",
    color: "#FF69B4",
}
];
function onEachFeature(feature, layer) {
    // const popupContent = `
    //     <div>
    //         <p>${feature.properties.value}</p>                  
    //     </div>
    //         `;
    // layer.bindPopup(popupContent);
    console.log("asd",layer);
}
function Ciudadano() {
    const { idHash } = useParams();
    const [share, setShare] = useState([]);
    const [track, setTrack] = useState({});

    useEffect(() => {
        const getHashValido = async () => {
            const track = await CiudadanoService.getHashValido({ "code": idHash });
            setShare(track.data);
            console.log("tr", track.data);

        };
        getHashValido();
        const getOpciones = async () => {
            console.log("coor", share[0]?.t?.origen.lat);
            const getOpciones = await CiudadanoService.getOpcionesRuta({
                "olat": share[0]?.t?.origen.lat,
                "olng": share[0]?.t?.origen.lng,
                "dlat": share[0]?.t?.destino.lat,
                "dlng": share[0]?.t?.destino.lng
            });
            setTrack(getOpciones.data);
            console.log("dataopciones", getOpciones.data)
        };
        getOpciones();


    }, [share]);

    console.log(share);
    console.log("coor2", share[0]?.t?.origen.lng);
    // console.log("aqui",track[0].data.features[0].geometry);

    return (
        <>
            <Grid
                container
                spacing={0}
                direction="row"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: 'calc(100vh - 100px)', height: '100vh' }
                }
            >
                <Map minZoom={0} maxZoom={22}>
                    {(share.length > 0) &&
                        <Marker key={Math.random()} position={[share[0].t?.origen.lat, share[0].t?.origen.lng]}>
                        </Marker>
                    }{(share.length > 0) &&
                        <Marker key={Math.random()} position={[share[0].t?.destino.lat, share[0].t?.destino.lng]}>
                        </Marker>
                    }
                    {(track.length > 0 && track[0].data.features != null) &&
                        track[0].data.features.map((a, index) => (
                            <GeoJSON key={'rutas' + Math.random()} e={a.properties} data={a.geometry} style={STYLE_GEOM_1_2[index]} onEachFeature={onEachFeature}>

                            </GeoJSON>
                        ))
                    }
                </Map>

            </Grid>
        </>

    )

}

export default withRouter(Ciudadano);