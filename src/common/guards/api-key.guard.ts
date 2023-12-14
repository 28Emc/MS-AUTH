import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { API_KEY, ENV_FILE_PATH, IS_PUBLIC, X_API_KEY } from '../constants/constants';

ConfigModule.forRoot({
  envFilePath: ENV_FILE_PATH,
});

const configService = new ConfigService();

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.get<boolean>(IS_PUBLIC, context.getHandler());
    if (isPublic) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const token: string = this.extractAPIKeyFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Api key not found');
    }
    if (token !== configService.get<string>(API_KEY)) {
      throw new UnauthorizedException('Invalid api key');
    }
    return true;
  }

  extractAPIKeyFromHeader(request: Request): string | undefined {
    return request.headers[X_API_KEY] as string ?? undefined;
  }
}
