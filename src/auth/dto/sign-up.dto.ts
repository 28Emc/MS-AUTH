import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @ApiProperty({ description: 'Username', example: 'admin' })
    @IsNotEmpty({ message: 'Username must be present' })
    @IsString({ message: 'Username must be a text' })
    username: string;

    @ApiProperty({ description: 'Password', example: '123456' })
    @IsNotEmpty({ message: 'Password must be present' })
    @IsString({ message: 'Password must be a text' })
    password: string;
}
