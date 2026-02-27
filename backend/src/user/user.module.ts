// import { Module } from '@nestjs/common';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user.entity';
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [TypeOrmModule.forFeature([User]),JwtModule.register({
//     secret: process.env.JWT_SECRET,
//     signOptions: { expiresIn: '1d' },
//   })
// ],
//   controllers: [UserController],
//   providers: [UserService]
// })
// export class UserModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Friend } from 'src/friend/friend.entity';
import { FriendRequest } from 'src/friend/friend-request.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friend,
      FriendRequest
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}


