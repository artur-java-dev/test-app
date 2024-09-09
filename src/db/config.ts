import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'


const entityFilenameTmpl = '*.entity.{ts,js}'

@Injectable()
export class ConfigORM implements TypeOrmOptionsFactory {

  private readonly host: string
  private readonly port: number
  private readonly dbName: string
  private readonly user: string
  private readonly pword: string

  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {
    this.host = this.config.get<string>('DATABASE_HOST')
    this.port = this.config.get<number>('DATABASE_PORT')
    this.dbName = this.config.get<string>('DATABASE_NAME')
    this.user = this.config.get<string>('DATABASE_USER')
    this.pword = this.config.get<string>('DATABASE_PASSWORD')
  }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.host,
      port: this.port,
      database: this.dbName,
      username: this.user,
      password: this.pword,
      entities: [`dist/**/${entityFilenameTmpl}`],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'migrations',
      // logger: 'file',
      synchronize: true,
    }
  }

}
