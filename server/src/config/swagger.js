import swaggerAutogen from 'swagger-autogen';

export async function genSwaggerConfig() {
    const doc = {
        info: {
            title: 'EventMate API',
            description: 'API Documentation autogeneration test'
        },
        host: 'localhost:3000',
        basePath: "/api",
        schemes: 'http',
    };

    const outputFile = './src/config/swagger-output.json';
    const endpointsFiles = ['./src/index.js']
    await swaggerAutogen(outputFile, endpointsFiles, doc);
}