import { ApiProperty } from "@nestjs/swagger";

export class JwtResponseDto {
    @ApiProperty({ description: 'Access token', example: '$fake$token$' })
    access_token: string;
}
