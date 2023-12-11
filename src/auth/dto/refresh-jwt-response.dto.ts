import { ApiProperty } from "@nestjs/swagger";

export class RefreshJwtResponseDto {
    @ApiProperty({ description: 'Refresh token', example: '$fake$refresh$token$' })
    refresh_token: string;
}
