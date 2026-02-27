import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Friend } from 'src/friend/friend.entity';
import { FriendRequest } from 'src/friend/friend-request.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Friend)
        private readonly friendRepo: Repository<Friend>,

        @InjectRepository(FriendRequest)
        private readonly requestRepo: Repository<FriendRequest>,
    ) { }

    async getProfile(payload: any) {
        const user = await this.userRepo.findOne({
            where: { id: payload.id },
            select: ['id', 'name', 'email', 'age', 'gender'],
        });

        return user;
    }

    // async discoverUsers(currentUserId: number) {
    //     const users = await this.userRepo.find({
    //         where: {},
    //         select: ['id', 'name', 'email'],
    //     });

    //     // remove logged in user
    //     return users
    //         .filter(user => user.id !== currentUserId)
    //         .map(user => ({
    //             ...user,
    //             isFriend: false,   // we improve later
    //         }));
    // }

    async discoverUsers(currentUserId: number) {
        const users = await this.userRepo.find({
            select: ['id', 'name', 'email'],
        });

        const results: any[] = [];

        for (const user of users) {
            if (user.id === currentUserId) continue;

            // Check friendship
            const isFriend = await this.friendRepo.findOne({
                where: [
                    { user1: { id: currentUserId }, user2: { id: user.id } },
                    { user1: { id: user.id }, user2: { id: currentUserId } },
                ],
            });

            // Check request sent
            const requestSent = await this.requestRepo.findOne({
                where: {
                    sender: { id: currentUserId },
                    receiver: { id: user.id },
                    status: 'pending',
                },
            });

            results.push({
                id: user.id,
                name: user.name,
                email: user.email,
                isFriend: !!isFriend,
                requestSent: !!requestSent,
            });
        }


        return results;
    }



    async updateProfile(userId: number, dto: any) {
        await this.userRepo.update(userId, dto);

        return this.userRepo.findOne({
            where: { id: userId },
            select: ['id', 'name', 'email', 'age', 'gender'],
        });
    }

}
