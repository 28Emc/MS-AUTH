import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmOptionsSecurity } from '../../../config/database/mysql/mysql.config';
import { SECURITY } from '../../../common/constants/constants';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: SECURITY,
            useFactory: () => (typeOrmOptionsSecurity),
            dataSourceFactory: async (options: DataSourceOptions) => {
                const dataSource = await new DataSource(options).initialize();
                return dataSource;
            },
        }),
    ],
    exports: [TypeOrmModule],
    controllers: [],
    providers: [],
})
export class MysqlModule { }
