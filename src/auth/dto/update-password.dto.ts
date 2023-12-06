import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({ description: 'Current password', example: '123456' })
    @IsNotEmpty({ message: 'password must be present' })
    @IsString({ message: 'password must be a text' })
    currentPassword: string;

    @ApiProperty({ description: 'New password', example: '654321' })
    @IsNotEmpty({ message: 'password must be present' })
    @IsString({ message: 'password must be a text' })
    newPassword: string;
}

