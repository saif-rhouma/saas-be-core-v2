/* eslint-disable prettier/prettier */
import { Controller, Post } from '@nestjs/common';
import { SeedersService } from '../services/seeders.service';

@Controller('seeders')
export class SeedersController {
  constructor(private readonly seedingService: SeedersService) {}

  @Post()
  seed() {
    return this.seedingService.seed();
  }
}
