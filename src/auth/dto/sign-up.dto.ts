import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignUpDto {
    @ApiProperty({ description: 'Username', example: 'admin' })
    @IsNotEmpty({ message: 'Username must be present' })
    @IsString({ message: 'Username must be a text' })
    username: string;

    @ApiProperty({ description: 'Password', example: '123456' })
    @IsNotEmpty({ message: 'Password must be present' })
    @IsString({ message: 'Password must be a text' })
    password: string;

    @ApiProperty({ description: 'Photo', example: 'https://picsum.photos/200', required: false })
    @IsOptional()
    @IsString({ message: 'Photo must be a string' })
    picture: string;

    @ApiProperty({ description: 'First name', example: 'John', required: false })
    @IsOptional()
    @IsString({ message: 'First name must be a string' })
    firstName: string;

    @ApiProperty({ description: 'Last name', example: 'Doe', required: false })
    @IsOptional()
    @IsString({ message: 'Last name must be a string' })
    lastName: string;
}
