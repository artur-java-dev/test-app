import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, Type } from '@nestjs/common'
import { Request } from 'express'
import { UsersService } from '../users.service'
import { unexpectedError } from 'src/utils/errors-help-func'
import { EntityType } from 'src/api/types'


@Injectable()
export class OwnerGuard implements CanActivate {

  @Inject(UsersService)
  private readonly service: UsersService

  async canActivate(context: ExecutionContext) {
    const ctrlClass = context.getClass()
    const req = context.switchToHttp().getRequest<Request>()
    const entityType = getEntityType(ctrlClass)
    const entityId = Number(req.params['id'])
    const userId = Number(req.params['userId'])

    const can = await this.isOwner(entityType, entityId, userId)
    if (!can) {
      throw new NotOwnResourceErr()
    }

    return can
  }

  private async isOwner(entityType: EntityType, entityId: number, userId: number) {
    return await this.service.isEntityAuthor(entityType, entityId, userId)
  }

}


function getEntityType(typeOfController: Type): EntityType {
  switch (typeOfController.name) {
    case 'ColumnsController': return 'Column'
    case 'CardsController': return 'Card'
    case 'CommentsController': return 'Comment'
    default: unexpectedError(
      `Контроллер '${typeOfController.name}'\
       не поддерживает использование ${OwnerGuard.name}`)
  }
}


export class NotOwnResourceErr extends ForbiddenException {
  constructor() {
    super('Пользователь не владеет данным ресурсом')
  }
}
