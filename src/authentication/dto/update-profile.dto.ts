import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserStatus } from "../../common/enums/enums";

export class UpdateProfileDto {
    @ApiProperty({ description: 'Username', example: 'admin' })
    @IsNotEmpty({ message: 'username must be present' })
    @IsString({ message: 'username must be a text' })
    username: string;

    @ApiProperty({ description: 'User status', example: 'A', enum: UserStatus, required: false })
    @IsOptional()
    @IsEnum(UserStatus, { message: 'status must be A (Active) or I (Inactive)' })
    status: UserStatus;
}

