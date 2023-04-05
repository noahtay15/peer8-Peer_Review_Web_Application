import AWS from 'aws-sdk';
import { accessKeyId, clientId, secretAccessKey, userPoolId } from '$lib/aws/constants';
import prisma from '$lib/prisma/prisma';
import { json } from '@sveltejs/kit';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

export async function handle({ event, resolve }: { event: any, resolve: any }) {
    const cognito = new AWS.CognitoIdentityServiceProvider({
        region: "us-east-1",
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    });

    // Only do token validation on the following routes
    const exclusion = [
        '/api/login',
        '/api/signup',
        '/api/verify',
    ];

    // Verifier that expects valid access tokens:
    const verifier = CognitoJwtVerifier.create({
        userPoolId: userPoolId as string,
        tokenUse: "access",
        clientId: clientId as string,
    });

    const verifier2 = CognitoJwtVerifier.create({
        userPoolId: userPoolId as string,
        tokenUse: "id",
        clientId: clientId as string,
    });

    let claims = {} as CognitoIdTokenPayload;


    if (!exclusion.includes(event.url.pathname) && event.url.pathname.startsWith('/api')) {
        const token = event.request.headers.get('Authorization')?.replace('Bearer ', '') as string;
        const id_token = event.request.headers.get('AuthorizationId')?.replace('Bearer ', '') as string;

        try {
            const payload = await verifier.verify(token as string);
            const payload2 = await verifier2.verify(id_token as string);
            // console.log(payload)
            // console.log(payload2)

            // we need to make sure we can match the access token to the id token
            if (payload2.sub !== payload.sub) {
                return json({ message: 'Mismatched tokens.' }, { status: 401 });
            }

            claims = payload2;
        } catch (err) {
            console.log(err)
            return json({ message: 'Invalid tokens provided.' }, { status: 401 });
        }
    }


    event.locals.cognito = cognito;
    event.locals.prisma = prisma;
    event.locals.token = event.request.headers.get('Authorization')?.replace('Bearer ', '') as string;
    event.locals.id_token = event.request.headers.get('AuthorizationId')?.replace('Bearer ', '') as string;
    event.locals.claims = claims;

    const response = await resolve(event);

    return response;
}