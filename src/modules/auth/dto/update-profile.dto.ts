import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsIn,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false, description: 'First name of the user' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({ required: false, description: 'Last name of the user' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({ required: false, description: 'Username of the user' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  username?: string;

  @ApiProperty({ required: false, description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({ required: false, description: 'Avatar URL of the user' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    required: false,
    description: 'Date of birth',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiProperty({
    required: false,
    description: 'Gender',
    enum: ['male', 'female', 'other'],
  })
  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: string;
}
