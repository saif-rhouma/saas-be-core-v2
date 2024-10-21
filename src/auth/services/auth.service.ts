/* eslint-disable prettier/prettier */
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../services/token.service';
import { hashPassword } from 'src/common/helpers/hash-password.func';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { RoleType } from 'src/common/constants/roles';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserTokenDto } from 'src/users/dtos/user-token.dto';
import { Logger } from 'winston';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async signup(userData) {
    const users = await this.usersService.find(userData.email);
    if (users.length) {
      // throw Exception !!!
      throw new BadRequestException(MSG_EXCEPTION.OTHER_ALREADY_IN_USE_EMAIL);
    }
    // Hash the users password
    const result = await hashPassword(userData.password);
    delete userData.password;
    // Create a new user and save it
    const user = await this.usersService.createUser({
      ...userData,
      password: result,
      role: RoleType.USER,
    });
    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new UnauthorizedException(MSG_EXCEPTION.OTHER_BAD_PASSWORD);
    }
    // Serialize User For Token
    const userPlain = instanceToPlain(user);
    const userToken = plainToInstance(UserTokenDto, userPlain, { excludeExtraneousValues: true });
    const { accessToken, refreshToken } = await this.generateUserTokens(userToken);
    await this.storeRefreshToken(refreshToken, user);
    await this.usersService.updateLastLogin(user.id);
    return { ...user, accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    return this.tokenService.remove(refreshToken);
  }

  async generateUserTokens(user) {
    delete user.password;
    const accessToken = this.jwtService.sign({ user }, { expiresIn: '3d' });
    const refreshToken = this.jwtService.sign({ user }, { secret: this.config.get<string>('REFRESH_TOKEN_SECRET') });
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    if (refreshToken == null) {
      throw new UnauthorizedException();
    }
    const token = await this.tokenService.findOne(refreshToken);

    if (!token) {
      throw new UnauthorizedException();
    }
    const { user } = await this.jwtService.verify(refreshToken, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
    });

    const { accessToken } = await this.generateUserTokens(user);
    return { accessToken };
  }

  async storeRefreshToken(refreshToken, user) {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 3);
      this.tokenService.create(refreshToken, user, expiryDate);
    } catch (error) {}
  }
}
