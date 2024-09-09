import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { UpdateUserDto } from './dto'
import { CardsColumn } from '../column/column.entity'
import { EntityType } from '../types'
import { ColumnsService } from '../column/columns.service'
import { CardsService } from '../card/cards.service'
import { CommentsService } from '../comment/comments.service'
import { Logger } from 'nestjs-pino'


@Injectable()
export class UsersService {

  @InjectRepository(User)
  private readonly repository: Repository<User>

  @Inject(forwardRef(() => ColumnsService))
  private readonly columnsService: ColumnsService

  @Inject(CardsService)
  private readonly cardsService: CardsService

  @Inject(CommentsService)
  private readonly commentsService: CommentsService

  constructor(private readonly logger: Logger) { }


  public async findById(id: number): Promise<User> {
    const user = await this.repository.findOneBy({ id })
    if (!user) {
      throw new NotFoundException(`Пользователь не найден (id=${id})`)
    }

    return user
  }

  public async getAll(): Promise<User[]> {
    const users = await this.repository.find()
    return users
  }

  public async getColumnsByUser(userId: number): Promise<CardsColumn[]> {
    const user = await this.getWithNested(userId)
    return user.columns
  }

  public async addColumn(userId: number, column: CardsColumn) {
    const user = await this.getWithNested(userId)
    const len = user.columns.push(column)
    const saved = await this.repository.save(user)
    return saved.columns[len - 1]
  }

  public async removeColumn(userId: number, columnId: number) {
    const user = await this.getWithNested(userId)
    const idx = user.columns.findIndex(c =>
      c.id === columnId
    )

    if (idx > -1) {
      const copy = Object.assign({}, user.columns[idx])
      user.columns.splice(idx, 1)
      await this.repository.save(user)
      return copy
    }

    return null
  }

  private async getWithNested(userId: number) {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: { columns: true }
    })
    if (!user) {
      throw new NotFoundException(`Пользователь не найден (id=${userId})`)
    }
    return user
  }


  public async updateById(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id)
    user.name = dto.name

    const saved = await this.repository.save(user)
    return saved
  }

  public async deleteById(id: number): Promise<void> {
    const user = await this.findById(id)
    await this.repository.remove(user)
  }

  public async isEntityAuthor(type: EntityType, id: number, userId: number) {
    switch (type) {
      case 'Column':
        return await this.columnsService.isCreatedBy(id, userId)
      case 'Card':
        return await this.cardsService.isCreatedBy(id, userId)
      case 'Comment':
        return await this.commentsService.isCreatedBy(id, userId)
    }
  }

}
