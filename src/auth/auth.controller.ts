import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestResponse, SuccessResponse } from 'src/common/utils/response';
import configuration from 'src/common/config/configuration';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        try {
            const user = await this.authService.register(dto);
            if (user) {
                dto.password = undefined;
                return SuccessResponse(dto, 'User registered successfully');
            }
        }
        catch (error) {
            if (error.message === 'Password is required') {
                return BadRequestResponse('Password is required');
            }
            return { message: 'Internal server error', error: error.message };
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        try {
            console.log("Login DTO: ", configuration().jwtSecret);
            const user = await this.authService.login(dto);
            if (user) {
                return SuccessResponse(user, 'User logged in successfully');
            }
        }
        catch (error) {
            if (error.message === 'Invalid credentials') {
                return BadRequestResponse('Invalid credentials');
            }
            return { message: 'Internal server error', error: error.message };
        }
    }

    @Post('logout')
    logout() {
        return this.authService.logout();
    }
}
