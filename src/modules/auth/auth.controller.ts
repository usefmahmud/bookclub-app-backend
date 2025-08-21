import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { AuthService } from './auth.service';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseSchema } from './dto/login-response.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Login success',
    type: LoginResponseSchema,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseSchema> {
    return await this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registrationDto: RegistrationDto) {
    return {
      message: 'Registration successful',
    };
  }
}
