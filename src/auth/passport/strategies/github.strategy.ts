import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('GITHUB_APP_ID'),
            clientSecret: configService.get<string>('GITHUB_APP_SECRET'),
            callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
            scope: ['user:email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
        console.log('github profile', profile)
        const { name, displayName, username, emails, photos } = profile;
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