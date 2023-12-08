import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV}`,
});

const configService = new ConfigService();

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const token: string = this.extractAPIKeyFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Api key not found');
    }
    if (token !== configService.get<string>('API_KEY')) {
      throw new UnauthorizedException('Invalid api key');
    }
    return true;
  }

  extractAPIKeyFromHeader(request: Request): string | undefined {
    return request.headers['x-api-key'] as string ?? undefined;
  }
}
