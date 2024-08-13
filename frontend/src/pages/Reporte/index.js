import { useParams } from 'react-router-dom';
import Reporte1 from "./Reporte1/Reporte1";
import Reporte2 from "./Reporte2/Reporte2";
import Reporte3 from "./Reporte3/Reporte3";
import Reporte4 from "./Reporte4/Reporte4";
import Reporte5 from "./Reporte5/Reporte5";
import Reporte6 from "./Reporte6/Reporte6";
import Reporte7 from "./Reporte7/Reporte7";
import Reporte8 from "./Reporte8/Reporte8";
import Reporte9 from "./Reporte9/Reporte9";
import Reporte10 from "./Reporte10/Reporte10";
import Reporte11 from "./Reporte11/Reporte11";
import Reporte12 from "./Reporte12/Reporte12";
import Reporte13 from "./Reporte13/Reporte13";
import Reporte14 from "./Reporte14/Reporte14";

const Components = {
    reporte1: Reporte1,
    reporte2: Reporte2,
    reporte3: Reporte3,
    reporte4: Reporte4,
    reporte5: Reporte5,
    reporte6: Reporte6,
    reporte7: Reporte7,
    reporte8: Reporte8,
    reporte9: Reporte9,
    reporte10: Reporte10,
    reporte11: Reporte11,
    reporte12: Reporte12,
    reporte13: Reporte13,
    reporte14: Reporte14,
};

export default function Reporte() {
    const { reporteId } = useParams();
    const cName = `reporte${reporteId}`;
    const Component = Components[cName];

    if (Component)
        return <Component reporteId={reporteId} />

    if (!Component)
        return <h3>Reporte pendiente de desarrollo</h3>
}