import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  // @Get(':friendId')
  // getMessages(@Req() req, @Param('friendId') friendId: number) {
  //   return this.chatService.getMessages(req.user.id, friendId);
  // }

  @Get(':friendId')
  getMessages(@Req() req, @Param('friendId') friendId: string) {
    return this.chatService.getMessages(req.user.id, Number(friendId));
  }

  // @Post(':friendId')
  // sendMessage(
  //   @Req() req,
  //   @Param('friendId') friendId: number,
  //   @Body('message') message: string,
  // ) {
  //   return this.chatService.sendMessage(req.user.id, friendId, message);
  // }
  @Post(':friendId')
sendMessage(
  @Req() req,
  @Param('friendId') friendId: string,
  @Body('message') message: string,
) {
  return this.chatService.sendMessage(req.user.id, Number(friendId), message);
}
}
