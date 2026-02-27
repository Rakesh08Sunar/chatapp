import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FriendService } from "./friend.service";

// friend.controller.ts
@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

  @Post('request/:userId')
  sendRequest(@Req() req, @Param('userId') userId: number) {
    return this.friendService.sendRequest(req.user.id, userId);
  }

  @Get('requests')
  getRequests(@Req() req) {
    return this.friendService.getRequests(req.user.id);
  }

  @Post('accept/:requestId')
  accept(@Req() req, @Param('requestId') id: number) {
    return this.friendService.acceptRequest(id, req.user.id);
  }

  @Get()
  getFriends(@Req() req) {
    return this.friendService.getFriends(req.user.id);
  }
}
