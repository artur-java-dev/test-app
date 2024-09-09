import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CardsColumn } from './column.entity'
import { ColumnsController } from './columns.controller'
import { ColumnsService } from './columns.service'
import { UsersModule } from '../user/users.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([CardsColumn]),
    forwardRef(() => UsersModule)
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService]
})
export class ColumnsModule {
}
