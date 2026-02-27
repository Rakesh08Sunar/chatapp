import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('profile')
    getHello(@Req() req) {
        return "Hello User!";
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: any) {
        return this.userService.getProfile(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Put('me')
    updateProfile(
        @Req() req,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.userService.updateProfile(req.user.id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('discover')
    discoverUsers(@Req() req: any) {
        return this.userService.discoverUsers(req.user.id);
    }


}
