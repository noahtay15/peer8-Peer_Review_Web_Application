import { json } from '@sveltejs/kit';
import { clientId } from '$lib/aws/constants';
import type AWS from 'aws-sdk';
import type { AWSError } from 'aws-sdk';
import type { SignUpResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { validateEmail, validatePassword } from '$lib/utils/validate';

export async function POST({ request, locals }) {
    const body = await request.json();


    // TODO: Figure out what to do with class code
    const { email, password, name, class_code } = body;

    const errors = [];

    // Validate body
    if (!validateEmail(email)) {
        errors.push('Invalid email provided.');
    }

    if (!validatePassword(password)) {
        errors.push('Invalid password provided.');
    }

    if (name === '') {
        errors.push('Invalid name provided.');
    }

    if (errors.length > 0) {
        return json({ message: "Missing or invalid fields.", errors }, { status: 400 });
    }

    interface PromiseResponse {
        error: string | null;
        data: SignUpResponse | null;
    }


    const cog = locals.cognito as AWS.CognitoIdentityServiceProvider;

    const register = () => {
        return new Promise((resolve) => {
            cog.signUp({
                ClientId: clientId,
                Username: email,
                Password: password,
                UserAttributes: [
                    {
                        Name: 'name',
                        Value: name
                    },
                    {
                        Name: 'picture',
                        Value: ''
                    },
                ],
            } as AWS.CognitoIdentityServiceProvider.SignUpRequest, function (err: AWSError, data: SignUpResponse) {
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
    const response = await register() as PromiseResponse;

    if (response.error) {
        return json({ message: response.error }, { status: 400 });
    }

    return json({ message: 'Successfully registered user.'}, { status: 200 });
}