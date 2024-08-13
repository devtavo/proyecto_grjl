const jwt = require('jsonwebtoken');
const pg = require('../services/pg');

/**
 * Verify Token
 * @param {object} req 
 * @param {object} res 
 * @param {object} next
 * @returns {object|void} response object 
 */
exports.verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token)
        return res.status(400).send({ 'message': 'Debe enviar el token' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await pg.query(`
        select
            id, 
            usuario, 
            contrasena
        from(
            select
                id,
                '20438933272'::text as usuario,
                '$2b$08$F1nOexdf2XCAG1Z.O3qgxOEnIfSb9hJkPaux.1xyRJvtifAmeq9XC' as contrasena
            from generate_series(1, 2) as id
        ) x
        WHERE id = $1`, [decoded.userId]);

        if (!user[0])
            return res.status(400).send({ 'message': 'Token incorrecto' });

        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        return res.status(500).send(error);
    }
}