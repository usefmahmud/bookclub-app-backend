import { Body, Controller, Get, HttpCode, Patch, Post, Put, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseSchema } from './dto/login-response.schema';
import { Public } from '../../common/decorators';
import { GetCurrentUserId } from 'src/common/decorators/current-user.decorator';
import { CurrentUserDto } from './dto/current-user.dto';
import { Response } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseSchema> {
    return await this.authService.login(loginDto, res);
  }

  @Public()
  @Post('/register')
  async register(@Body() registrationDto: RegistrationDto) {
    return await this.authService.register(registrationDto);
  }

  @Public()
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res);
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

  @Patch('/me')
  async updateProfile(
    @GetCurrentUserId() userId: string,
    @Body() UpdateProfileDto: UpdateProfileDto,
  ) {
    return await this.authService.updateProfile(userId, UpdateProfileDto);
  }

  @Put('/username')
  async updateUsername(
    @GetCurrentUserId() userId: string,
    @Body('username') username: string,
  ) {
    return await this.authService.updateUsername(userId, username);
  }
}
