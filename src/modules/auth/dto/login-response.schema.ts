import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class LoginResponseSchema {
  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'User unique identifier',
      },
      fullName: {
        type: 'string',
        example: 'Yousef Mahmoud',
        description: 'User full name',
      },
      email: {
        type: 'string',
        example: 'user@example.com',
        description: 'User email address',
      },
      role: {
        type: 'string',
        enum: Object.values(Role),
        example: Role.USER,
        description: 'User role',
      },
      accessToken: {
        type: 'string',
      },
    },
  })
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    accessToken: string;
  };
}
