import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonLogger, WinstonModule } from 'nest-winston';
import * as winston from 'winston'
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { AuthMiddleWare } from './auth.middleware';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            format: winston.format.json(),
            transports: [new winston.transports.Console()]
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        })
    ],
    providers: [PrismaService, ValidationService, {
        provide: APP_FILTER,
        useClass: ErrorFilter
    }],
    exports: [PrismaService, ValidationService]
})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleWare).forRoutes('/api/*');
    }
}
