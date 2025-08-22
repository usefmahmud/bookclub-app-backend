import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseSchema } from './dto/login-response.schema';
import { Public } from '../../common/decorators';
import { GetCurrentUserId } from 'src/common/decorators/current-user.decorator';
import { CurrentUserDto } from './dto/current-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
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

  @Public()
  @Post('/register')
  async register(@Body() registrationDto: RegistrationDto) {
    return await this.authService.register(registrationDto);
  }

  @Get('/me')
  @ApiResponse({
    status: 200,
    description: 'Login success',
    type: CurrentUserDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async getCurrentUser(
    @GetCurrentUserId() userId: string,
  ): Promise<CurrentUserDto> {
    return await this.authService.getCurrentUser(userId);
  }
}
