import serverlessExpress from '@vendia/serverless-express';
import { APIGatewayProxyHandler, Handler } from 'aws-lambda';
import express from 'express';

import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import cookieParser from 'cookie-parser';

let cachedServer: Handler;

const bootstrapServer = async(): Promise<Handler> => {
    const expressApp = express();
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp)
    );
    app.use(cookieParser());
    app.enableCors({
        origin: [process.env.APP_ENDPOINT],
        credentials: true,
    });

    await app.init();
    
    return serverlessExpress({
        app: expressApp,
    })
}

export const handler: APIGatewayProxyHandler = async (
    event,
    context,
    callback,
) => {
    if(!cachedServer) {
        cachedServer = await bootstrapServer();
    }
    return cachedServer(event, context, callback);
}