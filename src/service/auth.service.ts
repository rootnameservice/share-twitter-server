import { Injectable } from '@nestjs/common';
import { Client, auth } from 'twitter-api-sdk';

interface GetTokenResponse{
    refresh_token?: string;
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    scope?: string;
}

interface Token extends Omit<GetTokenResponse, 'expires_in'> {
    expires_at?: number;
}

@Injectable()
export class AuthService {
  async requestTwitterAccessToken(
    code: string,
    state: string,
    path: string,
) : Promise<{token: Token}>  {
    const authClient = new auth.OAuth2User({
        client_id: process.env.CLIENT_ID as string,
        client_secret: process.env.CLIENT_SECRET as string,
        callback: "http://127.0.0.1:3001/auth/twitter" + "?path=" + encodeURIComponent(path),
        scopes: ["tweet.read", "tweet.write", "users.read"],
    });

    // require to set private code_verifier field
    await authClient.generateAuthURL({
        state,
        code_challenge: "challenge",
        code_challenge_method: "plain"
    });

    const token = await authClient.requestAccessToken(code);
    return token;
  }
}
