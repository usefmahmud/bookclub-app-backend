import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../database/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { HashingService } from '../../common/services/hashing.service';
import { RegistrationDto } from './dto/registration.dto';
import { JwtService } from '../../common/services/jwt.service';
import { CurrentUserDto, mapToCurrentUser } from './dto/current-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
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

    const accessToken = this.jwtService.getToken({
      email: user.email,
      id: user.id,
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

  async getCurrentUser(userId: string): Promise<CurrentUserDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    console.log(user.toJSON());
    return mapToCurrentUser(user);
  }
}
