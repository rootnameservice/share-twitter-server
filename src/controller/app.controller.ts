import { Controller, Get, Req, Post, Param, Body, UseGuards, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { Request, Response } from 'express';
import { AuthGuard } from '../gaurd/authGaurd';
import { Client } from 'twitter-api-sdk';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Req() req: Request): string {
    return this.appService.getHello();
  }

  @HttpCode(HttpStatus.OK)
  @Get('tweets/:id')
  @UseGuards(AuthGuard)
  async getTweetsById(
    @Param() param: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const token = req['token']; 

    const client = new Client(token);

    const tweet = await client.tweets.findTweetById(param.id);

    return res.json(tweet);
  }

  @HttpCode(HttpStatus.OK)
  @Post('tweets')
  @UseGuards(AuthGuard)
  async postTweet(
    @Body() payload: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const token = req['token'];

    const client = new Client(token);

    const response = await client.tweets.createTweet(payload.tweet)

    return res.json(response);
  }
}
