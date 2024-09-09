import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { ColumnsModule } from '../column/columns.module'
import { CardsModule } from '../card/cards.module'
import { CommentsModule } from '../comment/comments.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ColumnsModule),
    forwardRef(() => CardsModule),
    forwardRef(() => CommentsModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
