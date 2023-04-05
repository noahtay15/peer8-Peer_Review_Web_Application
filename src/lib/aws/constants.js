// import env variables from .env file
import dotenv from "dotenv";

dotenv.config();

// read env variables
export const accessKeyId = process.env.APP_AWS_ACCESS_KEY_ID;
export const secretAccessKey = process.env.APP_AWS_SECRET_ACCESS_KEY;
export const userPoolId = process.env.APP_COGNITO_USER_POOL_ID;
export const clientId = process.env.APP_COGNITO_CLIENT_ID;