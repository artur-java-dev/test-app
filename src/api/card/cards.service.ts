import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Card } from './card.entity'
import { Repository } from 'typeorm'
import { CreateCardDto, UpdateCardDto } from './dto'
import { ColumnsService } from '../column/columns.service'
import { CreateCommentDto } from '../comment/dto'
import { CardComment } from '../comment/comment.entity'
import { badRequest } from 'src/utils/errors-help-func'


@Injectable()
export class CardsService {

  @Inject(ColumnsService)
  private readonly columnsService: ColumnsService

  @InjectRepository(Card)
  private readonly repository: Repository<Card>


  public async findById(id: number, withComments = false): Promise<Card> {
    const opts = withComments ?
      {
        where: { id },
        relations: { comments: true }
      } :
      {
        where: { id }
      }
    const card = await this.repository.findOne(opts)
    if (!card) {
      throw new NotFoundException(`Карточка не найдена (id=${id})`)
    }

    return card
  }

  public async findByColumn(userId: number, columnId: number): Promise<Card[]> {
    const col = await this.columnsService.findById(columnId)
    if (col.author.id !== userId) {
      badRequest(`Пользователь не является владельцем колонки (id=${columnId})`)
    }
    const relations = { comments: true }
    const cards = await this.repository.find({
      relations,
      where: {
        column: {
          id: columnId,
          author: { id: userId }
        }
      }
    })
    return cards
  }

  public async createCard(
    userId: number, columnId: number, data: CreateCardDto)
    : Promise<Card> {

    const newCard = await this.columnsService.addCard(userId, columnId, data)
    return newCard
  }

  public async updateById(id: number, data: UpdateCardDto): Promise<Card> {
    const card = await this.findById(id)
    card.title = data.title
    card.description = data.description

    const saved = await this.repository.save(card)
    return saved
  }

  public async deleteById(id: number) {
    const card = await this.findById(id)
    await this.repository.remove(card)
  }

  public async addComment(
    userId: number, cardId: number, data: CreateCommentDto)
    : Promise<CardComment> {

    const comm = Object.assign(new CardComment, data)
    const card = await this.findById(cardId, true)
    if (card.column.author.id !== userId) {
      badRequest(`Пользователь не является владельцем карточки (id=${cardId})`)
    }

    const len = card.comments.push(comm)
    const saved = await this.repository.save(card)

    return saved.comments[len - 1]
  }

  public async isCreatedBy(id: number, userId: number) {
    const card = await this.findById(id)
    return card.column.author.id === userId
  }

}
