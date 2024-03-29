import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class ToHttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ToHttpExceptionFilter.name);
  
    catch(exception, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        if(request.path === "/favicon.ico") {
            return response.end();
        }
        
        const statusCode =
            exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
            exception instanceof HttpException
            ? exception.message
            : 'Internal server error';
    
        const devErrorResponse = {
            statusCode,
            timestamp: new Date().toISOString(),
            path: request.path,
            method: request.method,
            errorName: exception?.name,
            message: exception?.message,
            errorMessage: exception?.response?.message,
            stack: exception?.stack.split('\n'),
            cause: exception?.cause,
        };
        this.logger.error(exception);
        const prodErrorResponse = {
            statusCode,
            message,
        };
        
        this.logger.error(
            `request method: ${request.method} request url: ${request.url}\n`,
            JSON.stringify(devErrorResponse, null, 2),
        );
        response
            .status(statusCode)
            .json(
            process.env.NODE_ENV === 'production'
                ? prodErrorResponse
                : devErrorResponse,
            );
    }
}