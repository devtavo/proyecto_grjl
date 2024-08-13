const env = process.env;

const config = {
    db_pg: {
        host: env.PG_HOST || '78.46.16.8',
        port: env.PG_PORT || '5432',
        user: env.PG_USER || 'postgres',
        password: env.PG_PASSWORD || 'geoserver',
        database: env.PG_NAME || 'smlpr',
    },
};

module.exports = config;