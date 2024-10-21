/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  Response,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from 'src/common/configs/multer.config';
import { FilesService } from '../services/files.service';
import { FileCategory } from '../entities/file.entity';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import getApplicationId from 'src/common/helpers/application-id.func';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @UseGuards(AuthenticationGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async handleUpload(@UploadedFile() file: Express.Multer.File, @Body() { category }, @GetUser() user: Partial<User>) {
    if (file) {
      const appId = getApplicationId(user);
      if (!category) category = FileCategory.Product;
      const payload = { name: file.filename, originalName: file.originalname, category };
      const fileData = await this.filesService.create(payload, user.id, appId);
      return fileData;
    }
    return 'Nothing Has Been Uploaded!';
  }

  @UseGuards(AuthenticationGuard)
  @Get('/products')
  async getAllProductsImages(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.filesService.getAllProductsImages(appId);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/delete/:fileName')
  async deleteProductsImage(@Param('fileName') fileName: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.filesService.removeFileByName(fileName, user.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/deletes/')
  async deleteProductsImages(@Body('files') files: any, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    if (files.length) {
      for (const file of files) {
        await this.filesService.removeFile(file, user.id, appId);
      }
    }
    return 'OKAY';
  }

  @Get('/show/:fileName')
  async getFile(@Param('fileName') fileName: string, @Response() res) {
    return this.filesService.getFileByName(fileName, res);
  }

  @Get('/download/:fileName')
  streamable(@Res({ passthrough: true }) response: Response, @Param('fileName') fileName: string) {
    const file = this.filesService.fileStream(fileName);
    return new StreamableFile(file);
  }
}
