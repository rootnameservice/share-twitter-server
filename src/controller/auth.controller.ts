import { Controller, Post, Body, Res, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { Response } from 'express';
import { getNHoursAfterDate } from 'src/utils/utils';

interface AuthorizeTwitterQueryParams {
    code: string;
    state: string;
    path?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Get('twitter')
  async authorizeTwitter(
    @Query() query : AuthorizeTwitterQueryParams,
    @Res() response: Response,
  ) {
    const { code, state, path} = query;

    const token = await this.authService.requestTwitterAccessToken(code, state, path);

    response.cookie('accessToken', token.token.access_token, {
        httpOnly: true,
        domain: process.env.APP_DOMAIN,
        expires: getNHoursAfterDate(new Date(), 3),
    })

    response.cookie('state', state, {
        httpOnly: true,
        domain: process.env.APP_DOMAIN,
        expires: getNHoursAfterDate(new Date(), 3),
    })

    const redirectPath = process.env.APP_DOMAIN + path;

    return response.redirect(redirectPath);
  }
}
