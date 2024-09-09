import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common'
import { AccessToken, AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto'
import { User } from '../user.entity'
import { Request } from 'express'
import { JwtGuard } from './jwt-guard'
import {
  ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse,
  ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags
} from '@nestjs/swagger'


@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  @Inject(AuthService)
  private readonly service: AuthService


  @Post('register')
  @ApiOperation({
    summary: 'Регистрирует нового пользователя'
  })
  @ApiCreatedResponse({ description: 'Успешно зарегистрирован', type: User })
  @ApiConflictResponse({ description: 'Пользователь с таким e-mail уже существует' })
  async register(@Body() body: RegisterDto): Promise<User> {
    return this.service.registerNewUser(body)
  }


  @Post('login')
  @ApiOperation({
    summary: 'Авторизует пользователя'
  })
  @ApiOkResponse({ description: 'Успешно авторизован (получен JWT-токен)', type: AccessToken })
  @ApiBadRequestResponse({ description: 'Неверные учетные данные' })
  async login(@Body() body: LoginDto): Promise<AccessToken> {
    return this.service.login(body)
  }

  @Post('refresh')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Обновляет JWT-токен'
  })
  @ApiOkResponse({ description: 'Успешно сгенерирован новый JWT-токен', type: AccessToken })
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос' })
  async refresh(@Req() { user }: Request): Promise<AccessToken> {
    return this.service.refreshToken(<User>user)
  }

}
