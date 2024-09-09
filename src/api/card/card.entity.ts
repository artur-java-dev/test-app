import {
  BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { CardsColumn } from '../column/column.entity'
import { CardComment } from '../comment/comment.entity'
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'


@Entity()
@ApiExtraModels(CardComment)
export class Card extends BaseEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty({ nullable: false })
  public id!: number

  @Column({ type: 'varchar' })
  @ApiProperty({ nullable: false })
  public title!: string

  @Column({ type: 'varchar' })
  @ApiProperty({ nullable: false })
  public description!: string

  @CreateDateColumn()
  @ApiProperty()
  public createdAt: Date

  @UpdateDateColumn()
  @ApiProperty()
  public updatedAt: Date

  @ManyToOne(
    type => CardsColumn,
    col => col.cards,
    { eager: true }
  )
  public column!: CardsColumn

  @OneToMany(
    type => CardComment,
    comm => comm.card,
    { cascade: true }
  )
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(CardComment) },
  })
  public comments: CardComment[]

}
