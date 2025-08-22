import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Put,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthService } from './auth.service';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginResponseSchema } from './dto/login-response.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
}

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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseSchema> {
    const result = await this.authService.login(loginDto);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove refreshToken from response body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, ...responseWithoutRefreshToken } = result;
    return responseWithoutRefreshToken as LoginResponseSchema;
  }

  @Post('/register')
  async register(@Body() registrationDto: RegistrationDto) {
    return await this.authService.register(registrationDto);
  }

  @Post('/refresh-token')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.authService.refreshToken(refreshToken);

    // Set new refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove refreshToken from response body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken: newRefreshToken, ...responseWithoutRefreshToken } =
      result;
    return responseWithoutRefreshToken;
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Current user information' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Req() req: AuthenticatedRequest) {
    return await this.authService.getCurrentUser(req.user.id);
  }

  @Put('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.authService.updateCurrentUser(
      req.user.id,
      updateProfileDto,
    );
  }
}
