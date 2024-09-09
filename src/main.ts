import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common'
import { Logger } from 'nestjs-pino'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'


async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      cors: false,
      logger: false
    })

  const config = app.get(ConfigService)
  const port = config.get<number>('PORT')

  setupApp(config, app)
  setupSwagger(app)

  await app.listen(port)
}


function setupApp(config: ConfigService<unknown, boolean>, app: INestApplication<any>) {

  const prefix = config.get<string>('API_PREFIX')
  const globalValidPipe = new ValidationPipe({
    whitelist: true,
    transform: true
  })
  const reflector = app.get(Reflector)
  const interceptor = new ClassSerializerInterceptor(reflector)

  app.useGlobalInterceptors(interceptor)
  app.useGlobalPipes(globalValidPipe)
  app.useLogger(app.get(Logger))
  app.setGlobalPrefix(prefix)
}

function setupSwagger(app: INestApplication<any>) {
  const cfgObj = new DocumentBuilder()
    .setTitle('test app API')
    .setDescription('Описание API тестового приложения')
    .setVersion('1.0')
    .build()

  const doc = SwaggerModule.createDocument(app, cfgObj)
  SwaggerModule.setup('api', app, doc, {
    swaggerOptions: {
      tagsSorter: 'alpha'
    }
  })
}


bootstrap()
