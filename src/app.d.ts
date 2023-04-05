import type { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import AWS from 'aws-sdk';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			cognito: AWS.CognitoIdentityServiceProvider;
			error: string;
			data: unknown;
			prisma: PrismaClient;
			token: string;
			id_token: string;
			claims: CognitoIdTokenPayload;
		}
	}
}

export { };
