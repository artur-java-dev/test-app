import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, Patch, Post, UseGuards
} from '@nestjs/common'
import { JwtGuard } from '../user/auth/jwt-guard'
import { CommentsService } from './comments.service'
import { CreateCommentDto, UpdateCommentDto } from './dto'
import { OwnerGuard } from '../user/auth/owner-guard'
import {
  ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiParam, ApiTags
} from '@nestjs/swagger'
import { OkCreatedResponse, OkMultiResponse, OkResponse } from 'src/utils/decorators'
import { CardComment } from './comment.entity'


@ApiTags('Comments')
@Controller('users/:userId/columns/:columnId/cards/:cardId/comments')
@UseGuards(JwtGuard)
export class CommentsController {

  @Inject(CommentsService)
  private readonly service: CommentsService

  @Get()
  @ApiOperation({
    summary: 'Возвращает все комментарии указанной карточки'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'columnId', required: true, description: 'идентификатор колонки' })
  @ApiParam({ name: 'cardId', required: true, description: 'идентификатор карточки' })
  @OkMultiResponse(CardComment)
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiNotFoundResponse({ description: 'Карточка не найдена' })
  async getByCard(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number) {

    const comments = await this.service.findByCard(
      userId, columnId, cardId)

    return {
      success: true,
      data: comments
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Создает комментарий'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'columnId', required: true, description: 'идентификатор колонки' })
  @ApiParam({ name: 'cardId', required: true, description: 'идентификатор карточки' })
  @OkCreatedResponse(CardComment)
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiNotFoundResponse({ description: 'Карточка не найдена' })
  async create(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Body() body: CreateCommentDto) {

    const comment = await this.service.createComment(
      userId, cardId, body)

    return {
      success: true,
      data: comment
    }
  }

  @Patch(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({
    summary: 'Обновляет комментарий по указанному идентификатору'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'columnId', required: true, description: 'идентификатор колонки' })
  @ApiParam({ name: 'cardId', required: true, description: 'идентификатор карточки' })
  @ApiParam({ name: 'id', required: true, description: 'идентификатор комментария' })
  @OkResponse(CardComment)
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос или нет прав' })
  @ApiNotFoundResponse({ description: 'комментарий не найден' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCommentDto) {

    const updated = await this.service.updateById(id, body)
    return {
      success: true,
      data: updated
    }
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удаляет комментарий по указанному идентификатору'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'columnId', required: true, description: 'идентификатор колонки' })
  @ApiParam({ name: 'cardId', required: true, description: 'идентификатор карточки' })
  @ApiParam({ name: 'id', required: true, description: 'идентификатор комментария' })
  @ApiOkResponse({ status: HttpStatus.NO_CONTENT, description: 'Успешно удалено' })
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос или нет прав' })
  @ApiNotFoundResponse({ description: 'комментарий не найден' })
  async remove(@Param('id') id: number) {
    await this.service.deleteById(id)
  }

}
