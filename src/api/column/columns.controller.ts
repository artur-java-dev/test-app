import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, Patch, Post, UseGuards
} from '@nestjs/common'
import { ColumnsService } from './columns.service'
import { CreateColumnDto, UpdateColumnDto } from './dto'
import { JwtGuard } from '../user/auth/jwt-guard'
import { OwnerGuard } from '../user/auth/owner-guard'
import {
  ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation, ApiParam, ApiTags
} from '@nestjs/swagger'
import { OkCreatedResponse, OkMultiResponse, OkResponse } from 'src/utils/decorators'
import { CardsColumn } from './column.entity'


@ApiTags('Columns')
@Controller('users/:userId/columns')
@UseGuards(JwtGuard)
export class ColumnsController {

  @Inject(ColumnsService)
  private readonly service: ColumnsService

  @Get()
  @ApiOperation({
    summary: 'Возвращает все колонки'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @OkMultiResponse(CardsColumn)
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос' })
  async getAll(@Param('userId') userId: number) {
    const columns = await this.service.findByUser(userId)
    return {
      success: true,
      data: columns
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Создает колонку'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @OkCreatedResponse(CardsColumn)
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос' })
  async create(
    @Param('userId') userId: number,
    @Body() body: CreateColumnDto) {

    const column = await this.service.createColumn(userId, body)
    return {
      success: true,
      data: column
    }
  }

  @Patch(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({
    summary: 'Обновляет колонку по указанному идентификатору'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'id', required: true, description: 'идентификатор колонки' })
  @OkResponse(CardsColumn)
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос или нет прав' })
  @ApiNotFoundResponse({ description: 'колонка не найдена' })
  async update(
    @Param('userId') userId: number,
    @Param('id') id: number,
    @Body() body: UpdateColumnDto) {

    const updated = await this.service.updateById(userId, id, body)
    return {
      success: true,
      data: updated
    }
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удаляет колонку по указанному идентификатору'
  })
  @ApiParam({ name: 'userId', required: true, description: 'идентификатор пользователя' })
  @ApiParam({ name: 'id', required: true, description: 'идентификатор колонки' })
  @ApiOkResponse({ status: HttpStatus.NO_CONTENT, description: 'Успешно удалено' })
  @ApiForbiddenResponse({ description: 'Неавторизованный запрос или нет прав' })
  @ApiNotFoundResponse({ description: 'колонка не найдена' })
  async remove(
    @Param('userId') userId: number,
    @Param('id') id: number) {

    await this.service.deleteById(id)
  }

}
