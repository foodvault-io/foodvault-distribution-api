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


@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    // Local SignUp
    @Public()
    @Post('/local/signup')
    async signUpLocally(@Body() signUpDto: LocalAuthDto): Promise<Tokens> {
        return await this.authService.signUpLocally(signUpDto);
    }

    // Local Login
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/local/login')
    signInLocally(
        @UserFromOAuth() tokens: Tokens
    ) {
        return tokens;
    }

    // Google Controllers
    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google')
    async googleAuth() { 
        console.log('Google Auth Route Initiated')
    }

    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google/callback')
    async googleAuthCallback(
        @UserFromOAuth() user: OAuthUser,
    ) {
        return await this.authService.socialLogin(user);
    }

    // Facebook Controllers
    @Public()
    @UseGuards(FacebookAuthGuard)
    @Get('/facebook')
    async facebookAuth() {
        console.log('Facebook Auth Route Initiated')
    }

    @Public()
    @UseGuards(FacebookAuthGuard)
    @Get('/facebook/callback')
    async facebookAuthCallback(
        @UserFromOAuth() user: OAuthUser,
    ) {
        return await this.authService.socialLogin(user);
    }

    // LinkedIn Controllers
    @Public()
    @UseGuards(LinkedInAuthGuard)
    @Get('/linkedin')
    async linkedInAuth() {
        console.log('LinkedIn Auth Route Initiated')
    }

    @Public()
    @UseGuards(LinkedInAuthGuard)
    @Get('/linkedin/callback')
    async linkedInAuthCallback(
        @UserFromOAuth() user: OAuthUser,
    ) {
        return await this.authService.socialLogin(user);
    }

    // Logout Route
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    logout(@GetCurrentUserId() userId: string) {
        return this.authService.localLogout(userId);
    }

    // Refresh Token
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
