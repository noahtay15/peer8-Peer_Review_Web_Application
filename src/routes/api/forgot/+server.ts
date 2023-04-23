import { clientId } from '$lib/aws/constants';
import type { AWSPromiseResponse } from '$lib/types/AWSResponse';
import { validatePassword } from '$lib/utils/validate.js';
import { json } from '@sveltejs/kit';
import type AWS from 'aws-sdk';
import type { AWSError } from 'aws-sdk';
import type { ConfirmForgotPasswordRequest, ConfirmForgotPasswordResponse, ForgotPasswordRequest, ForgotPasswordResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export async function GET({ locals, url }) {
    const cog = locals.cognito as AWS.CognitoIdentityServiceProvider;

    const params = new URLSearchParams(url.search);

    const email = params.get('email');

    // Send forgot password request
    const forgotUser = () => {
        return new Promise((resolve) => {
            cog.forgotPassword({
                ClientId: clientId as string,
                Username: email,
            } as ForgotPasswordRequest, function (err: AWSError, data: ForgotPasswordResponse) {
                if (err) {
                    console.log(err.message); // an error occurred
                    console.log(err.code)
                    resolve({
                        error: `${err.code}: ${err.message}`,
                        data: null,
                    } as AWSPromiseResponse);
                }

                resolve({
                    error: null,
                    data: data,
                } as AWSPromiseResponse);
            });
        });
    }

    // convert unknown to PromiseResponse
    const response = await forgotUser() as AWSPromiseResponse;

    if (response.error) {
        return json({ message: response.error }, { status: 400 });
    }

    return json({ message: 'Successfully retrieved user details.', data: response.data}, { status: 200 });
}

export async function POST({ locals, request }) {
    const cog = locals.cognito as AWS.CognitoIdentityServiceProvider;
    const body = await request.json();

    const email = body.email;
    const password = body.password;
    const code = body.code;

    if (!email || !password) {
        return json({ message: 'Missing email or password.' }, { status: 400 });
    }

    if (!validatePassword(password)) {
        return json({ message: 'Invalid password.' }, { status: 400 });
    }

    // Send forgot password request
    const verifyNewPassword = () => {
        return new Promise((resolve) => {
            cog.confirmForgotPassword({
                ClientId: clientId as string,
                Username: email,
                Password: password,
                ConfirmationCode: code
            } as ConfirmForgotPasswordRequest, function (err: AWSError, data: ConfirmForgotPasswordResponse) {
                if (err) {
                    console.log(err.message); // an error occurred
                    console.log(err.code)
                    resolve({
                        error: `${err.code}: ${err.message}`,
                        data: null,
                    } as AWSPromiseResponse);
                }

                resolve({
                    error: null,
                    data: data,
                } as AWSPromiseResponse);
            });
        });
    }

    // convert unknown to PromiseResponse
    const response = await verifyNewPassword() as AWSPromiseResponse;

    if (response.error) {
        return json({ message: response.error }, { status: 400 });
    }

    return json({ message: 'Successfully retrieved user details.', data: response.data}, { status: 200 });
}