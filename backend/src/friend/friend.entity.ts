// import { User } from "src/user/user.entity";
// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// // friend-request.entity.ts
// @Entity()
// export class FriendRequest {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => User)
//   sender: User;

//   @ManyToOne(() => User)
//   receiver: User;

//   @Column({ default: 'pending' })
//   status: 'pending' | 'accepted' | 'rejected';
// }



import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user1: User;

  @ManyToOne(() => User)
  user2: User;
}
