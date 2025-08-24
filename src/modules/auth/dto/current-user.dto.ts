import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';
import { User } from '../../../database/schemas/user.schema';

export class CurrentUserDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'Yousef',
    description: 'User first name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Mahmoud',
    description: 'User last name',
  })
  lastName: string;

  @ApiProperty({
    example: 'Yousef Mahmoud',
    description: 'User full name',
  })
  fullName: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'User role',
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    example: 'I am a software engineer',
    description: 'User bio',
  })
  bio: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
  })
  avatar: string;

  @ApiProperty({
    example: 20,
    description: 'User age',
  })
  age: number | null;

  @ApiProperty({
    example: 'male',
    description: 'User gender',
    enum: ['male', 'female', 'other'],
  })
  gender: string;
}

export const mapToCurrentUser = (user: User): CurrentUserDto => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    bio: user.bio,
    avatar: user.avatar,
    age: user.age,
    gender: user.gender,
  };
};
