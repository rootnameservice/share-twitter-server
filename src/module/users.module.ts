import { Module } from '@nestjs/common';
import { UserController } from '../controller/users.controller';
import { UserService } from '../service/users.service';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
