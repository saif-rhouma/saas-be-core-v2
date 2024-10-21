/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/token.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken) private repo: Repository<RefreshToken>,
  ) {}

  create(refreshToken: string, user: User, expiryDate: Date) {
    const token = this.repo.create({ token: refreshToken, user, expiryDate });
    return this.repo.save(token);
  }

  findOne(refreshToken: string) {
    if (!refreshToken) {
      return null;
    }
    const token = this.repo.findOneBy({ token: refreshToken });
    return token;
  }

  async remove(refreshToken: string) {
    const token = await this.findOne(refreshToken);
    if (!token) {
      throw new NotFoundException('token not found');
    }
    return this.repo.remove(token);
  }
}
