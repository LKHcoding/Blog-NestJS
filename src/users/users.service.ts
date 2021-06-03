import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { GithubCodeDto } from 'src/common/dto/user.dto';
import axios from 'axios';

dotenv.config();

export interface IGithubUserTypes {
  githubID: string;
  loginID: string;
  email: string;
  name: string;
  blog: string;
  bio: string;
  avatarUrl: string;
  githubPageUrl: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async findById(id: number): Promise<Users | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      '해당 id가 존재하지 않습니다',
      HttpStatus.NOT_FOUND,
    );
  }

  async findByLoginID(loginID: string): Promise<Users | undefined> {
    const user = await this.usersRepository.findOne({ where: { loginID } });
    if (user) {
      return user;
    }
    throw new HttpException(
      '해당 Login ID가 존재하지 않습니다',
      HttpStatus.NOT_FOUND,
    );
  }

  async postUsers(
    email: string,
    nickname: string,
    password: string,
  ): Promise<Users | BadRequestException> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return new BadRequestException();
    }
    const returned = await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });

    return returned;
  }
}
