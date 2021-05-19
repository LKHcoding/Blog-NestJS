import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  getUser() {}

  async findOneUser(email: string): Promise<Users | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
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
