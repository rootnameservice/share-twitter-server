import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/users.controller';
import { UserService } from 'src/service/users.service';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
