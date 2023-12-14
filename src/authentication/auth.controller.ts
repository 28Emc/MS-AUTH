import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtTokenGuard } from 'src/common/guards/jwt-token.guard';
import { RefreshJwtResponseDto } from './dto/refresh-jwt-response.dto';
import { RefreshJwtGuard } from 'src/common/guards/refresh-jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { LoginProviders } from 'src/common/enums/enums';

@ApiTags('Auth')
@ApiHeader({ name: 'x-api-key', description: 'API key that must be provided to access this API' })
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Endpoint that allow users to log in (Passport local strategy, returns JWT).', operationId: 'passport-local-sign-in' })
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

    @ApiOperation({ summary: 'Endpoint that allow users to log in (Passport google strategy, returns JWT).', operationId: 'passport-google-sign-in' })
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

    @ApiOperation({ summary: 'Endpoint that allow users to log in (Passport facebook strategy, returns JWT).', operationId: 'passport-facebook-sign-in' })
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

    @ApiOperation({ summary: 'Endpoint that allow users to log in (Passport github strategy, returns JWT).', operationId: 'passport-github-sign-in' })
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

    @ApiOperation({ summary: 'Endpoint that allow users to log in (Passport twitter strategy, returns JWT).', operationId: 'passport-twitter-sign-in' })
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

    @ApiOperation({ summary: 'Endpoint that allow users to sign up (returns JWT).', operationId: 'jwt-sign-up' })
    @ApiCreatedResponse({ description: 'User signed up successfully', type: JwtResponseDto })
    @ApiBadRequestResponse({ description: 'User already exists' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.CREATED)
    @Post('sign-up')
    signUpJWT(@Body() signUpDto: SignUpDto) {
        return this.authService.signUpJWT(signUpDto);
    }

    @ApiOperation({ summary: 'Endpoint that redirect users after log in (throught Passport google strategy).', operationId: 'passport-google-redirect' })
    @ApiOkResponse({ description: 'User redirected successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('google'))
    @Public()
    @Get('google/redirect')
    passportGoogleRedirect(@Request() req) {
        return this.authService.loginRedirect(req, LoginProviders.GOOGLE);
    }

    @ApiOperation({ summary: 'Endpoint that redirect users after log in (throught Passport facebook strategy).', operationId: 'passport-facebook-redirect' })
    @ApiOkResponse({ description: 'User redirected successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('facebook'))
    @Public()
    @Get('facebook/redirect')
    passportFacebookRedirect(@Request() req) {
        return this.authService.loginRedirect(req, LoginProviders.FACEBOOK);
    }

    @ApiOperation({ summary: 'Endpoint that redirect users after log in (throught Passport github strategy).', operationId: 'passport-github-redirect' })
    @ApiOkResponse({ description: 'User redirected successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('github'))
    @Public()
    @Get('github/redirect')
    passportGithubRedirect(@Request() req) {
        return this.authService.loginRedirect(req, LoginProviders.GITHUB);
    }

    @ApiOperation({ summary: 'Endpoint that redirect users after log in (throught Passport twitter strategy).', operationId: 'passport-twitter-redirect' })
    @ApiOkResponse({ description: 'User redirected successfully' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('twitter'))
    @Public()
    @Get('twitter/redirect')
    passportTwitterRedirect(@Request() req) {
        return this.authService.loginRedirect(req, LoginProviders.TWITTER);
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

    @ApiOperation({ summary: 'Endpoint that allow profile data modification.', operationId: 'put-profile' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Profile updated successfully', type: AuthResponseDto })
    @ApiBadRequestResponse({ description: 'User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @UseGuards(JwtTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Put('profile')
    putProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.authService.updateProfile(req, updateProfileDto);
    }

    @ApiOperation({ summary: 'Endpoint that allow password modification.', operationId: 'put-password' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Password changed successfully', type: AuthResponseDto })
    @ApiBadRequestResponse({ description: 'User account was suspended / Passwords not match' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @UseGuards(JwtTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Put('password')
    putPassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
        return this.authService.updatePassword(req, updatePasswordDto);
    }

    @ApiOperation({ summary: 'Endpoint that allow profile data soft deletion.', operationId: 'soft-delete-profile' })
    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'Profile blocked successfully', type: AuthResponseDto })
    @ApiBadRequestResponse({ description: 'User account was already suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @UseGuards(JwtTokenGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('profile')
    deleteProfile(@Request() req) {
        return this.authService.deleteProfile(req);
    }

    @ApiOperation({ summary: 'Endpoint that refresh JWT (returns JWT).', operationId: 'refresh-jwt' })
    @ApiOkResponse({ description: 'JWT refresh done successfully', type: RefreshJwtResponseDto })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @UseGuards(RefreshJwtGuard)
    @HttpCode(HttpStatus.OK)
    @Post('jwt/refresh')
    refreshJWT(@Request() req) {
        return this.authService.refreshJWT(req);
    }
}
