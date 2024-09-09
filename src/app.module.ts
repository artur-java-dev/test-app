import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { envVariablesPath } from './utils/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigORM } from './db/config'
import { AuthModule } from './api/user/auth/auth.module'
import { JwtGuard } from './api/user/auth/jwt-guard'
import { UsersModule } from './api/user/users.module'
import { CommentsModule } from './api/comment/comments.module'
import { ColumnsModule } from './api/column/columns.module'
import { CardsModule } from './api/card/cards.module'
import { OwnerGuard } from './api/user/auth/owner-guard'
import { LoggerModule } from 'nestjs-pino'


const envFilePath = envVariablesPath(`${__dirname}/env`)

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: ConfigORM }),
    UsersModule,
    ColumnsModule,
    CardsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtGuard, OwnerGuard],
})
export class AppModule { }
