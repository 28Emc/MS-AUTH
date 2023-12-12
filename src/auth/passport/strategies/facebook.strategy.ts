import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('FACEBOOK_APP_ID'),
            clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
            callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
            scope: ['email'],
            profileFields: ['id', 'displayName', 'name', 'email', 'photos'],
            //display: 'popup',
            //authType: 'reauthenticate',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
        console.log('facebook profile', profile)
        const { displayName, name, emails, photos } = profile;
        const user = {
            email: emails ? emails[0].value : '',
            displayName: displayName,
            firstName: displayName ? null : name.givenName,
            lastName: displayName ? null : name.familyName,
            picture: photos ? photos[0].value : '',
            accessToken,
            refreshToken // FIXME: REFRESH TOKEN UNDEFINED
        };
        done(null, user);
    }
}