import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiHeader, ApiBadRequestResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth/local-auth.guard';
import { JwtResponseDto } from '../dto/jwt-response.dto';

@ApiTags('Passport')
@ApiHeader({ name: 'x-api-key', description: 'API key that must be provided to access this API' })
@Controller('auth/passport')
export class PassportController {
    @ApiOperation({ summary: 'Endpoint that allow users to log in (throught Passport local strategy, returns JWT).', operationId: 'passport-local-sign-in' })
    @ApiOkResponse({ description: 'User signed in successfully', type: JwtResponseDto })
    @ApiBadRequestResponse({ description: 'Incorrect user or password / User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    passportLocalSignIn(@Request() req) {
        return req.user;
    }

    @ApiOperation({ summary: 'Endpoint that allow the validation of the access token (throught Passport).', operationId: 'passport-verify-token' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Token verified successfully' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('jwt/verify')
    verifyPassportToken(@Request() req) {
        return req.user;
    }
}
