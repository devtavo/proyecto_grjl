import { useMapEvents } from "@monsonjeremy/react-leaflet";

function MapEvents({ onChangeView }) {
    const map = useMapEvents({
        zoom() {
            onChangeView(map.getBounds());
        },
        dragend() {
            onChangeView(map.getBounds());
        }
    });

    return null;
}

export default MapEvents;