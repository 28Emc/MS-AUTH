import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { FACEBOOK, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_CALLBACK_URL, FACEBOOK_STRATEGY_PROFILE_FIELDS, FACEBOOK_STRATEGY_SCOPE } from 'src/common/constants/constants';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, FACEBOOK) {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>(FACEBOOK_APP_ID),
            clientSecret: configService.get<string>(FACEBOOK_APP_SECRET),
            callbackURL: configService.get<string>(FACEBOOK_CALLBACK_URL),
            scope: FACEBOOK_STRATEGY_SCOPE,
            profileFields: FACEBOOK_STRATEGY_PROFILE_FIELDS,
            //display: 'popup',
            //authType: 'reauthenticate',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
        const { displayName, name, emails, photos } = profile;
        const user = {
            email: emails ? emails[0].value : '',
            displayName: displayName,
            firstName: displayName ? null : name.givenName,
            lastName: displayName ? null : name.familyName,
            picture: photos ? photos[0].value : '',
            accessToken,
            refreshToken
        };
        done(null, user);
    }
}