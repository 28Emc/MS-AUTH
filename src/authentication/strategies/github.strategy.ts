import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-github2';
import { GITHUB, GITHUB_APP_ID, GITHUB_APP_SECRET, GITHUB_CALLBACK_URL, GITHUB_STRATEGY_SCOPE } from '../../common/constants/constants';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, GITHUB) {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>(GITHUB_APP_ID),
            clientSecret: configService.get<string>(GITHUB_APP_SECRET),
            callbackURL: configService.get<string>(GITHUB_CALLBACK_URL),
            scope: GITHUB_STRATEGY_SCOPE,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
        const { name, displayName, username, emails, photos } = profile;
        const user = {
            email: username,
            displayName: displayName,
            firstName: displayName ? null : name.givenName,
            lastName: displayName ? null : name.familyName,
            picture: photos[0].value,
            accessToken,
            refreshToken
        };
        done(null, user);
    }
}