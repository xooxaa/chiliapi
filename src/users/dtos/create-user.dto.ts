import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}

// IsStronPassword default parameters
// minLength: 12,
// minLowercase: 2,
// minUppercase: 2,
// minNumbers: 2,
// minSymbols: 2,