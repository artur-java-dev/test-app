import { Exclude } from 'class-transformer'
import { Nullable } from 'src/utils/common-types'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { CardsColumn } from '../column/column.entity'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'


@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  @ApiProperty({ nullable: false })
  public id!: number

  @Column({ type: 'varchar', unique: true })
  @ApiProperty({ nullable: false })
  public email!: string

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ type: String })
  public name: Nullable<string>

  @Column({ type: 'timestamp' })
  @ApiProperty({ nullable: false })
  public registerTime: Date

  @Column({ type: 'timestamp', nullable: true, default: null })
  @ApiPropertyOptional({ type: Date })
  public lastLoginTime: Nullable<Date>

  @UpdateDateColumn()
  @ApiPropertyOptional()
  public updatedAt: Date

  @OneToMany(
    type => CardsColumn,
    col => col.author,
    { cascade: true })
  public columns: CardsColumn[]

}
