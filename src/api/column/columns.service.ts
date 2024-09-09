import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UsersService } from '../user/users.service'
import { CardsColumn } from './column.entity'
import { CreateColumnDto, UpdateColumnDto } from './dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCardDto } from '../card/dto'
import { Card } from '../card/card.entity'
import { badRequest } from 'src/utils/errors-help-func'
import { Logger } from 'nestjs-pino'


@Injectable()
export class ColumnsService {

  @Inject(forwardRef(() => UsersService))
  private readonly usersService: UsersService

  @InjectRepository(CardsColumn)
  private readonly repository: Repository<CardsColumn>

  constructor(private readonly logger: Logger) { }


  public async findByUser(userId: number): Promise<CardsColumn[]> {
    const columns = await this.usersService.getColumnsByUser(userId)
    return columns
  }


  public async findById(id: number, withCards = false): Promise<CardsColumn> {
    const opts = withCards ?
      {
        where: { id },
        relations: { cards: true }
      } :
      {
        where: { id }
      }
    const col = await this.repository.findOne(opts)
    if (!col) {
      throw new NotFoundException(`Колонка не найдена (id=${id})`)
    }

    return col
  }

  public async createColumn(userId: number, data: CreateColumnDto) {
    const col = Object.assign(new CardsColumn, data)
    const column = await this.usersService.addColumn(userId, col)
    return column
  }

  public async updateById(userId: number, columnId: number, data: UpdateColumnDto) {
    const columns = await this.usersService.getColumnsByUser(userId)
    const col = columns.find(c => c.id === columnId)
    if (!col) {
      throw new NotFoundException(`Колонка не найдена (id=${columnId})`)
    }

    col.title = data.title
    col.position = data.position ?? col.position

    const saved = await this.repository.save(col)
    return saved
  }

  public async deleteById(id: number) {
    const col = await this.findById(id)
    const removed = await this.repository.remove(col)
    return removed
  }

  public async addCard(userId: number, columnId: number, data: CreateCardDto) {
    const card = Object.assign(new Card, data)
    const col = await this.findById(columnId, true)
    if (col.author.id !== userId) {
      badRequest(`Пользователь не является владельцем колонки (id=${columnId})`)
    }
    const len = col.cards.push(card)
    const saved = await this.repository.save(col)
    return saved.cards[len - 1]
  }

  public async isCreatedBy(id: number, userId: number) {
    const col = await this.findById(id)
    return col.author.id === userId
  }

}
