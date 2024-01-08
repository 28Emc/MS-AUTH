import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SECURITY } from '../../common/constants/constants';

@Module({
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User], SECURITY)
  ],
  exports: [
    TypeOrmModule,
    UserService
  ],
})
export class UserModule { }
