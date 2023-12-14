import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { BEARER_PREFIX, ENV_FILE_PATH, JWT_SECRET, USER } from '../constants/constants';

ConfigModule.forRoot({
  envFilePath: ENV_FILE_PATH,
});

const configService = new ConfigService();

@Injectable()
export class JwtTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        { secret: configService.get<string>(JWT_SECRET) }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request[USER] = payload;
    } catch {
      throw new UnauthorizedException('The token provided is expired, revoked, malformed, or invalid for other reasons.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === BEARER_PREFIX ? token : undefined;
  }
}
