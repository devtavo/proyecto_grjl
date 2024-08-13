const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');
const pgFormat = require('pg-format');

/**
 * Retorna datos de validacion
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getConstructora = async (req, res) => {
    try {
        const track = await pg.query(`select * from smlpr.sm_constructora`,
            []);
        return res.status(200).send(camelcaseKeys(track));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
/**
 * Retorna datos de validacion
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getTransportista = async (req, res) => {
    try {
        const track = await pg.query(`select * from smlpr.sm_empresas`,
            []);
        return res.status(200).send(camelcaseKeys(track));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Retorna datos de validacion
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getObras = async (req, res) => {
    try {
        const track = await pg.query(`select * from smlpr.sm_obras where nombre <> 'NO DEFINIDO'`,
            []);
        return res.status(200).send(camelcaseKeys(track));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Valida las constancias
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getValidaConstancia = async (req, res) => {
    try {
        const validacion = await pg.query(`
        select 
        sum(viajes_dia) s_viajes_dia
        from smlpr.sm_historia 
        where 
        id_empresa= '${req.body.id}' and 
        to_date(fecha_genera,'dd-mm-yyyy') between to_date('${req.params.inicio}','dd-mm-yyyy') and to_date('${req.params.final}','dd-mm-yyyy')         
        `,
            []);
        return res.status(200).send(camelcaseKeys(validacion));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Genera la constancia
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.generarConstancia = async (req, res) => {
    console.log(req.body);
    const tmp_constancia = await pg.query(pgFormat(`insert into smlpr.sm_tmp_constancias(
        e_razon_social
        ,e_ruc
        ,t_razon_social
        ,t_ruc
        ,p_obra
        ,p_direccion
        ,v_fecha_inicio
        ,v_fecha_fin
        ,v_num_viajes
        ,v_volumen_aprox
        ,v_fecha_constancia) values %L`,getTempConstancia(req.body)),[])
        return res.status(200).send(camelcaseKeys(
            {"msg": "ok"}
        ));
        // const archivo = './output/ejemplo_constancia_docx.py';

    // exec(`python3 ${archivo} `, async (error, stdout, stderr) => {
    //     // exec('python script.py', (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.error(`Error: ${stderr}`);
    //         return;
    //     } else {
    //         console.log(stdout);
    //     }

    // });
}

const getTempConstancia = (tmpConstancias) => {
    let arr=[];
    if(tmpConstancias) tmpConstancias.map((a)=>{arr.push(
        [a.eRazonSocial,
         a.eRuc,
         a.tRazonSocial,
         a.tRuc,
         a.pObra,
         a.pDireccion,
         a.vFechaInicio,
         a.vFechaFin,
         a.vNumViajes,
         a.vVolumenAprox,
         a.vFechaConstancia
         ]
    )})
    console.log("aaa",arr);
    return arr;
}

exports.generaDataConstancia = async (req, res) => {
    try {
        const genera = await pg.query(`select * from smlpr.sm_tmp_constancias`);
        return res.status(200).send(camelcaseKeys(
            genera
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}