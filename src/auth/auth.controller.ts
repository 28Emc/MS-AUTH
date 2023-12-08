import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtTokenGuard } from 'src/guards/jwt-token.guard';

@ApiTags('Auth')
@ApiHeader({ name: 'x-api-key', description: 'API key that must be provided to access this API' })
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Endpoint that allow users to log in.', operationId: 'sign-in' })
    @ApiOkResponse({ description: 'User signed in successfully', type: JwtResponseDto })
    @ApiBadRequestResponse({ description: 'Incorrect user or password / User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() loginDto: LoginDto) {
        return this.authService.signIn(loginDto);
    }

    @ApiOperation({ summary: 'Endpoint that allow users to log in (returns JWT).', operationId: 'jwt-sign-in' })
    @ApiOkResponse({ description: 'User signed in successfully', type: JwtResponseDto })
    @ApiBadRequestResponse({ description: 'Incorrect user or password / User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.OK)
    @Post('login/jwt')
    signInJWT(@Body() loginDto: LoginDto) {
        return this.authService.signInJWT(loginDto);
    }

    @ApiOperation({ summary: 'Endpoint that allow users to sign up.', operationId: 'sign-up' })
    @ApiCreatedResponse({ description: 'User signed up successfully', type: JwtResponseDto })
    @ApiBadRequestResponse({ description: 'User already exists' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.CREATED)
    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @ApiOperation({ summary: 'Endpoint that allow users to sign up (returns JWT).', operationId: 'jwt-sign-up' })
    @ApiCreatedResponse({ description: 'User signed up successfully', type: JwtResponseDto })
    @ApiBadRequestResponse({ description: 'User already exists' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @HttpCode(HttpStatus.CREATED)
    @Post('sign-up/jwt')
    signUpJWT(@Body() signUpDto: SignUpDto) {
        return this.authService.signUpJWT(signUpDto);
    }

    @ApiOperation({ summary: 'Endpoint that allow retrieving profile data.', operationId: 'get-profile' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Profile retrieved successfully', type: AuthResponseDto })
    @ApiBadRequestResponse({ description: 'User account was suspended' })
    @ApiUnauthorizedResponse({ description: 'Api key not found' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @UseGuards(JwtTokenGuard)
    @HttpCode(HttpStatus.OK)
    @Get('profile')
    getProfile(@Request() req) {
        return this.authService.getProfile(req);
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
}
