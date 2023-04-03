import {
    Body,
    Controller,
    Post,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthDto } from './dto';
import { Login, SignUp, OpenAuthUser, Token } from './entities';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { OAuthUser, Tokens } from './types';
import {
    RtJwtGuard,
    LocalAuthGuard,
    GoogleAuthGuard,
    FacebookAuthGuard,
    LinkedInAuthGuard
} from '../common/guards';
import {
    GetCurrentUser,
    GetCurrentUserId,
    Public,
    UserFromOAuth
} from '../common/decorators';


@ApiTags('Auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    logger: Logger;

    constructor(
        private readonly authService: AuthService,
    ) { 
        this.logger = new Logger(AuthController.name);
    }

    // Local SignUp
    @ApiOperation({ summary: 'Create User Using the Local Strategy' })
    @ApiResponse({
        status: 201,
        description: 'New User Created',
        type: SignUp,
    })
    @Public()
    @Post('/local/signup')
    async signUpLocally(@Body() signUpDto: LocalAuthDto): Promise<Tokens> {
        return await this.authService.signUpLocally(signUpDto);
    }

    // Local Login
    @ApiOperation({ summary: 'Sign In Using the Local Strategy' })
    @ApiResponse({
        status: 201,
        description: 'User Signed In',
        type: Login,
    })
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/local/login')
    signInLocally(
        @UserFromOAuth() tokens: Tokens
    ) {
        return tokens;
    }

    // Google Controllers
    @ApiOperation({ summary: 'Sign In / Sign Up Route for Google' })
    @ApiResponse({
        status: 200,
        description: 'User Signed In / Signed Up With Google Strategy',
    })
    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google')
    async googleAuth() {
        this.logger.warn('Google Auth Route Initiated')
    }

    @ApiOperation({ summary: 'Google Strategy Callback Route' })
    @ApiResponse({
        status: 200,
        description: 'Return Data From Google Strategy',
        type: OpenAuthUser,
    })
    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google/callback')
    async googleAuthCallback(
        @UserFromOAuth() user: OAuthUser,
    ) {
        return await this.authService.socialLogin(user);
    }

    // Facebook Controllers
    @ApiOperation({ summary: 'Sign In / Sign Up Route for Facebook' })
    @ApiResponse({
        status: 200,
        description: 'User Signed In / Signed Up With Facebook Strategy',
    })
    @Public()
    @UseGuards(FacebookAuthGuard)
    @Get('/facebook')
    async facebookAuth() {
        this.logger.warn('Facebook Auth Route Initiated')
    }

    @ApiOperation({ summary: 'Facebook Strategy Callback Route' })
    @ApiResponse({
        status: 200,
        description: 'Return Data From Facebook Strategy',
        type: OpenAuthUser,
    })
    @Public()
    @UseGuards(FacebookAuthGuard)
    @Get('/facebook/callback')
    async facebookAuthCallback(
        @UserFromOAuth() user: OAuthUser,
    ) {
        return await this.authService.socialLogin(user);
    }

    // LinkedIn Controllers
    @ApiOperation({ summary: 'Sign In / Sign Up Route for LinkedIn' })
    @ApiResponse({
        status: 200,
        description: 'User Signed In / Signed Up With LinkedIn Strategy',
    })
    @Public()
    @UseGuards(LinkedInAuthGuard)
    @Get('/linkedin')
    async linkedInAuth() {
        this.logger.warn('LinkedIn Auth Route Initiated')
    }

    @ApiOperation({ summary: 'LinkedIn Strategy Callback Route' })
    @ApiResponse({
        status: 200,
        description: 'Return Data From LinkedIn Strategy',
        type: OpenAuthUser,
    })
    @Public()
    @UseGuards(LinkedInAuthGuard)
    @Get('/linkedin/callback')
    async linkedInAuthCallback(
        @UserFromOAuth() user: OAuthUser,
    ) {
        return await this.authService.socialLogin(user);
    }

    // Logout Route
    @ApiOperation({ summary: 'Logout Route.  This erases Refresh Token Hash from account table' })
    @ApiResponse({
        status: 200,
        description: 'User Logged Out',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    logout(@GetCurrentUserId() userId: string) {
        return this.authService.localLogout(userId);
    }

    // Refresh Token
    @ApiOperation({ summary: 'Refresh Access Token Route' })
    @ApiResponse({
        status: 200,
        description: 'Access Token Refreshed',
        type: Token,
    })
    @Public()
    @UseGuards(RtJwtGuard)
    @Post('/refresh')
    refreshToken(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string
    ) {
        return this.authService.refreshToken(userId, refreshToken)
    }
}
