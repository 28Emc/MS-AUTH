import { ApiProperty } from "@nestjs/swagger";
import { UserStatus } from "src/user/entities/user.entity";

export class AuthResponseDto {
    @ApiProperty({ description: 'User Id', example: 1 })
    userId: number;

    @ApiProperty({ description: 'Username', example: 'admin' })
    username: string;

    @ApiProperty({ description: 'User status', example: 'A', enum: UserStatus })
    status: UserStatus;
}
