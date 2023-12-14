import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-twitter';
import { TWITTER, TWITTER_APP_ID, TWITTER_APP_SECRET, TWITTER_CALLBACK_URL } from 'src/common/constants/constants';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, TWITTER) {
    constructor(configService: ConfigService) {
        super({
            consumerKey: configService.get<string>(TWITTER_APP_ID),
            consumerSecret: configService.get<string>(TWITTER_APP_SECRET),
            callbackURL: configService.get<string>(TWITTER_CALLBACK_URL),
            // scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
        const { username, displayName, name, emails, photos } = profile;
        const user = {
            email: username,
            displayName: displayName,
            firstName: displayName ? null : name.givenName,
            lastName: displayName ? null : name.familyName,
            picture: photos[0].value,
            accessToken,
            refreshToken // FIXME: REFRESH TOKEN UNDEFINED
        };
        done(null, user);
    }
}