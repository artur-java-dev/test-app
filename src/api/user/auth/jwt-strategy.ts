import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '../user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,

    @InjectRepository(User)
    private readonly repository: Repository<User>

  ) {

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()
    const key = config.get('JWT_KEY')
    super({
      jwtFromRequest: token,
      secretOrKey: key,
      ignoreExpiration: false,
    })
  }


  async validate(payload: AccessTokenPayload): Promise<User> {
    const user = await this.repository.findOne({
      where: { email: payload.email }
    })
    return user
  }

}


export type AccessTokenPayload = {
  id: number,
  email: string
}
