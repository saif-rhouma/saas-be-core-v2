/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { File, FileCategory, FileType } from '../entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private repo: Repository<File>,
    private applicationsService: ApplicationsService,
    private usersService: UsersService,
  ) {}

  getFileByName(fileName: string, res: Response) {
    const defaultFileImage = 'default-placeholder.png';
    try {
      if (fileName && fileName.indexOf('.') !== -1) {
        const filePath = join(process.cwd(), 'public', fileName);
        if (existsSync(filePath)) {
          return res.sendFile(filePath);
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      const filePath = join(process.cwd(), 'public', defaultFileImage);
      return res.sendFile(filePath);
    }
  }

  async removeFileByName(fileName: string, userId: number, applicationId: number) {
    if (!userId || !applicationId) {
      return null;
    }

    try {
      if (fileName && fileName.indexOf('.') !== -1) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
        }
        const application = await this.applicationsService.findOne(applicationId);
        if (!application) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
        }

        const isOwner = await this.findByName(fileName, userId, applicationId);
        if (isOwner.length) {
          const filePath = join(process.cwd(), 'public', fileName);
          if (existsSync(filePath)) {
            unlinkSync(filePath);
            await this.repo.remove(isOwner);
            return 'File deleted successfully';
          }
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      return 'No thing Has Been removed!';
    }
  }

  async removeFile(fileName: string, userId: number, applicationId: number) {
    console.log('---> Remove');
    try {
      if (fileName && fileName.indexOf('.') !== -1) {
        const isOwner = await this.findByName(fileName, userId, applicationId);
        console.log('--> isOwner', isOwner);
        if (isOwner.length) {
          const filePath = join(process.cwd(), 'public', fileName);
          if (existsSync(filePath)) {
            unlinkSync(filePath);
            await this.repo.remove(isOwner);
          }
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log('eo', error);
    }
  }

  findByName(name: string, userId, appId: number) {
    return this.repo.find({ where: { name, application: { id: appId }, createdBy: { id: userId } } });
  }

  fileStream(fileName) {
    return createReadStream(join(process.cwd(), 'public', fileName));
  }

  async create(fileData: Partial<File>, userId: number, applicationId: number) {
    if (!userId || !applicationId) {
      return null;
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    const file = this.repo.create(fileData);
    file.createdBy = user;
    file.application = application;
    return this.repo.save(file);
  }

  async getAllProductsImages(applicationId: number) {
    if (!applicationId) {
      return null;
    }
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    return this.repo.find({
      where: {
        type: FileType.Image,
        category: FileCategory.Product,
        application: { id: applicationId },
      },
    });
  }
}
