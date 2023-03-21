import { json } from '@sveltejs/kit';
import { clientId } from '$lib/aws/constants';
import type AWS from 'aws-sdk';
import type { AWSError } from 'aws-sdk';
import type { InitiateAuthResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { validateEmail } from '$lib/utils/validate';

export async function POST({ request, locals }) {
    const body = await request.json();

    const { email, password } = body;

    const errors = [];

    // Validate body
    if (!validateEmail(email)) {
        errors.push('Invalid email provided.');
    }

    if (password === '') {
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
                AuthFlow: 'USER_PASSWORD_AUTH',
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                    SRP_A: 'A',
                },
            } as AWS.CognitoIdentityServiceProvider.InitiateAuthRequest, function (err: AWSError, data: InitiateAuthResponse) {
                if (err) {
                    console.log(err.message); // an error occurred
                    resolve({
                        error: err.message,
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