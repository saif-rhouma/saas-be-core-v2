/* eslint-disable prettier/prettier */
import { Controller, Get, MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Subject } from 'rxjs';
import { TicketsService } from 'src/tickets/services/tickets.service';
import { NotificationsService } from '../services/notifications.service';
import { MailerService } from '../services/mailer.service';
import { SendEmailDto } from '../dtos/send-mail.dto';
import { getHtmlString } from 'src/common/constants/mail-html-template';

@Controller('notifications')
export class NotificationsController {
  private notificationSubject = new Subject<MessageEvent>();

  // Store connections based on client ID
  public clients: { [clientId: string]: Subject<MessageEvent> } = {};

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly notificationsService: NotificationsService,
    private readonly ticketsService: TicketsService,
    private readonly mailerService: MailerService,
  ) {}

  @Get('mail')
  async sendMailTest() {
    const test: Partial<SendEmailDto> = {
      from: {
        name: 'Saas Test Mail',
        address: 'test@saascore.com',
      },
      recipients: {
        name: 'Saif',
        address: 'saifeddine.rhouma.dev@gmail.com',
      },
      subject: 'test Mail from CORE',
      html: getHtmlString('This is test', 'Testing 123!!'),
    };
    return this.mailerService.sendEmail(test);
  }

  // @Sse('reminders')
  // async sse(
  //   @Query('clientId') clientId,
  //   @Query('appId') appId,
  //   @Req() request: Request,
  // ): Promise<Observable<MessageEvent>> {
  //   if (!clientId || !appId) {
  //     throw new Error('ClientId and AppId rre required');
  //   }

  //   // const tickets = await this.ticketsService.getNotificationTickets(appId, clientId);
  //   console.log(`Client ${clientId} Connected | AppId : ${appId}`);
  //   // Add the client to the service
  //   const clientSubject = this.notificationsService.addClient(clientId);

  //   // Listen for client disconnection
  //   request.on('close', () => {
  //     console.log(`Client ${clientId} disconnected`);
  //     this.notificationsService.removeClient(clientId);
  //   });

  //   return clientSubject.asObservable();
  // }

  // @OnEvent('notification')
  // handleNotification(payload: { message: string; type: string; data: any }) {
  //   this.notificationSubject.next({
  //     data: { message: payload.message, type: payload.type, data: payload.data },
  //   } as MessageEvent);
  // }
}
