// config/configuration.ts
export default () => ({
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'secretKey',
    ingestionUrl: process.env.PYTHON_INGESTION_URL || 'http://localhost:5000/ingest',
});
