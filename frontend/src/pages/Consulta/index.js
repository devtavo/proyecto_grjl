import { useParams } from 'react-router-dom';
import Consulta1 from "./Consulta1/Consulta1";
import Consulta2 from "./Consulta2/Consulta2";
import Consulta3 from "./Consulta3/Consulta3";
import Consulta4 from "./Consulta4/Consulta4";
import Consulta5 from "./Consulta5/Consulta5";
import Consulta6 from "./Consulta6/Consulta6";
import Consulta7 from "./Consulta7/Consulta7";
import Consulta8 from "./Consulta8/Consulta8";
import Consulta9 from "./Consulta9/Consulta9";
import Consulta10 from "./Consulta10/Consulta10";
import Consulta11 from "./Consulta11/Consulta11";
import Consulta12 from "./Consulta12/Consulta12";
import Consulta14 from "./Consulta14/Consulta14";
import Consulta15 from "./Consulta15/Consulta15";
import Consulta16 from "./Consulta16/Consulta16";
import Consulta18 from "./Consulta18/Consulta18";
import Consulta19 from "./Consulta19/Consulta19";
import Consulta20 from "./Consulta20/Consulta20";
import Consulta21 from "./Consulta21/Consulta21";
import Consulta22 from "./Consulta22/Consulta22";
import Consulta23 from "./Consulta23/Consulta23";
import Consulta24 from "./Consulta24/Consulta24";

const Components = {
    consulta1: Consulta1,
    consulta2: Consulta2,
    consulta3: Consulta3,
    consulta4: Consulta4,
    consulta5: Consulta5,
    consulta6: Consulta6,
    consulta7: Consulta7,
    consulta8: Consulta8,
    consulta9: Consulta9,
    consulta10: Consulta10,
    consulta11: Consulta11,
    consulta12: Consulta12,
    consulta14: Consulta14,
    consulta15: Consulta15,
    consulta16: Consulta16,
    consulta18: Consulta18,
    consulta19: Consulta19,
    consulta20: Consulta20,
    consulta21: Consulta21,
    consulta22: Consulta22,
    consulta23: Consulta23,
    consulta24: Consulta24
};

export default function Consulta() {
    const { consultaId } = useParams();
    const cName = `consulta${consultaId}`;
    const Component = Components[cName];

    if (Component)
        return <Component consultaId={consultaId} />

    if (!Component)
        return <h3>Consulta pendiente de desarrollo</h3>
}