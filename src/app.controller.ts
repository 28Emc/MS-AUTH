import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('App')
@ApiHeader({ name: 'x-api-key', description: 'Api key required to use this api' })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ summary: 'Endpoint that gives information about API status.', operationId: 'ping-server' })
  @ApiOkResponse({ description: 'The server is online', type: String })
  @ApiUnauthorizedResponse({ description: 'Api key not found' })
  @HttpCode(HttpStatus.OK)
  @Get()
  pingToServer(): string {
    return this.appService.pingToServer();
  }
}
