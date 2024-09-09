import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CardComment } from './comment.entity'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { CardsModule } from '../card/cards.module'
import { UsersModule } from '../user/users.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([CardComment]),
    forwardRef(() => UsersModule),
    CardsModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService]
})
export class CommentsModule {
}
