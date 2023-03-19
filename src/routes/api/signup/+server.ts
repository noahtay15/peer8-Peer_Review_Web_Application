import { json } from '@sveltejs/kit';
import { clientId } from '$lib/aws/constants';
import type AWS from 'aws-sdk';
import { SignUpRequest } from 'aws-sdk/clients/all';

export async function POST({ request, locals }) {
    const body = await request.json();

    const { username, password } = body;

    console.log(username);

    var cog = await locals.cognito as AWS.CognitoIdentityServiceProvider;
    
    cog.signUp({params: {
        ClientId: clientId,
        Username: username,
        Password: password,
    }} as AWS.CognitoIdentityServiceProvider.SignUpRequest, function(err, data) {
        console.log(err);
    });

    return json({ message: 'Signup successful' }, { status: 200 });
}