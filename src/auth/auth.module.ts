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
      signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JWTStrategy
  ],
  controllers: [AuthController, PassportController],
  // exports: [AuthService]
})
export class AuthModule { }
