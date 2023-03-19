import AWS from 'aws-sdk';

import { accessKeyId, secretAccessKey } from './constants';

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: "us-east-1",
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});

export default cognito;