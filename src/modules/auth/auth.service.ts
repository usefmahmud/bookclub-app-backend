import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../database/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { HashingService } from '../../common/services/hashing.service';
import { RegistrationDto } from './dto/registration.dto';
import { JwtService, TokenPayload } from '../../common/services/jwt.service';
import { CurrentUserDto, mapToCurrentUser } from './dto/current-user.dto';
import { Request, Response } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.userModel.findOne({
      email: loginDto.email,
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordMatch = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.getToken(tokenPayload);
    const refreshToken = this.jwtService.getToken(tokenPayload, 'refresh');

    this.setRefreshTokenCookie(refreshToken, res);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        accessToken,
      },
    };
  }

  async register(registrationDto: RegistrationDto) {
    const existingUser = await this.userModel.findOne({
      email: registrationDto.email,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashingService.hash(
      registrationDto.password,
    );

    try {
      const user = await new this.userModel({
        ...registrationDto,
        password: hashedPassword,
      }).save();

      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      };
    } catch {
      throw new BadRequestException('User registration failed');
    }
  }

  async logout(res: Response) {
    try {
      res.clearCookie('refreshToken');
      return { message: 'Logout successful' };
    } catch {
      throw new BadRequestException('Logout failed');
    }
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException('Refresh token not found');
    }

    try {
      const tokenPayload = this.jwtService.verifyToken(refreshToken);

      const user = await this.userModel.findById(tokenPayload.id);

      if (!user) {
        await this.logout(res);
        throw new BadRequestException('User not found');
      }

      this.setRefreshTokenCookie(
        this.jwtService.getToken(tokenPayload, 'refresh'),
        res,
      );

      const accessToken = this.jwtService.getToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          accessToken,
        },
      };
    } catch {
      throw new BadRequestException('Refresh token invalid');
    }
  }

  async getCurrentUser(userId: string): Promise<CurrentUserDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    console.log(user.toJSON());
    return mapToCurrentUser(user);
  }

  async updateProfile(userId: string, UpdateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      user.set(UpdateProfileDto);
      await user.save();

      return {
        message: 'User updated successfully',
      };
    } catch {
      throw new BadRequestException('User update failed');
    }
  }

  async updateUsername(userId: string, username: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existingUser = await this.userModel.findOne({ username });

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    try {
      user.username = username;
      await user.save();

      return {
        message: 'Username updated successfully',
      };
    } catch {
      throw new BadRequestException('Username update failed');
    }
  }

  private async setRefreshTokenCookie(refreshToken: string, res: Response) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }
}
