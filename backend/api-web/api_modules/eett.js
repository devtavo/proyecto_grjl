const pg = require('../services/pg');
const camelcaseKeys = require('camelcase-keys');
const { exec } = require('child_process');
const pythonScript = '../output/ejemplo_docx.py';
const path = require('path')
const pgFormat = require('pg-format');
const nodemailer = require('nodemailer');

/**
 * Retorna la lista de Empresas de transporte
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.getAll = async (req, res) => {

    try {
        const idEtt = req.query.idEtt === 'undefined' ? 0 : parseInt(req.query.idEtt);
        const eett = await pg.query(`
        select
        se.*,
        case 
            when id_estado_ett ='1' then 'Activo' 
            when id_estado_ett ='2' then 'Inactivo'
        end estado_ett
        from smlpr.sm_empresas se 
        where 
        se.id_estado_ett='1'
        `, []);
        return res.status(200).send(camelcaseKeys(eett));
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Inserta una nueva Empresa Transporte
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.post = async (req, res) => {
    try {

        const eett = await pg.query(`insert into smlpr.sm_empresas(ruc_ett, razon_social_empresa, direccion, id_estado_ett, telefono, correo,fecha_registro,tipo ) values($1,$2,$3,$4,$5,$6,now(),$7) RETURNING *,
        case 
            when id_estado_ett ='1' then 'Activo' 
            when id_estado_ett ='2' then 'Inactivo'
        end estado_ett`,
            [req.body.rucEtt, req.body.razonSocialEmpresa, req.body.direccion, req.body.idEstadoEtt, req.body.telefono, req.body.correo, req.body.tipo]
        );

        return res.status(201).send(camelcaseKeys(
            eett
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Inserta un nuevo comprobante de pago
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.postViaje = async (req, res) => {
    try {

        const eett = await pg.query(`insert into smlpr.sm_pago_viajes(id_ett, comprobante, cantidad,fecha_registro,estado,monto) values($1,$2,$3,now(),$4,$5) RETURNING *`,
            [req.body.idEtt, req.body.comprobante, req.body.cantidad, req.body.estado, req.body.monto]
        );
        const actualizaPago = await pg.query(`update smlpr.sm_empresas a set viajes= viajes + $1 where id=$2 `, [req.body.cantidad, req.body.idEtt])
        return res.status(201).send(camelcaseKeys(
            eett
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualiza una Empresa de transporte
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.put = async (req, res) => {
    try {

        const eett = await pg.query(`
            update smlpr.sm_empresas
            set 
                ruc_ett = $1, 
                razon_social_empresa = $2, 
                direccion= $3, 
                id_estado_ett= $4,
                telefono=$5,
                correo=$6,
                tipo= $8
            where
                id = $7
            RETURNING *`,
            [req.body.rucEtt, req.body.razonSocialEmpresa, req.body.direccion, req.body.idEstadoEtt, req.body.telefono, req.body.correo, req.params.ettId, req.body.tipo]
        );

        return res.status(200).send(camelcaseKeys(
            eett[0]
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

/**
 * Actualiza una Empresa de transporte
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.putViaje = async (req, res) => {
    try {

        const eett = await pg.query(`
            update smlpr.sm_pago_viajes
            set 
                comprobante = $1, 
                cantidad = $2, 
                monto = $5, 
                fecha_actualizacion= now(),
                estado= $3
            where
                id = $4
            RETURNING *`,
            [req.body.comprobante, req.body.cantidad, req.body.estado, req.params.id, req.body.monto]
        );

        return res.status(200).send(camelcaseKeys(
            eett[0]
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

exports.generarDiario = async (req, res) => {
    const archivo = './output/ejemplo_docx.py';

    exec(`python3 ${archivo} `, async (error, stdout, stderr) => {
        // exec('python script.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        } else {
            console.log(stdout);

            const registro = stdout.split('\r\n');
            const registroDiario = await pg.query(pgFormat('insert into smlpr.sm_generados_diario(ruta,id_ett) values %L returning *', getRegistros(registro)), []);
            // const updateRutaEtt = await pg.query(`update smlpr.sm_generados_diario(ruta,id_ett) values %L returning *`,[]);
            const gdd = await pg.query(`select 
                                        em.id
                                        ,em.razon_social_empresa
                                        ,em.ruc_ett
                                        ,em.telefono
                                        ,em.correo
                                        ,'contacto' as contacto
                                        ,em.id || ' - ADEICS' as cod
                                        ,em.viajes saldo_final
                                        ,em.saldo_inicial
                                        ,to_char(now()::date,'dd_mm_yyyy') fecha
                                        ,coalesce((select sum(cantidad)cantidad_v from smlpr.sm_pago_viajes spv where spv.id_ett=em.id and spv.fecha_registro='2023-07-06'::date),0) c
                                        ,array_to_json(array_agg(y.data)) data  from (
                                                select x.id ,row_to_json(x)data  from(
                                                select distinct 
                                                row_number() over(partition by ve.id_ett) ided
                                                ,ve.id_ett id
                                                ,ve.placa_vehiculo
                                                ,coalesce(sq.cantidad,0)::integer cantidad
                                                from (select v.*,e.razon_social_empresa  from smlpr.sm_vehiculo v 
                                                inner join smlpr.sm_empresas e on e.id=v.id_ett ) ve 
                                                left join (select 
                                                    row_number() over(partition by r.id_razon_social) ide
                                                    ,r.id_razon_social
                                                    ,r.placa 
                                                    ,count(r.placa) cantidad
                                                    from 
                                                    smlpr.sm_registros r
                                                    where r.estado ='S' and r.calidad ='T'  and r.autorizado ='SI' and to_date(to_char(fecha_registro,'dd-mm-yyyy'),'dd-mm-yyyy')= '2023-07-06'
                                                    group by 
                                                    r.placa
                                                    ,r.id_razon_social
                                                    order by 1 )sq  
                                                on ve.placa_vehiculo = sq.placa
                                                where ve.id_estado_vehiculo=1 order by 2
                                                )x
                                            )y inner join smlpr.sm_empresas em on em.id = y.id 
                                            group by 
                                            em.razon_social_empresa
                                            ,em.id
                                            ,em.ruc_ett
                                            ,em.telefono
                                            ,em.correo
                                            ,em.id || ' - ADEICS'
                                            ,em.viajes
                                            ,em.saldo_inicial`, []);
            // console.log(gdd);
            const deleteHistoriaFecha = await pg.query(`delete from smlpr.sm_historia where to_date(fecha_genera,'dd-mm-yyyy') =now()::date`);

            const registroDiarioViaje = await pg.query(pgFormat('insert into smlpr.sm_historia(id_empresa,viaje,fecha_genera,saldo_inicial,saldo_final,pagados_dia, viajes_dia) values %L returning *', getGenera(gdd)), []);

            return res.status(200).send({ 'message': 'ok', 'salida': stdout, "registro": registro, 'rd': registroDiario });
        }

    });
}

const getGenera = (registro) => {
    let arr = [];
    if (registro) registro.map((a) => { arr.push([a.id, 0, a.fecha.replaceAll('_', '/'), a.saldo_inicial, a.saldo_final, a.c, a.saldo_inicial - a.saldo_final]) });
    return arr;
}

const getRegistros = (geoJSON) => {
    let arr = [];

    if (geoJSON) geoJSON.map((g) => { arr.push([g, g.split(' - ')[0]]) });
    return arr;

}

exports.generaDataDiario = async (req, res) => {
    try {
        const genera = await pg.query(`select 
                                em.id
                                ,em.razon_social_empresa
                                ,em.ruc_ett
                                ,em.telefono
                                ,em.correo
                                ,'contacto' as contacto
                                ,em.id || ' - ADEICS' as cod
                                ,em.viajes saldo_final
                                ,em.saldo_inicial
                                ,to_char(now()::date,'dd_mm_yyyy') fecha
                                ,coalesce((select sum(cantidad)cantidad_v from smlpr.sm_pago_viajes spv where spv.id_ett=em.id and spv.fecha_registro='2023-07-06'::date),0) c
                                ,array_to_json(array_agg(y.data)) data  from (
                                        select x.id ,row_to_json(x)data  from(
                                        select distinct 
                                        row_number() over(partition by ve.id_ett) ided
                                        ,ve.id_ett id
                                        ,ve.placa_vehiculo
                                        ,coalesce(sq.cantidad,0)::integer cantidad
                                        from (select v.*,e.razon_social_empresa  from smlpr.sm_vehiculo v 
                                        inner join smlpr.sm_empresas e on e.id=v.id_ett ) ve 
                                        left join (select 
                                            row_number() over(partition by r.id_razon_social) ide
                                            ,r.id_razon_social
                                            ,r.placa 
                                            ,count(r.placa) cantidad
                                            from 
                                            smlpr.sm_registros r
                                            where r.estado ='S' and r.calidad ='T'  and r.autorizado ='SI' and to_date(to_char(fecha_registro,'dd-mm-yyyy'),'dd-mm-yyyy')= '2023-07-06'
                                            group by 
                                            r.placa
                                            ,r.id_razon_social
                                            order by 1 )sq  
                                        on ve.placa_vehiculo = sq.placa
                                        where ve.id_estado_vehiculo=1 order by 2
                                        )x
                                    )y inner join smlpr.sm_empresas em on em.id = y.id 
                                    group by 
                                    em.razon_social_empresa
                                    ,em.id
                                    ,em.ruc_ett
                                    ,em.telefono
                                    ,em.correo
                                    ,em.id || ' - ADEICS'
                                    ,em.viajes
                                    ,em.saldo_inicial`);
        return res.status(200).send(camelcaseKeys(
            genera
        ));

    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'gustavoreyeszapata@gmail.com', // Reemplaza con tu dirección de correo electrónico
        pass: 'bwjwjapjngpdjqdz' // Reemplaza con tu contraseña de correo electrónico
        // user: 'greyes@outlook.pe', // Reemplaza con tu dirección de correo electrónico
        // pass: 'bwjwjapjngpdjqdz' // Reemplaza con tu contraseña de correo electrónico
    }
});

// Configurar los datos del correo electrónico
let mailOptions = {
    from: 'ddd@adeics.pe', // La dirección de correo del destinatario
    to: 'greyes@colaboraccion.pe', // La dirección de correo desde la cual se enviará
    subject: 'Reporte diario',
    text: 'Reporte diario',
    // attachments: [
    //     {
    //       path: './output/output/27_06_2023/5 - ADEICS_27_06_2023.pdf', // Nombre del archivo adjunto
    //       filename: '5 - ADEICS_27_06_2023.pdf' // Ruta completa del archivo adjunto
    //     }
    //   ]
};

exports.envioCorreo = async (req, res) => {
    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });

}

