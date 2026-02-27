import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationService } from './notification.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private service: NotificationService) {}

  @Get()
  getMy(@Req() req) {
    return this.service.getMyNotifications(req.user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: number) {
    return this.service.markAsRead(Number(id));
  }

    @Get('unread-count')
  getUnreadCount(@Req() req) {
    return this.service.getUnreadCount(req.user.id);
  }
}
