import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";

export default function Map({ children, width = '100%', height = '100%', maxZoom=13, minZoom=11}) {
    const position = [-16.40732281908651, -71.53626778407354];
    const mapStyle = {
        width: width,
        height: height,
    };

    return (
        <MapContainer center={position} zoom={14} maxZoom={maxZoom} minZoom={minZoom} scrollWheelZoom={true} style={mapStyle}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
        </MapContainer>
    );
}