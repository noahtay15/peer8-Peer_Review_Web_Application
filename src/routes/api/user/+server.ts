import type { AWSPromiseResponse } from '$lib/types/AWSResponse';
import type { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import type AWS from 'aws-sdk';
import type { AWSError } from 'aws-sdk';
import type { GetUserRequest, GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export async function GET({ locals }) {
    const cog = locals.cognito as AWS.CognitoIdentityServiceProvider;


    // TODO: Figure out how to do USER_SRP_AUTH instead
    const getUser = () => {
        return new Promise((resolve) => {
            cog.getUser({
                AccessToken: locals.token as string,
            } as GetUserRequest, function (err: AWSError, data: GetUserResponse) {
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
    const response = await getUser() as AWSPromiseResponse;

    if (response.error) {
        return json({ message: response.error }, { status: 400 });
    }

    return json({ message: 'Successfully retrieved user details.', data: response.data}, { status: 200 });
}