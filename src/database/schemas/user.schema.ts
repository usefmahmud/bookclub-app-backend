import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, maxlength: 50 })
  firstName: string;

  @Prop({ required: true, trim: true, maxlength: 50 })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  })
  email: string;

  @Prop({
    required: true,
    minlength: 6,
    match: [
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ],
  })
  password: string;

  @Prop({ trim: true, maxlength: 30 })
  username: string;

  @Prop({ trim: true, maxlength: 500 })
  bio: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({
    type: Date,
    validate: {
      validator: function (value: Date) {
        return value < new Date();
      },
      message: 'Date of birth must be in the past',
    },
  })
  dateOfBirth: Date;

  @Prop({
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other',
  })
  gender: string;

  @Prop({
    type: String,
    enum: Role,
    default: 'user',
  })
  role: Role;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get age(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });
UserSchema.index({ fullName: 1 });
UserSchema.index({ createdAt: -1 });
