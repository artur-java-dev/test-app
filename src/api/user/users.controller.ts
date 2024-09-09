import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, Patch, UseGuards
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto'
import { JwtGuard } from './auth/jwt-guard'
import { ApiExcludeEndpoint } from '@nestjs/swagger'


@Controller('users')
@UseGuards(JwtGuard)
// здесь нужен механизм Guards на основе ролей юзера, но это вне рамок задачи
export class UsersController {

  @Inject(UsersService)
  private readonly service: UsersService

  @Get(':id')
  @ApiExcludeEndpoint()
  async find(@Param('id') id: number) {
    const user = await this.service.findById(id)
    return {
      success: true,
      data: user
    }
  }

  @Get()
  @ApiExcludeEndpoint()
  async findAll() {
    const users = await this.service.getAll()
    return {
      success: true,
      data: users
    }
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto) {

    const updated = await this.service.updateById(id, dto)
    return {
      success: true,
      data: updated
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExcludeEndpoint()
  async remove(@Param('id') id: number) {
    await this.service.deleteById(id)
  }

}
