import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    HOST: string;
    DATABASE_URL: string;
}

// Environment Vars to validate before app running
const envsSchema = joi.object({
    PORT: joi.number().required(),
    HOST: joi.string().required(),
    DATABASE_URL: joi.string().required(),
}).unknown(true);

// Run validation between [EnvVars] vs. [process.env]
const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Environment Config Validation error: ${error.message}`);
}

const envVars: EnvVars = value;
export const envs = {
    port: envVars.PORT,
    host: envVars.HOST,
    databaseUrl: envVars.DATABASE_URL,
}