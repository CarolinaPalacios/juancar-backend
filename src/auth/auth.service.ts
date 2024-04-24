import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareHash, generateHash } from './utils/bcrypt.handler';
import { User, UserDocument } from '../users/schema/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userModel.findOne({ email });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isMatch = await compareHash(password, user.password);

    if (!isMatch)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const userFlat = user.toObject();
    delete userFlat.password;

    const payload = {
      id: userFlat._id,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: userFlat,
      token,
    };
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const { password, ...user } = registerAuthDto;

    const existingUser = await this.userModel.findOne({ email: user.email });

    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    const userParsed = {
      ...user,
      password: await generateHash(password),
    };

    const newUser = await this.userModel.create(userParsed);

    return newUser;
  }
}
