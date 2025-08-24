import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, example: 'I am a software engineer' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false, example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({
    required: false,
    example: 'male',
    enum: ['male', 'female', 'other'],
  })
  @IsOptional()
  @IsString()
  @Matches(/^(male|female|other)$/)
  gender?: string;
}
