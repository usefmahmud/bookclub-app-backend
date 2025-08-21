import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';

@Controller('auth')
export class AuthController {
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return {
      message: 'Login successful',
    };
  }

  @Post('/register')
  register(@Body() registrationDto: RegistrationDto) {
    return {
      message: 'Registration successful',
    };
  }
}
