import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiHeader, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtResponseDto } from '../dto/jwt-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { PassportService } from './passport.service';
import { Public } from 'src/decorators/public.decorator';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

@ApiTags('Passport')
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

    @ApiOperation({ summary: 'Endpoint that allow users to log in (throught Passport facebook strategy, returns JWT).', operationId: 'passport-facebook-sign-in' })
    @ApiOkResponse({ description: 'User signed in successfully' })
    @ApiBadRequestResponse({ description: 'Incorrect user or password / User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('facebook'))
    @Public()
    @Get('login/facebook')
    passportFacebookSignIn(@Request() req) {
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

    @ApiOperation({ summary: 'Endpoint that redirect users after log in (throught Passport facebook strategy).', operationId: 'passport-facebook-callback' })
    @ApiOkResponse({ description: 'User redirected successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('facebook'))
    @Public()
    @Get('facebook/callback')
    passportFacebookCallback(@Request() req) {
        return this.passportService.passportFacebookCallback(req);
    }
}
