import { Module } from '@nestjs/common';
import { SeedersService } from './services/seeders.service';
import { SeedersController } from './controllers/seeders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/users/entities/role.entity';
import { Permission } from 'src/users/entities/permission.entity';

@Module({
  providers: [SeedersService],
  controllers: [SeedersController],
  imports: [TypeOrmModule.forFeature([Role, Permission])],
})
export class SeedersModule {}
