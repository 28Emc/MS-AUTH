import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_FILE_PATH, PORT } from './common/constants/constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';

ConfigModule.forRoot({
  envFilePath: ENV_FILE_PATH,
});

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    appService = new AppService(configService);
    appController = new AppController(appService);
  });

  it('shold be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('pingToServer', () => {
    it('it should return a text response indicating the server status', async () => {
      const serviceResult = `MS-AUTH listening on port ${configService.get<string>(PORT)}`;
      jest.spyOn(appService, 'pingToServer').mockImplementation(() => serviceResult);
      expect(appController.pingToServer()).toBe(serviceResult);
    });
  });
});
