import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CardComment } from './comment.entity'
import { CreateCommentDto, UpdateCommentDto } from './dto'
import { CardsService } from '../card/cards.service'
import { badRequest } from 'src/utils/errors-help-func'


@Injectable()
export class CommentsService {

  @Inject(CardsService)
  private readonly cardsService: CardsService

  @InjectRepository(CardComment)
  private readonly repository: Repository<CardComment>


  public async findById(id: number): Promise<CardComment> {
    const comm = await this.repository.findOneBy({ id })
    if (!comm) {
      throw new NotFoundException(`Комментарий не найден (id=${id})`)
    }

    return comm
  }

  public async findByCard(
    userId: number, columnId: number, cardId: number)
    : Promise<CardComment[]> {

    const card = await this.cardsService.findById(cardId)
    if (card.column.author.id !== userId) {
      badRequest(`Пользователь не является владельцем карточки (id=${cardId})`)
    }

    const comments = await this.repository.find({
      where: {
        card: {
          id: cardId,
          column: {
            id: columnId,
            author: { id: userId }
          }
        }
      }
    })
    return comments
  }

  public async createComment(
    userId: number, cardId: number, data: CreateCommentDto)
    : Promise<CardComment> {

    const comment = await this.cardsService.addComment(userId, cardId, data)
    return comment
  }

  public async updateById(id: number, data: UpdateCommentDto) {
    const comment = await this.findById(id)
    comment.content = data.content

    const saved = await this.repository.save(comment)
    return saved
  }

  public async deleteById(id: number) {
    const comment = await this.findById(id)
    await this.repository.remove(comment)
  }

  public async isCreatedBy(id: number, userId: number) {
    const comment = await this.findById(id)
    return comment.card.column.author.id === userId
  }

}
