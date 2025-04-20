// config/configuration.ts
export default () => ({
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'secretKey',
    ingestionUrl: process.env.PYTHON_INGESTION_URL || 'http://localhost:5000/ingest',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_USERNAME: process.env.DB_USERNAME || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || '123456',
    DB_DATABASE: process.env.DB_DATABASE || 'postgres',

});
