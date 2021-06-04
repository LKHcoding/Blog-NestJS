import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { loginType, UserRole, Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { LocalSignUpRequestDto } from './dto/local-sign-up.request.dto';
import { IGithubUserTypes } from 'src/auth/auth.service';

dotenv.config();

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

  async githubSignUpUser(githubUserData: IGithubUserTypes) {
    // db에 github user가 회원가입 되어있는지 확인(깃허브 아이디값으로)
    const user = await this.usersRepository.findOne({
      where: { githubID: githubUserData.githubID },
    });

    console.log(githubUserData);

    // user가 없다면
    if (!user) {
      const returned = await this.usersRepository.save({
        githubID: githubUserData.githubID,
        password: githubUserData.nodeID,
        loginID: githubUserData.loginID,
        email: githubUserData.email || '',
        nickname: githubUserData.name,
        blog: githubUserData.blog,
        bio: githubUserData.bio,
        avatarUrl: githubUserData.avatarUrl,
        githubPageUrl: githubUserData.githubPageUrl,
        loginType: loginType.Github,
        role: UserRole.User,
      });
      console.log('깃헙 유저 회원가입 : ', returned);
      // delete returned.password;
      return returned;
    }

    //유저가 가입되어 있다면 가입된 유저를 리턴한다.
    // delete user.password;
    return user;
  }

  async postUsers(
    signUpUserData: LocalSignUpRequestDto,
  ): Promise<Users | BadRequestException> {
    const hashedPassword = await bcrypt.hash(signUpUserData.password, 12);

    const user = await this.usersRepository.findOne({
      where: { loginID: signUpUserData.loginID },
    });

    if (user) {
      return new HttpException(
        '해당 아이디가 이미 존재합니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    const returned = await this.usersRepository.save({
      ...signUpUserData,
      password: hashedPassword,
    });

    return returned;
  }
}
