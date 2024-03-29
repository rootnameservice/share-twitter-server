import { Controller, Req, Body, Res, HttpCode, HttpStatus, Get, Query, Headers } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { Response, Request } from 'express';
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
    @Req() request : Request, 
    @Res() response: Response,
  ) {
    const {code, state, path} = query;

    const callbackUrl = (request.secure) ?
        "https://" + request.headers.host + request.path + "?path=" + encodeURIComponent(path) :
        "http://" + request.headers.host + request.path + "?path=" + encodeURIComponent(path)

    const token = await this.authService.requestTwitterAccessToken(code, state, callbackUrl);

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
