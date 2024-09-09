import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard, IAuthGuard } from '@nestjs/passport'


@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements IAuthGuard {

  public canActivate(ctx: ExecutionContext) {
    return super.canActivate(ctx)
  }

}
