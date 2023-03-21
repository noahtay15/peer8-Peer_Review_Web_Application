import { json } from '@sveltejs/kit';
import { clientId } from '$lib/aws/constants';
import type AWS from 'aws-sdk';
import type { AWSError } from 'aws-sdk';
import type { ConfirmSignUpRequest, ConfirmSignUpResponse, ResendConfirmationCodeRequest, ResendConfirmationCodeResponse} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { validateEmail } from '$lib/utils/validate';
import type { AWSPromiseResponse } from '$lib/types/AWSResponse';

export async function GET({ locals, url }) {
    // Get URL params
    const email: string | null = decodeURIComponent(url.searchParams.get('email') || '');

    // Sanitize email and code parameters
    const sanitizedEmail = email ? email.trim() : null;

    const errors: string[] = [];

    if (!validateEmail(sanitizedEmail)) {
        errors.push('Invalid email provided.');
    }

    if (errors.length > 0) {
        return json({ message: "Missing or invalid fields.", errors }, { status: 400 });
    }

    const cog = locals.cognito as AWS.CognitoIdentityServiceProvider;

    const resendCode = () => {
        return new Promise((resolve) => {
            cog.resendConfirmationCode({
                ClientId: clientId,
                Username: sanitizedEmail,
            } as ResendConfirmationCodeRequest, function (err: AWSError, data: ResendConfirmationCodeResponse) {
                if (err) {
                    console.log(err.message); // an error occurred
                    resolve({
                        error: err.message,
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

    // convert unknown to AWSPromiseResponse
    const response = await resendCode() as AWSPromiseResponse;

    if (response.error) {
        return json({ message: response.error }, { status: 400 });
    }

    return json({ message: 'Successfully sent verification code.'}, { status: 200 });
}

export async function POST({ request, locals }) {

    const body = await request.json();

    const { email, code } = body;

    // Sanitize email and code parameters
    const sanitizedEmail = email ? email.trim() : null;
    const sanitizedCode = code ? code.trim() : null;

    // Error array
    const errors: string[] = [];

    // Validate body
    if (!validateEmail(sanitizedEmail)) {
        errors.push('Invalid email provided.');
    }

    if (sanitizedCode === null || sanitizedCode === '') {
        errors.push('Invalid code provided.');
    }

    // Return errors if any
    if (errors.length > 0) {
        return json({ message: "Missing or invalid fields.", errors }, { status: 400 });
    }


    // Get cognito service and confirm user
    const cog = locals.cognito as AWS.CognitoIdentityServiceProvider;

    const confirm = () => {
        return new Promise((resolve) => {
            cog.confirmSignUp({
                ClientId: clientId,
                Username: sanitizedEmail,
                ConfirmationCode: sanitizedCode,
            } as ConfirmSignUpRequest, function (err: AWSError, data: ConfirmSignUpResponse) {
                if (err) {
                    console.log(err.message); // an error occurred
                    resolve({
                        error: err.message,
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

    // convert unknown to AWSPromiseResponse
    const response = await confirm() as AWSPromiseResponse;

    if (response.error) {
        return json({ message: response.error }, { status: 400 });
    }

    return json({ message: 'Successfully confirmed user.'}, { status: 200 });
}