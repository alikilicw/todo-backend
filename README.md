# NestJS & TODO Project Setup

This document explains how to set up and run this todo backend project using NestJS.

## Requirements

- **Node.js**: v18 or later
- **NPM** or **Yarn**

## Clone the Repository

```
git clone https://github.com/alikilicw/todo-backend.git
cd todo-backend
```

## Install Dependencies

If using NPM:

```
npm install
```

If using Yarn:

```
yarn install
```

## Configure Environment Variables

Create a .env file in the root directory and configure it as follows:

```
MONGO_URL=**************************

AWS_ACCESS_KEY_ID=********************
AWS_SECRET_ACCESS_KEY=********************
AWS_REGION=**********
AWS_S3_BUCKET_NAME=***********

MAIL=**************
MAIL_HOST=**********
MAIL_PORT=***
MAIL_USER=*******************
MAIL_PASS=**************

ACCESS_TOKEN_SECRET_KEY=***************** #(JWT)

GITHUB_ACCESS_KEY=*******************
```

Adjust the necessary variables according to your environment.

## Run the Project

### Run in Development Mode

```
npm run start:dev
```

### Run in Production Mode

```
npm run build
npm run start:prod
```

## API Documentation

You can api endpoints by importing this file from project directory.

```
Todo Collection.postman_collection.json
```

## Run with Docker

If using Docker, follow these steps:

```
docker-compose up --build -d
```
