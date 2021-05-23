import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';

dotenv.config();

@Module({
  // jwt base setting
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // put env variables
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
