import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, Patch, Post, UseGuards
} from '@nestjs/common'
import { JwtGuard } from '../user/auth/jwt-guard'
import { CardsService } from './cards.service'
import { CreateCardDto, UpdateCardDto } from './dto'
import { OwnerGuard } from '../user/auth/owner-guard'
import { Logger } from 'nestjs-pino'
import {
  ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiParam, ApiTags
} from '@nestjs/swagger'
import { Card } from './card.entity'
import { OkCreatedResponse, OkMultiResponse, OkResponse } from 'src/utils/decorators'


@ApiTags('Cards')
@Controller('users/:userId/columns/:columnId/cards')
@UseGuards(JwtGuard)
export class CardsController {

  @Inject(CardsService)
  private readonly service: CardsService

  constructor(private readonly logger: Logger) { }

  @Get()
  @ApiOperation({
    summary: 'Возвращает все карточки указанной колонки'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'columnId', required: true, description: 'идентификатор колонки' })
  @OkMultiResponse(Card)
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiNotFoundResponse({ description: 'Колонка не найдена' })
  async getByColumn(@Param('userId') userId: number, @Param('columnId') columnId: number) {
    const cards = await this.service.findByColumn(userId, columnId)
    return {
      success: true,
      data: cards
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Создает карточку'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'columnId', required: true, description: 'идентификатор колонки' })
  @OkCreatedResponse(Card)
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос' })
  @ApiBadRequestResponse({ description: 'Неверный запрос' })
  @ApiNotFoundResponse({ description: 'Колонка не найдена' })
  async create(
    @Param('userId') userId: number,
    @Param('columnId') columnId: number,
    @Body() body: CreateCardDto) {

    const card = await this.service.createCard(userId, columnId, body)
    return {
      success: true,
      data: card
    }
  }

  @Patch(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({
    summary: 'Обновляет карточку по указанному идентификатору'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'columnId', required: true, description: 'идентификатор колонки' })
  @ApiParam({ name: 'id', required: true, description: 'идентификатор карточки' })
  @OkResponse(Card)
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос или нет прав' })
  @ApiNotFoundResponse({ description: 'карточка не найдена' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCardDto) {

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
    summary: 'Удаляет карточку по указанному идентификатору, а также все связанные комментарии'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'columnId', required: true, description: 'идентификатор колонки' })
  @ApiParam({ name: 'id', required: true, description: 'идентификатор карточки' })
  @ApiOkResponse({ status: HttpStatus.NO_CONTENT, description: 'Успешно удалено' })
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос или нет прав' })
  @ApiNotFoundResponse({ description: 'карточка не найдена' })
  async remove(@Param('id') id: number) {
    await this.service.deleteById(id)
  }

}
