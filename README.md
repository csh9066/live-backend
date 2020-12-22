# live-bakend

슬랙 클론 코딩인 live 백엔드 입니다.
</br>
frontend: [live-frontend](https://github.com/csh9066/live-front)

## Tech Stack

- typescript
- express
- mysql
- typeorm
- passport
- socket.io
- multer
- AWS-S3

## Installation

Clone repository

```shell
& git clone https://github.com/csh9066/live-front.git
```

Install dependencies

```shell
& yarn install
# or
& npm install
```

Set up environment variable

```shell

PORT=3005
CLIENT_URL=http://localhost:3000

COOKIE_SECRET=<COOKIE_SECRET>

# typeorm config
TYPEORM_CONNECTION=mysql
TYPEORM_HOST=localhost
TYPEORM_USERNAME=root
TYPEORM_PASSWORD=1234
TYPEORM_DATABASE=live
TYPEORM_PORT=3306
TYPEORM_SYNCHRONIZE=true # optional
TYPEORM_LOGGING=false # optional
TYPEORM_ENTITIES=src/entity/*.ts


# facebook config
FACEBOOK_CLIENT_ID=<FACEBOOK_CLIENT_ID>
FACEBOOK_CLIENT_SECRET=<FACEBOOK_CLIENT_SECRET>

# google config
GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET>

# aws-sdk config
AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY>
AWS_REGION=<AWS_REGION>

```

Start development server

```shell
& yarn dev
# or
& npm run dev
```

## Build

Install pm2

```shell
& yarn global add pm2
# or
& npm install -g pm2
```

build

```shell
& yarn build
# or
& npm run build
```

start production server

```shell
& yarn start
# or
& npm run start
```
