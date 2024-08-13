const { Pool } = require('pg');
const config = require('../config/db');
const pool = new Pool(config.db_pg);

/**
 * Consulta a la BD usando el pool de conexión a postgres
 * @param {*} query
 * @param {*} params
 */
async function query(query, params) {
    const { rows, fields } = await pool.query(query, params);

    return rows;
}

module.exports = {
    query,
    pool
}