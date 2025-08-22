import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @ApiProperty({
    format: 'email',
    example: 'user@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Abcd@1234',
    minLength: 8,
    pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
    description:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    required: true,
  })
  @IsString()
  password: string;
}

