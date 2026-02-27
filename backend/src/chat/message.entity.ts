// import { User } from "src/user/user.entity";
// import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// @Entity()
// export class Message {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => User)
//   sender: User;

//   @ManyToOne(() => User)
//   receiver: User;

//   @Column()
//   message: string;

//   @CreateDateColumn()
//   createdAt: Date;
// }

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  receiverId: number;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
