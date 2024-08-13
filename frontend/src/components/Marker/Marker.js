import { Marker as MapMarker, Popup } from 'react-leaflet';
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Marker({ isParadero = false, id = 0, icon = DefaultIcon, position = [], detalle = [], children }) {
    return (
        <MapMarker icon={icon} position={position} eventHandlers={{
            click: () => {
                console.log('OnClick')
            },
        }}>
            {children ?
                children :
                <Popup>
                    <table>
                        <tr>
                            <td>
                                Nombre Paradero: {detalle[0]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Sentido: {detalle[1]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Latitud: {position[0]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                longitud: {position[1]}
                            </td>
                        </tr>

                    </table>
                </Popup>}
        </MapMarker>
    );
}