/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Permission } from 'src/users/entities/permission.entity';
import { Role } from 'src/users/entities/role.entity';
import { DataSource } from 'typeorm';
import Roles from '../seeds/roles';
import { PermissionType } from 'src/common/constants/permissions';
import { capitalizeEachWord } from 'src/common/helpers/capitilaze';

@Injectable()
export class SeedersService {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const rolesRepository = queryRunner.manager.getRepository(Role);
      const permissionsRepository = queryRunner.manager.getRepository(Permission);
      const rolesSeeds = [];
      const permissionsSeeds = [];
      for (const role of Roles) {
        const r = rolesRepository.create(role);
        rolesSeeds.push(r);
      }
      await rolesRepository.save(rolesSeeds);

      Object.values(PermissionType).forEach((value) => {
        const p = permissionsRepository.create({
          name: capitalizeEachWord(value.replaceAll('_', ' ').toLowerCase()),
          slug: value,
          description: `This Permission Describe ${value}`,
        });
        permissionsSeeds.push(p);
      });
      await permissionsRepository.save(permissionsSeeds);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
