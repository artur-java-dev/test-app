import { applyDecorators, Type } from '@nestjs/common'
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger'
import { ResponseDto } from 'src/api/types'


type Decorator = MethodDecorator & ClassDecorator

type DecoratorProducer =
  (options?: ApiResponseOptions) => Decorator


export function OkMultiResponse<TEntity extends Type<unknown>>(type: TEntity) {
  return OkResponse(type, true)
}


export function OkCreatedResponse<TEntity extends Type<unknown>>(type: TEntity) {
  return OkResponse(type, true, ApiCreatedResponse)
}


export function OkResponse<TEntity extends Type<unknown>>(
  type: TEntity, isMultipleObjects = false, responseDecor: DecoratorProducer = ApiOkResponse
) {

  const schemaData = isMultipleObjects ?
    {
      type: 'array',
      items: { $ref: getSchemaPath(type) }
    } :
    {
      $ref: getSchemaPath(type)
    }

  return applyDecorators(
    ApiExtraModels(ResponseDto, type),
    responseDecor({
      description: 'Успешно',
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ResponseDto)
          },
          {
            properties: { data: schemaData }
          }
        ]
      }
    }))
}
