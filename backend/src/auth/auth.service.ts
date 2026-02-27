// import { Injectable, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from '../user/user.entity';
// import { RegisterDto } from './dto/register.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepo: Repository<User>,
//   ) {}

//   async register(dto: RegisterDto) {
//     // check existing user
//     const existingUser = await this.userRepo.findOne({
//       where: { email: dto.email },
//     });

//     if (existingUser) {
//       throw new BadRequestException('Email already registered');
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(dto.password, 10);

//     // create user
//     const user = this.userRepo.create({
//       name: dto.name,
//       email: dto.email,
//       password: hashedPassword,
//     });

//     // save to DB (THIS INSERTS ROW)
//     await this.userRepo.save(user);

//     return {
//       message: 'User registered successfully',
//     };
//   }
// }


import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ REGISTER (already working)
  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    await this.userRepo.save(user);

    return { message: 'User registered successfully' };
  }

  // ✅ LOGIN
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async getProfile(payload: any) {
  const user = await this.userRepo.findOne({
    where: { id: payload.id },
    select: ['id', 'name', 'email', 'age', 'gender'],
  });

  return user;
}

}
