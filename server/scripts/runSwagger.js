import { genSwaggerConfig } from '../src/config/swagger.js';

async function runSwagger() {
    try {
        await genSwaggerConfig();
    } catch (err) {
        console.log(err);
    }
}

runSwagger();