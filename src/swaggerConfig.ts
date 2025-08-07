import swaggerJsdoc from 'swagger-jsdoc';

const getServerUrl = () => {
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 4000;
    if (host === 'https://backend-isco-challenge.onrender.com') {
        return host;
    }
    return `http://${host}:${port}`;
};

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ISCO CHALLENGE API',
            version: '1.0.0',
            description: 'API documentation for the ISCO HR platform challenge',
        },
        servers: [
            {
                url: getServerUrl(),
                description: `${process.env.APPLICATION_STAGE} server`,
            },
        ],
    },
    apis: [
        './src/routes/*.ts',
        './src/routes/v1/*.ts'
    ], // Path to the API docs
};

const specs = swaggerJsdoc(options);
export default specs;
