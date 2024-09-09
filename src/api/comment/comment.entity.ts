import {
  BaseEntity, Column, CreateDateColumn, Entity, ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Card } from '../card/card.entity'
import { ApiProperty } from '@nestjs/swagger'


@Entity()
export class CardComment extends BaseEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty({ nullable: false })
  public id!: number

  @Column({ type: 'varchar' })
  @ApiProperty({ nullable: false })
  public content!: string

  @CreateDateColumn()
  @ApiProperty()
  public createdAt: Date

  @UpdateDateColumn()
  @ApiProperty()
  public updatedAt: Date

  @ManyToOne(
    type => Card,
    card => card.comments,
    { eager: true, onDelete: 'CASCADE' }
  )
  public card!: Card

}
