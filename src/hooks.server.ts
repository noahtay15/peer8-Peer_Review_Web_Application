import AWS from 'aws-sdk';
import { accessKeyId, secretAccessKey } from '$lib/aws/constants';

export async function handle({event, resolve}) {
    const cognito = new AWS.CognitoIdentityServiceProvider({
        region: "us-east-1",
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    });

    event.locals.cognito = cognito;

    const response = await resolve(event);

    return response;
}