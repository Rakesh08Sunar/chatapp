// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Message } from './message.entity';
// import { ChatGateway } from './chat.gateway';

// @Injectable()
// export class ChatService {
//   constructor(
//     @InjectRepository(Message)
//     private messageRepository: Repository<Message>,
//     private chatGateway: ChatGateway,
//   ) {}

//   async getMessages(userId: number, friendId: number) {
//     return this.messageRepository.find({
//       where: [
//         { senderId: userId, receiverId: friendId },
//         { senderId: friendId, receiverId: userId },
//       ],
//       order: { createdAt: 'ASC' },
//     });
//   }

//   async sendMessage(userId: number, friendId: number, message: string) {
//     const newMessage = this.messageRepository.create({
//       senderId: userId,
//       receiverId: friendId,
//       message,
//     });

//     const savedMessage = await this.messageRepository.save(newMessage);

//     // 🔥 Emit to receiver in real-time
//     this.chatGateway.server
//       .to(`user-${friendId}`)
//       .emit('receiveMessage', savedMessage);

//     return savedMessage;
//   }
// }
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private chatGateway: ChatGateway,
  ) {}

  async getMessages(userId: number, friendId: number) {
    return this.messageModel.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });
  }

  async sendMessage(userId: number, friendId: number, content: string) {
    const newMessage = new this.messageModel({
      senderId: userId,
      receiverId: friendId,
      content,
    });

    const savedMessage = await newMessage.save();

    // 🔥 Emit in real-time
    this.chatGateway.server
      .to(`user-${friendId}`)
      .emit('receiveMessage', savedMessage);

    return savedMessage;
  }
}
