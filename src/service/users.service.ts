import { Injectable } from '@nestjs/common';
import { Client } from 'twitter-api-sdk';
import { TwitterResponse, findUserById } from 'twitter-api-sdk/dist/types';

@Injectable()
export class UserService {
    async requestCurrentUser(token: string): Promise<TwitterResponse<findUserById>> {
        const user = await new Client(token).users.findMyUser()
        return user
    }
}
