import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { APP_FILTER } from '@nestjs/core';
import { ToHttpExceptionFilter } from 'src/filter/httpException.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ToHttpExceptionFilter,
    }
  ],
})
export class AppModule {}
