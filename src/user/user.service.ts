/* eslint-disable prettier/prettier */
import {
  HttpException,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { User } from './Entity/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async create(payload: CreateUserDto) {
    const { email, password, ...rest } = payload;
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (user) {
      throw new HttpException(`User already exists`, 400);
    }
    const hashedPassword = await argon2.hash(password);
    const userDetails = (await this.userRepo.save({
      email,
      password: hashedPassword,
      ...rest,
    })) as User & { password?: string };
    const safeUserDetails = { ...userDetails };
    const userPayload = {
      id: safeUserDetails.id,
      email: safeUserDetails.email,
    };
    return {
      access_token: await this.jwtService.signAsync(userPayload),
    };
  }

  async update(id, payload: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException(`User invalid`, 401);
    }
    await this.userRepo.update(id, payload);
    return {
      message: `User successfully updated`,
    };
  }

  async deleteUser(id) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException(`User Invalid`, 401);
    }
    await this.userRepo.delete(id);
    return {
      message: `User successfully deleted`,
    };
  }

  async findEmail(email: string) {
    const mail = await this.userRepo.findOneByOrFail({ email });
    if (!mail) {
      throw new UnauthorizedException();
    }
    return mail;
  }

  async signIn(payload: LoginDto, @Req() req: Request, @Res() res: Response) {
    const { email, password } = payload;
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new HttpException(`No email found`, 400);
    }
    const checkedPassword = await this.verifyPassword(user.password, password);
    if (!checkedPassword) {
      throw new HttpException(`Sorry password does not exist`, 400);
    }
    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id,
    });
    res.cookie('isAuthenticated', token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000,
    });
    // delete user password
    return res.send({
      success: true,
      userToken: token,
    });
  }

  async logout(@Req() req: Request, @Res() res: Response) {
    const clearCookie = res.clearCookie(`isAuthenticated`);

    const response = res.send(`User successfully logout`);

    return {
      clearCookie,
      response,
    };
  }

  async findAll(): Promise<User[]> {
    // return this.userRepo.find();
    // const user = await this.findEmail(email);

    // delete user.password;
    return await this.userRepo.find();
  }

  async user(headers: any): Promise<any> {
    const authorizationHeader = headers.authorization; //It tries to extract the authorization header from the incoming request headers. This header typically contains the token used for authentication.
    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');
      // const secret = process.env.JWT_SECRET;
      //checks if the authorization header exists. If not, it will skip to the else block and throw an error
      try {
        const decoded = this.jwtService.verify(token);
        const id = decoded['id']; // After verifying the token, the function extracts the user's id from the decoded token payload.
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        return { id: id, name: user.name, email: user.email, role: user.role };
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Invalid or missing bearer token');
    }
  }

  async verifyPassword(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
      return false;
    }
  }
}

// findAll() {
// return this.userRepo.find().exec();
// }

// findOne(id: number) {
// return this.userRepo.findById(id).exec();
// }

// update(id: number, updateUserDto: UpdateUserDto) {
// return this.userRepo.findByIdAndUpdate(id, updateUserDto).exec();
// }

// remove(id: number) {
// return this.userRepo.findByIdAndDelete(id).exec();
//
