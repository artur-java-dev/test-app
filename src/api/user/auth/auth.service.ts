import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../user.entity'
import { Repository } from 'typeorm'
import { LoginDto, RegisterDto } from './dto'
import { encodePassword, isMatchPasswords } from 'src/utils/auth-help-func'
import { JwtService } from '@nestjs/jwt'
import { ApiProperty } from '@nestjs/swagger'


@Injectable()
export class AuthService {

  @InjectRepository(User)
  private readonly repository: Repository<User>

  constructor(
    private readonly jwt: JwtService
  ) {
  }


  public async registerNewUser(body: RegisterDto): Promise<User> {
    const { name, email, password } = body

    const existingUser = await this.repository.findOne({
      where: { email }
    })

    if (existingUser) {
      throw new RegisterMailError()
    }

    const user = new User()
    user.name = name
    user.email = email
    user.password = encodePassword(password)
    user.registerTime = new Date()

    const savedUser = await this.repository.save(user)

    return savedUser
  }


  public async login(body: LoginDto): Promise<AccessToken> {

    const { email, password } = body

    const user = await this.repository.findOne({
      where: { email }
    })

    if (!user) {
      throw new LoginUserError()
    }

    const isValid = isMatchPasswords(password, user.password)

    if (!isValid) {
      throw new LoginPasswordError()
    }

    await this.repository.update(
      user.id,
      { lastLoginTime: new Date() }
    )

    const accessToken = this.generateToken(user)
    return { access_token: accessToken }
  }


  public async refreshToken(user: User): Promise<AccessToken> {
    await this.repository.update(
      user.id,
      { lastLoginTime: new Date() }
    )

    const token = this.generateToken(user)
    return { access_token: token }
  }


  private generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email
    }
    const token = this.jwt.sign(payload)
    return token
  }

}


export class AccessToken {
  @ApiProperty({ nullable: false })
  access_token: string
}


export class RegisterMailError extends ConflictException {
  constructor() {
    super('e-mail уже существует')
  }
}


export class LoginUserError extends HttpException {
  constructor() {
    super('Пользователь не найден', HttpStatus.BAD_REQUEST)
  }
}


export class LoginPasswordError extends HttpException {
  constructor() {
    super('Неверный пароль', HttpStatus.BAD_REQUEST)
  }
}
