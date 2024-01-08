import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GOOGLE, GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_STRATEGY_SCOPE } from '../../common/constants/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE) {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>(GOOGLE_CLIENT_ID),
            clientSecret: configService.get<string>(GOOGLE_CLIENT_SECRET),
            callbackURL: configService.get<string>(GOOGLE_CALLBACK_URL),
            scope: GOOGLE_STRATEGY_SCOPE,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
        const { displayName, name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
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