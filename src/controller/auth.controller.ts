import { Controller, Req, Res, HttpCode, HttpStatus, Get, Query, Param, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { Response, Request } from 'express';
import { getNHoursAfterDate } from 'src/utils/utils';
import { AuthGuard } from 'src/gaurd/authGaurd';

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
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { code, state, path, error } = query;

    let suffix: string;
    let redirectPath: string;
    if (path == undefined) {
      suffix = "";
      redirectPath = process.env.APP_DOMAIN;
    } else {
      suffix = "?path=" + encodeURIComponent(path);
      redirectPath = process.env.APP_DOMAIN + path;
    }

    const callbackUrl = (request.secure ? "https://" : "http://") + request.headers.host + request.path + suffix


    const token = await this.authService.requestTwitterAccessToken(code, state, callbackUrl);

    response.cookie('accessToken', token.token.access_token, {
          httpOnly: true,
          domain: process.env.APP_DOMAIN,
          expires: getNHoursAfterDate(new Date(), 3),
    })
    
    /** 
     * Store state (twitter data) so the client will be able to know
     * which specific path / modal will the redirect uri open
     */
    response.cookie('state', state, {
        httpOnly: true,
        domain: process.env.APP_DOMAIN,
        expires: getNHoursAfterDate(new Date(), 3),
    })

    return response.redirect(redirectPath);
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

    return res.json({ isSuccess: true, ...newToken, state });
  }
}