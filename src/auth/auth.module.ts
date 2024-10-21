/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './services/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/token.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/role.entity';
import { Permission } from 'src/users/entities/permission.entity';
import { ApplicationsModule } from 'src/applications/applications.module';
import { FinancialModule } from 'src/financial/financial.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  imports: [
    UsersModule,
    forwardRef(() => ApplicationsModule),
    TypeOrmModule.forFeature([User, RefreshToken, Permission, Role]),
  ],
})
export class AuthModule {}
