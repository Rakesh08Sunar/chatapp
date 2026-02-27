// import { Injectable } from '@nestjs/common';
// import { NotificationService } from 'src/notification/notification.service';

// @Injectable()
// export class FriendService {

//      constructor(
//     private readonly notificationService: NotificationService,
//   ) {}
//     async sendRequest(fromId: number, toId: number) {
//     // TODO: save friend request in DB (entity later)

//     // 🔔 CREATE NOTIFICATION
//     await this.notificationService.create(
//       toId,
//       'You have a new friend request',
//       'FRIEND_REQUEST',
//     );

//     return { message: 'Friend request sent' };
//   }


//     getRequests(userId: number) {
//         // Logic to get friend requests for a user
//         // return { message: `Friend requests for user ${userId}` };
//         return []
//     }

//   async acceptRequest(requestId: number, userId: number) {
//     await this.notificationService.create(
//       userId,
//       'Friend request accepted',
//       'REQUEST_ACCEPTED',
//     );
//     return { message: 'Friend request accepted' };
//   }

//     getFriends(userId: number) {
//         // Logic to get friends for a user
//         // return { message: `Friends for user ${userId}` };
//         return []
//     }
// }


import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { FriendRequest } from './friend-request.entity';
import { User } from '../user/user.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepo: Repository<Friend>,

    @InjectRepository(FriendRequest)
    private requestRepo: Repository<FriendRequest>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private notificationService: NotificationService,
  ) {}

  // ✅ Send Friend Request
  async sendRequest(fromId: number, toId: number) {
    if (fromId === toId)
      throw new BadRequestException('You cannot send request to yourself');

    const existing = await this.requestRepo.findOne({
      where: {
        sender: { id: fromId },
        receiver: { id: toId },
        status: 'pending',
      },
    });

    if (existing)
      throw new BadRequestException('Request already sent');

    const request = this.requestRepo.create({
      sender: { id: fromId },
      receiver: { id: toId },
      status: 'pending',
    });

    await this.requestRepo.save(request);

    await this.notificationService.create(
      toId,
      'You have a new friend request',
      'FRIEND_REQUEST',
    );

    return { message: 'Friend request sent' };
  }

  // ✅ Get Incoming Requests
  // async getRequests(userId: number) {
  //   return this.requestRepo.find({
  //     where: { receiver: { id: userId }, status: 'pending' },
  //     relations: ['sender'],
  //   });
  // }

  async getRequests(userId: number) {
  return this.requestRepo.find({
    where: {
      receiver: { id: userId },
      status: 'pending',
    },
    relations: ['sender'], //  VERY IMPORTANT
  });
}


  // ✅ Accept Request
  // async acceptRequest(requestId: number, userId: number) {
  //   const request = await this.requestRepo.findOne({
  //     where: { id: requestId },
  //     relations: ['sender', 'receiver'],
  //   });

  //   if (!request) throw new BadRequestException('Request not found');

  //   if (request.receiver.id !== userId)
  //     throw new BadRequestException('Unauthorized');

  //   // Create Friend relation
  //   const friendship = this.friendRepo.create({
  //     user1: request.sender,
  //     user2: request.receiver,
  //   });

  //   await this.friendRepo.save(friendship);

  //   request.status = 'accepted';
  //   await this.requestRepo.save(request);

  //   return { message: 'Friend request accepted' };
  // }

  async acceptRequest(requestId: number, userId: number) {
  const request = await this.requestRepo.findOne({
    where: { id: requestId },
    relations: ['sender', 'receiver'],
  });

  if (!request) throw new Error('Request not found');

  if (request.receiver.id !== userId)
    throw new Error('Unauthorized');

  request.status = 'accepted';
  await this.requestRepo.save(request);

  const friendship = this.friendRepo.create({
    user1: request.sender,
    user2: request.receiver,
  });

  await this.friendRepo.save(friendship);

  return { message: 'Friend request accepted' };
}


  // ✅ Get Friends List
  // async getFriends(userId: number) {
  //   const friends = await this.friendRepo.find({
  //     where: [
  //       { user1: { id: userId } },
  //       { user2: { id: userId } },
  //     ],
  //     relations: ['user1', 'user2'],
  //   });

  //   return friends.map((f) =>
  //     f.user1.id === userId ? f.user2 : f.user1,
  //   );
  // }

  async getFriends(userId: number) {
  const friendships = await this.friendRepo.find({
    where: [
      { user1: { id: userId } },
      { user2: { id: userId } },
    ],
    relations: ['user1', 'user2'],
  });

  return friendships.map((friendship) => {
    return friendship.user1.id === userId
      ? friendship.user2
      : friendship.user1;
  });
}

}
