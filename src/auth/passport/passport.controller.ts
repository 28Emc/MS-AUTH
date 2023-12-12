import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiHeader, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtResponseDto } from '../dto/jwt-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { PassportService } from './passport.service';
import { Public } from 'src/decorators/public.decorator';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtTokenGuard } from 'src/guards/jwt-token.guard';
import { LoginModes } from 'src/user/entities/user.entity';

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

    @ApiOperation({ summary: 'Endpoint that allow users to log in (throught Passport github strategy, returns JWT).', operationId: 'passport-github-sign-in' })
    @ApiOkResponse({ description: 'User signed in successfully' })
    @ApiBadRequestResponse({ description: 'Incorrect user or password / User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('github'))
    @Public()
    @Get('login/github')
    passportGithubSignIn(@Request() req) {
        return req.user;
    }

    @ApiOperation({ summary: 'Endpoint that allow users to log in (throught Passport twitter strategy, returns JWT).', operationId: 'passport-twhitter-sign-in' })
    @ApiOkResponse({ description: 'User signed in successfully' })
    @ApiBadRequestResponse({ description: 'Incorrect user or password / User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('twitter'))
    @Public()
    @Get('login/twitter')
    passportTwitterSignIn(@Request() req) {
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
        return this.passportService.passportCallback(req, LoginModes.GOOGLE);
    }

    @ApiOperation({ summary: 'Endpoint that redirect users after log in (throught Passport facebook strategy).', operationId: 'passport-facebook-callback' })
    @ApiOkResponse({ description: 'User redirected successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('facebook'))
    @Public()
    @Get('facebook/callback')
    passportFacebookCallback(@Request() req) {
        return this.passportService.passportCallback(req, LoginModes.FACEBOOK);
    }

    @ApiOperation({ summary: 'Endpoint that redirect users after log in (throught Passport github strategy).', operationId: 'passport-github-callback' })
    @ApiOkResponse({ description: 'User redirected successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('github'))
    @Public()
    @Get('github/callback')
    passportGithubCallback(@Request() req) {
        return this.passportService.passportCallback(req, LoginModes.GITHUB);
    }

    @ApiOperation({ summary: 'Endpoint that redirect users after log in (throught Passport twitter strategy).', operationId: 'passport-twhitter-callback' })
    @ApiOkResponse({ description: 'User redirected successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('twitter'))
    @Public()
    @Get('twitter/callback')
    passportTwitterCallback(@Request() req) {
        return this.passportService.passportCallback(req, LoginModes.TWITTER);
    }

    @ApiOperation({ summary: 'Endpoint that allow retrieving profile data throught JWT.', operationId: 'passport-get-profile' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Profile retrieved successfully', type: AuthResponseDto })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @UseGuards(JwtTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
