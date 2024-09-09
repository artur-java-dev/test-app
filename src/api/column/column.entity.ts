import {
  BaseEntity, Column, CreateDateColumn, Entity,
  ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { User } from '../user/user.entity'
import { Card } from '../card/card.entity'
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'


@Entity()
@ApiExtraModels(Card)
export class CardsColumn extends BaseEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty({ nullable: false })
  public id!: number

  @Column({ type: 'varchar' })
  @ApiProperty({ nullable: false })
  public title!: string

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ nullable: false })
  public position: number

  @CreateDateColumn()
  @ApiProperty()
  public createdAt: Date

  @UpdateDateColumn()
  @ApiProperty()
  public updatedAt: Date

  @ManyToOne(
    type => User,
    user => user.columns,
    { eager: true }
  )
  public author!: User

  @OneToMany(
    type => Card,
    card => card.column,
    { cascade: true }
  )
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(Card) },
  })
  public cards: Card[]

}
