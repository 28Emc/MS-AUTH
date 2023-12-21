import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { LoginProviders, UserStatus, getEnumValueByKey } from 'src/common/enums/enums';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.username,
            picture: payload.picture,
            firstName: payload.firstName,
            lastName: payload.lastName,
            status: payload.status,
            statusDsc: getEnumValueByKey(UserStatus, payload.status),
            flgLogin: payload.flgLogin,
            flgLoginDsc: getEnumValueByKey(LoginProviders, payload.flgLogin),
            creationDate: payload.creationDate,
            createdBy: payload.createdBy,
            modifiedDate: payload.modifiedDate,
            modifiedBy: payload.modifiedBy,
        };
    }
}