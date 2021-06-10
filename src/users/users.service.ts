import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeveloperPositionType,
  loginType,
  UserRole,
  Users,
} from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { LocalSignUpRequestDto } from './dto/local-sign-up.request.dto';
import { GithubSignUpDto } from 'src/common/dto/github-signup.dto';

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

  async findByGithubID(githubID: number): Promise<Users | false> {
    const user = await this.usersRepository.findOne({ where: { githubID } });
    if (user) {
      return user;
    }
    return false;
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

  async githubSignUpUser(githubSignUpDto: GithubSignUpDto) {
    const returned = await this.usersRepository.save({
      githubID: githubSignUpDto.githubUserInfo.githubID,
      password: githubSignUpDto.githubUserInfo.nodeID,
      loginID: githubSignUpDto.githubUserInfo.loginID,
      positionType: githubSignUpDto.positionType,
      email: githubSignUpDto.githubUserInfo.email || '',
      nickname: githubSignUpDto.githubUserInfo.name,
      blog: githubSignUpDto.githubUserInfo.blog,
      bio: githubSignUpDto.githubUserInfo.bio,
      avatarUrl: githubSignUpDto.githubUserInfo.avatarUrl,
      githubPageUrl: githubSignUpDto.githubUserInfo.githubPageUrl,
      loginType: loginType.Github,
      role: UserRole.User,
    });

    console.log('깃헙 유저 회원가입 : ', returned);
    // delete returned.password;
    return returned;
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
