import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV}`,
});
const configService = new ConfigService();

let typeOrmOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  port: 3306,
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  logging: configService.get<string>('NODE_ENV') === 'local',
  synchronize: configService.get<string>('NODE_ENV') === 'local',
};

if (configService.get<string>('NODE_ENV') === 'local') {
  typeOrmOptions = {
    ...typeOrmOptions,
    host: configService.get<string>('DB_HOST')
  };
} else {
  typeOrmOptions = {
    ...typeOrmOptions,
    socketPath: configService.get<string>('DB_SOCKET_PATH')
  };
}

export const typeOrmOptionsSecurity: TypeOrmModuleOptions = {
  ...typeOrmOptions,
  name: 'security',
  database: configService.get<string>('DB_SECURITY_NAME'),
  entities: [User],
};
