import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }

  pingToServer(): string {
    return `MS-AUTH listening on port ${this.configService.get<string>('PORT')}`;
  }
}
