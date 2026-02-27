import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { Friend } from './friend.entity';
import { FriendRequest } from './friend-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { User } from 'src/user/user.entity';

@Module({
 imports: [
    TypeOrmModule.forFeature([Friend, FriendRequest, User]),
    NotificationModule,
  ],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
