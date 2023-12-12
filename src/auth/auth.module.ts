import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/strategies/local.strategy';
import { JWTStrategy } from './passport/strategies/jwt.strategy';
import { PassportController } from './passport/passport.controller';
import { PassportService } from './passport/passport.service';
import { GoogleStrategy } from './passport/strategies/google.strategy';
import { RefreshJWTStrategy } from './passport/strategies/refresh-jwt.strategy';
import { FacebookStrategy } from './passport/strategies/facebook.strategy';
import { GithubStrategy } from './passport/strategies/github.strategy';
import { TwitterStrategy } from './passport/strategies/twitter.strategy';

ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV}`,
});

const configService = new ConfigService();

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: configService.get<string>('TOKEN_EXPIRES_IN') },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JWTStrategy,
    RefreshJWTStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
    TwitterStrategy,
    PassportService
  ],
  controllers: [AuthController, PassportController]
})
export class AuthModule { }
