import { forwardRef, Module } from '@nestjs/common';
import { FinancialController } from './controllers/financial.controller';
import { FinancialService } from './services/financial.service';
import { UsersModule } from 'src/users/users.module';
import { ApplicationsModule } from 'src/applications/applications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Application } from 'src/applications/entities/application.entity';
import { Financial } from './entities/financial-year.entity';

@Module({
  controllers: [FinancialController],
  providers: [FinancialService],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ApplicationsModule),
    TypeOrmModule.forFeature([User, Financial, Application]),
  ],
  exports: [FinancialService],
})
export class FinancialModule {}
