import { userPoolId } from '$lib/aws/constants';
import type { CognitoIdentityServiceProvider } from 'aws-sdk';

export const deleteUser = (
    cog: CognitoIdentityServiceProvider,
    email: string
) => {
    return new Promise((resolve) => {
        cog.adminDeleteUser(
            {
                UserPoolId: userPoolId as string,
                Username: email
            },
            function (err, data) {
                if (err) {
                    console.log(err.message); // an error occurred
                    resolve({
                        error: `${err.code}: ${err.message}`,
                        data: null
                    });
                }
                resolve({
                    error: null,
                    data: data
                });
            }
        );
    });
};
