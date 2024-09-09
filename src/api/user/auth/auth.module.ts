import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt-strategy'
import { UsersModule } from '../users.module'


const authOpts = {
  defaultStrategy: 'jwt',
  property: 'user'
}

const jwtOpts = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => (
    {
      secret: config.get<string>('JWT_KEY'),
      signOptions: {
        expiresIn: config.get<string | number>('JWT_EXPIRES')
      }
    })
}


@Module({
  imports: [
    PassportModule.register(authOpts),
    JwtModule.registerAsync(jwtOpts),
    TypeOrmModule.forFeature([User]),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {
}
