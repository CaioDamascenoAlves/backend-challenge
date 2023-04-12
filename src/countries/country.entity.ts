import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate } from 'typeorm';

@Entity()
export class Country {
  @ApiProperty({ description: 'The id of the country', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the country', example: 'Brazil' })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({
    description: 'The Local, with city of the country',
    example: 'São Paulo, Brazil',
  })
  @Column({ type: 'varchar' })
  place: string;

  @ApiProperty({
    description: 'The date of the country',
    example: '2024-01-01',
  })
  @Column({ type: 'date' })
  meta: Date;

  @ApiProperty({
    type: Date,
    description: 'The date of creation of the country',
    example: '2023-04-11T12:00:00Z',
  })
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ApiProperty({
    type: Date,
    description: 'The date of update of the country',
    example: '2023-04-11T12:00:00Z',
  })
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }

}
