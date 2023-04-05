import { json } from '@sveltejs/kit';
import { clientId, userPoolId } from '$lib/aws/constants';
import type AWS from 'aws-sdk';
import type { AWSError } from 'aws-sdk';
import type { AdminDeleteUserRequest, SignUpResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import type { AWSPromiseResponse } from '$lib/types/AWSResponse';
import { validateEmail, validatePassword } from '$lib/utils/validate';
import type { PrismaClient } from '@prisma/client';
import { deleteUser } from '$lib/utils/deleteUser';

export async function POST({ request, locals }) {
	const body = await request.json();

	// TODO: Figure out what to do with class code
	const { email, password, name, type, class_code } = body;

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

	if (type === '' || (type.toLowerCase() !== 'student' && type.toLowerCase() !== 'instructor')) {
		errors.push('Invalid type provided.');
	}

	if (errors.length > 0) {
		return json({ message: 'Missing or invalid fields.', errors }, { status: 400 });
	}

	const cog = locals.cognito as AWS.CognitoIdentityServiceProvider;

	const register = () => {
		return new Promise((resolve) => {
			cog.signUp(
				{
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
						{
							Name: 'custom:user_type',
							Value: type
						}
					]
				} as AWS.CognitoIdentityServiceProvider.SignUpRequest,
				function (err: AWSError, data: SignUpResponse) {
					if (err) {
						console.log(err.message); // an error occurred
						resolve({
							error: `${err.code}: ${err.message}`,
							data: null
						} as AWSPromiseResponse);
					}
					resolve({
						error: null,
						data: data
					} as AWSPromiseResponse);
				}
			);
		});
	};

	// Test db
	const prisma = locals.prisma as PrismaClient;
    let res;

	try {
		await prisma.users.create({
			data: {
				email: email,
				name: name,
				type: type.toLowerCase(),
			} as any
		});
	} catch (e) {
		console.log(e);

		// delete user from cognito
		res = (await deleteUser(cog, email)) as AWSPromiseResponse;
	}

    // Send error if delete user 
    if (res) {
        if (res.error) {
            return json({ message: "Tried signing up but error occurred. Please contact support." }, { status: 400 });
        } else {
            return json({ message: 'Signup failed. Please try again.' }, { status: 200 });
        }
    }

	// convert unknown to PromiseResponse
	const response = (await register()) as AWSPromiseResponse;

	if (response.error) {
		return json({ message: response.error }, { status: 400 });
	}

	return json({ message: 'Successfully registered user.' }, { status: 200 });
}
