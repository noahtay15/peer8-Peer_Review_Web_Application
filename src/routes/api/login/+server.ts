import { json } from '@sveltejs/kit';
import { clientId } from '$lib/aws/constants';
import type AWS from 'aws-sdk';
import type { AWSError } from 'aws-sdk';
import type { InitiateAuthResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { validateEmail } from '$lib/utils/validate';

export async function POST({ request, locals } : { request: Request, locals: App.Locals }) {
    const accessToken = request.headers.get('Authorization')?.replace('Bearer ', '');
    const body = !accessToken ? await request.json() : {};


    const { email, password } = body;

    const errors = [];

    // Validate body
    if (!validateEmail(email) && !accessToken) {
        errors.push('Invalid email provided.');
    }

    if (password === '' && !accessToken) {
        errors.push('Invalid password provided.');
    }

    if (errors.length > 0) {
        return json({ message: "Missing or invalid fields.", errors }, { status: 400 });
    }

    interface PromiseResponse {
        error: string | null;
        data:  InitiateAuthResponse | null;
    }


    const cog = locals.cognito as AWS.CognitoIdentityServiceProvider;

    // TODO: Figure out how to do USER_SRP_AUTH instead
    const login = () => {
        return new Promise((resolve) => {
            cog.initiateAuth({
                ClientId: clientId,
                AuthFlow: !accessToken ? 'USER_PASSWORD_AUTH' : 'REFRESH_TOKEN_AUTH',
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                    REFRESH_TOKEN: accessToken,
                    SRP_A: 'A',
                },
            } as AWS.CognitoIdentityServiceProvider.InitiateAuthRequest, function (err: AWSError, data: InitiateAuthResponse) {
                if (err) {
                    console.log(err.message); // an error occurred
                    resolve({
                        error: `${err.code}: ${err.message}`,
                        data: null,
                    } as PromiseResponse);
                }

                resolve({
                    error: null,
                    data: data,
                } as PromiseResponse);
            });
        });
    }

    // convert unknown to PromiseResponse
    const response = await login() as PromiseResponse;

    if (response.error) {
        return json({ message: response.error }, { status: 400 });
    }

    return json({ message: 'Successfully logged in.', data: response.data?.AuthenticationResult}, { status: 200 });
}