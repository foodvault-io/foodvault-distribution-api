import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.signInLocally(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}