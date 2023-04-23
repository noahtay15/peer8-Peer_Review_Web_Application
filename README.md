# Peer8

![Peer Review Software Banner](https://user-images.githubusercontent.com/24308154/224770163-ca054ece-c385-483b-9d40-ef87dfbc49f1.png)

[![License: AGPLv3](https://img.shields.io/badge/License-AGPLv3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

This project is licensed under the terms of the [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0), with an additional clause for commercial use. Please see the [LICENSE.md](LICENSE.md) file for details.

## Environment Setup

Create a new .env file in your root directory with the following properties:

```
APP_AWS_ACCESS_KEY_ID=<AWS-ACCOUNT-ACCESS-KEY>

APP_AWS_SECRET_ACCESS_KEY=<AWS-ACCOUNT-SECRET>

APP_AWS_PROJECT_REGION=<PROJECT-REGION>

APP_AWS_COGNITO_IDENTITY_POOL_ID=<COGNITO-POOL-ID>

APP_COGNITO_USER_POOL_ID=<COGNITO-USER-POOL-ID>

APP_COGNITO_CLIENT_ID=<COGNITO-CLIENT-ID>

APP_COGNITO_USER_POOL_WEB_CLIENT_ID=<COGNITO-WEB-CLIENT-ID>

OAUTH_DOMAIN=<OAUTH-DOMAIN> (optional - not used)

REDIRECT_SIGN_IN=<REDIRECT> (can be anything but probably just keep at http://localhost:3000)

REDIRECT_SIGN_OUT=<REDIRECT> (can be anything but probably just keep at http://localhost:3000)
```

Finally you can add a database connection string

For connection string format see Prisma's PostgresSQL docs on how to [connect your database](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgres)

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

You can nows specify an instructor directory (users who can sign up as an instructor):


```json
// directory.json
{
    "directory": [
        {
            "name": "Jane Doe",
            "email": "test@test.edu"
        }
    ]
}
```


## Database Initialization

After providing a valid database connection string, you will have to generate the database structure like so:

```
npx prisma migrate dev
```


## Development Server

Start the development server on http://localhost:5173

```bash
npm run dev
```

## Production

Build the application for production:

```bash
yarn run build
```

Locally preview production build:

```bash
yarn run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Acknowledgements
Contributors:
- Jannat Saeed 
- Noah Taylor
- Cuinn Owens
- Cole Cagle
- Yhara Mendoza
