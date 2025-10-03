import { Column, Entity, OneToMany } from 'typeorm';
import { Role } from '../../enum/role.enum';
import { Base } from './baseEntity';
import { Todolist } from '../../todolist/entities/todolist.entity';

@Entity()
export class User extends Base {
  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.user,
  })
  role: Role;

  @OneToMany(() => Todolist, (todo: Todolist) => todo.user)
  todo: Todolist[];
}
