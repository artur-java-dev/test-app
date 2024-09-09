import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Card } from './card.entity'
import { CardsController } from './cards.controller'
import { CardsService } from './cards.service'
import { ColumnsModule } from '../column/columns.module'
import { UsersModule } from '../user/users.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    ColumnsModule,
    forwardRef(() => UsersModule)
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService]
})
export class CardsModule {
}
