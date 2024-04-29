import { Controller, Req, Res, HttpCode, HttpStatus, Get, Query, Param, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Response, Request } from 'express';
import { getNHoursAfterDate } from '../utils/utils';
import { AuthGuard } from '../gaurd/authGaurd';

interface TwitterCallbackQueryParams {
  code: string;
  state?: string;
  path?: string;
  error?: string
}

interface TokenParams extends TwitterCallbackQueryParams {
  redirect_uri?: string,
  token?: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Get('twitter')
  async authorizeTwitter(
    @Query() query: TwitterCallbackQueryParams,
    @Res() response: Response,
  ) {
    try {
      const { code, state } = query;

      if(!code) {
        return response.redirect(process.env.APP_ENDPOINT);
      }

      const [modal, path] = state.split(".");
  
      const redirectPath = path ? process.env.APP_ENDPOINT + path : process.env.APP_ENDPOINT
      const baseUrl = process.env.NODE_ENV == "development" ? 
        "http://127.0.0.1:3001" : "https://api.rootnameservice.com"
  
      const callbackUrl = baseUrl + "/auth/twitter"
      const token = await this.authService.requestTwitterAccessToken(code, state, callbackUrl);
  
      response.cookie('accessToken', token.token.access_token, {
            httpOnly: true,
            domain: process.env.APP_DOMAIN,
            expires: getNHoursAfterDate(new Date(), 2),
      })
      
      return modal ? response.redirect(redirectPath + `?state=${modal}`) : 
        response.redirect(redirectPath);
  
    } catch (e) {
      console.log(e);
      return response.redirect(process.env.APP_ENDPOINT);
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('twitter/token')
  async refreshAccessToken(
    @Query() query: TokenParams,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { state, redirect_uri } = query;

    const token = req['token'];

    /**
     * Note that the Redirect Path should always be defined in the Twitter App
     * See Docs: https://developer.twitter.com/en/docs/apps/overview
     */
    const redirectPath: string = redirect_uri;

    const newToken = await this.authService.requestNewToken(token, state, redirectPath)

    res.cookie('accessToken', newToken.token.access_token, {
      httpOnly: true,
      domain: process.env.APP_DOMAIN,
      expires: getNHoursAfterDate(new Date(), 2),
    })

    return res.json({ isSuccess: true, ...newToken, state });
  }
}