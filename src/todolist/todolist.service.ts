import { Injectable, HttpException } from '@nestjs/common';
import { CreateTodolistDto } from './dto/create-todolist.dto';
import { UpdateTodolistDto } from './dto/update-todolist.dto';
import { Repository } from 'typeorm';
import { Todolist } from './entities/todolist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/Entity/user.entity';

@Injectable()
export class TodolistService {
  constructor(
    @InjectRepository(Todolist) private readonly todoRepo: Repository<Todolist>,
  ) {}
  async create(payload: CreateTodolistDto, user: User) {
    const todo = new Todolist();
    // todo.UserId = user.id;
    if (!user.id) {
      throw new HttpException(`ID not found`, 400);
    }
    todo.title = payload.title;
    todo.description = payload.description;
    Object.assign(todo, payload);
    this.todoRepo.create(todo);
    return await this.todoRepo.save(todo);
  }

  findAll() {
    return `This action returns all todolist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todolist`;
  }

  update(id: number, updateTodolistDto: UpdateTodolistDto) {
    return `This action updates a #${id} todolist`;
  }

  remove(id: number) {
    return `This action removes a #${id} todolist`;
  }
}
