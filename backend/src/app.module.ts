import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.AIVEN_URI,
      // host: "mysql987-db-chatapp987.j.aivencloud.com",
      port: 15449,
      username: "avnadmin",
      password: "AVNS_VFLm9EdH4oBBaJdZsFY",
      database: "defaultdb",
      autoLoadEntities: true,
      // entities: [User],
      synchronize: true, // ❗ false in production

    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''), 
    AuthModule,
    UserModule,
    FriendModule,
    ChatModule,
    NotificationModule
  ],
})
export class AppModule {}
