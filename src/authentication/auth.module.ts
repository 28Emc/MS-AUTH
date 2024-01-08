import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../models/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JWTStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshJWTStrategy } from './strategies/refresh-jwt.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { TwitterStrategy } from './strategies/twitter.strategy';
import { ENV_FILE_PATH, JWT_SECRET, TOKEN_EXPIRES_IN } from '../common/constants/constants';

ConfigModule.forRoot({
  envFilePath: ENV_FILE_PATH,
});

const configService = new ConfigService();

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: configService.get<string>(JWT_SECRET),
      signOptions: { expiresIn: configService.get<string>(TOKEN_EXPIRES_IN) },
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
  ],
  controllers: [AuthController]
})
export class AuthModule { }
