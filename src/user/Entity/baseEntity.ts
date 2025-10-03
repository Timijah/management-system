import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn('uuid')
  //universal unique identifier
  id: string;

  @CreateDateColumn()
  createdDate: Date;
}
