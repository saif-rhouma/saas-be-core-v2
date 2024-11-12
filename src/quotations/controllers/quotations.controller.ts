/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import getApplicationId from 'src/common/helpers/application-id.func';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { User } from 'src/users/entities/user.entity';
import { CreateQuotationDto } from '../dtos/create-quotation.dto';
import { QuotationDto } from '../dtos/quotation.dto';
import { UpdateQuotationDto } from '../dtos/update-quotation.dto';
import { QuotationsService } from '../services/quotations.service';
import * as path from 'path';
import { Response as ResExp } from 'express';
import { PdfService } from 'src/files/services/pdf.service';
import { HtmlQuotation } from 'src/common/pdf-templates/quotation.pdf.template';
import { SendEmailDto } from 'src/notifications/dtos/send-mail.dto';
import { getHtmlString } from 'src/common/constants/mail-html-template';
import { CURRENT_SERVER } from 'src/common/constants/global';
import { MailerService } from 'src/notifications/services/mailer.service';
import { ShareQuotationDto } from '../dtos/share-quotation.dto';
import { HTTP_CODE } from 'src/common/constants/http-status-code';

@Controller('quotations')
export class QuotationsController {
  constructor(
    private quotationsService: QuotationsService,
    private pdfService: PdfService,
    private readonly mailerService: MailerService,
  ) {}

  @Serialize(QuotationDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createQuotation(@Body() quotationData: CreateQuotationDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.quotationsService.createQuotation(quotationData, user.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/approve/order/')
  async approveConfirm(@Body() payload: any, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const quotation = await this.quotationsService.approveAndCreateOrder(payload.quotationId, user.id, appId);
    return quotation;
  }

  @Serialize(QuotationDto)
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.quotationsService.findAllByApplicationAdvance(user.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  findQuotation(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.quotationsService.findOneByApplication(id, appId);
  }

  @HttpCode(HTTP_CODE.NO_CONTENT)
  @UseGuards(AuthenticationGuard)
  @Post('/share')
  async sendQuotationToClient(@Body() payload: ShareQuotationDto, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const quotation = await this.quotationsService.findOneByApplication(payload.id, appId);
    const url = `${CURRENT_SERVER}/api/quotations/pdf/${quotation.id}`;
    try {
      const mail: Partial<SendEmailDto> = {
        from: {
          name: quotation.application.name,
          address: 'test@saascore.com',
        },
        recipients: {
          name: quotation.customer.name,
          address: quotation.customer.email,
        },
        subject: `Quotation: #${quotation.ref} for Your Request`,
        html: getHtmlString(
          `Quotation: #${quotation.ref}`,
          `You can download Quotation for this <a href="${url}">Link</a>. For any questions or additional information, feel free to contact us. </br> Best regards.`,
          'Download Quotation File',
          quotation.application.appLogo,
        ),
      };
      await this.mailerService.sendEmail(mail);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/pdf/:id')
  async pdfQuotation(@Param('id') id: string, @Res() res: ResExp) {
    try {
      const quotation = await this.quotationsService.findPdf(id);
      const outputPath = path.join(process.cwd(), 'public', `${quotation.ref}.pdf`);

      const quotationHtml = HtmlQuotation(quotation);

      const pdfFilePath = await this.pdfService.generatePdf(quotationHtml, outputPath);

      // // Send the generated PDF as a response
      res.sendFile(pdfFilePath, (err) => {
        if (err) {
          res.status(500).send({ message: 'Could not send the file.' });
        }
      });
    } catch (error) {
      res.status(500).send({ message: 'Error generating PDF', error });
    }
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/edit/:id')
  async updateQuotation(
    @Param('id') id: string,
    @Body() quotationData: UpdateQuotationDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    return this.quotationsService.updateQuotation(id, appId, quotationData);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() quotationData: UpdateQuotationDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = getApplicationId(user);
    return this.quotationsService.update(id, appId, quotationData);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeQuotation(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    return this.quotationsService.remove(id, appId);
  }
}
