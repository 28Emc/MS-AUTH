import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiHeader, ApiBadRequestResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth/local-auth.guard';
import { JwtResponseDto } from '../dto/jwt-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { PassportService } from './passport.service';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Passport')
// @ApiHeader({ name: 'x-api-key', description: 'API key that must be provided to access this API' })
@Controller('auth/passport')
export class PassportController {
    constructor(private passportService: PassportService) { }

    @ApiOperation({ summary: 'Endpoint that allow users to log in (throught Passport local strategy, returns JWT).', operationId: 'passport-local-sign-in' })
    @ApiOkResponse({ description: 'User signed in successfully', type: JwtResponseDto })
    @ApiBadRequestResponse({ description: 'Incorrect user or password / User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @ApiHeader({ name: 'x-api-key', description: 'API key that must be provided to access this API' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    passportLocalSignIn(@Request() req) {
        return req.user;
    }

    @ApiOperation({ summary: 'Endpoint that allow users to log in (throught Passport google strategy, returns JWT).', operationId: 'passport-google-sign-in' })
    @ApiOkResponse({ description: 'User signed in successfully' })
    @ApiBadRequestResponse({ description: 'Incorrect user or password / User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('google'))
    @Public()
    @Get('login/google')
    passportGoogleSignIn(@Request() req) {
        return req.user;
    }

    @ApiOperation({ summary: 'Endpoint that redirect users after log in (throught Passport google strategy).', operationId: 'passport-google-callback' })
    @ApiOkResponse({ description: 'User redirected successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('google'))
    @Public()
    @Get('google/callback')
    passportGoogleCallback(@Request() req) {
        return this.passportService.passportGoogleCallback(req);
    }

    @ApiOperation({ summary: 'Endpoint that allow the validation of the access token (throught Passport).', operationId: 'passport-verify-token' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Token verified successfully' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @ApiHeader({ name: 'x-api-key', description: 'API key that must be provided to access this API' })
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('jwt/verify')
    verifyPassportToken(@Request() req) {
        return req.user;
    }
}
