import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DB_HOST, DB_PASSWORD, DB_SECURITY_NAME, DB_SOCKET_PATH, DB_USER, ENV_FILE_PATH, LOCAL, MYSQL, NODE_ENV, SECURITY } from '../../../common/constants/constants';
import { User } from '../../../models/user/entities/user.entity';

ConfigModule.forRoot({
  envFilePath: ENV_FILE_PATH,
});
const configService = new ConfigService();

let typeOrmOptions: TypeOrmModuleOptions = {
  type: MYSQL,
  port: 3306,
  username: configService.get<string>(DB_USER),
  password: configService.get<string>(DB_PASSWORD),
  logging: configService.get<string>(NODE_ENV) === LOCAL,
  synchronize: configService.get<string>(NODE_ENV) === LOCAL,
};

if (configService.get<string>(NODE_ENV) === LOCAL) {
  typeOrmOptions = {
    ...typeOrmOptions,
    host: configService.get<string>(DB_HOST)
  };
} else {
  typeOrmOptions = {
    ...typeOrmOptions,
    socketPath: configService.get<string>(DB_SOCKET_PATH)
  };
}

export const typeOrmOptionsSecurity: TypeOrmModuleOptions = {
  ...typeOrmOptions,
  name: SECURITY,
  database: configService.get<string>(DB_SECURITY_NAME),
  entities: [User],
};
