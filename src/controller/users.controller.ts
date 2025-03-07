import { Controller, Req, Res, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../service/users.service';
import { Response, Request } from 'express';
import { AuthGuard } from '../gaurd/authGaurd';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @HttpCode(HttpStatus.OK)
    @Get('me')
    async getCurrentUser(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const token =  req.cookies['accessToken'];

        if(!token) {
            return res.json({ isSuccess: false});
        }
        const user = await this.userService.requestCurrentUser(token)

        return res.json({ isSuccess: true, ...user });
    }
}
