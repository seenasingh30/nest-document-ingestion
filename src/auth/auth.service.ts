import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        if (!dto.password) {
            throw new UnauthorizedException('Password is required');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const createUserDto = new CreateUserDto();
        createUserDto.firstName = dto.firstName;
        createUserDto.lastName = dto.lastName;
        createUserDto.email = dto.email;
        createUserDto.password = hashedPassword;
        createUserDto.role = Role.Viewer;
        const user = await this.usersService.create(createUserDto);
        if (!user) {
            throw new UnauthorizedException('User registration failed');
        }
        return user;
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!dto.password) {
            throw new UnauthorizedException('Password is required');
        }
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            access_token: this.jwtService.sign(payload),
        };
    }

    logout() {
        return { message: 'Logout is handled client-side by deleting the token' };
    }
}
