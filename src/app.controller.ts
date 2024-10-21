/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  getHello(): string {
    console.log('---->');
    this.eventEmitter.emit('ticket-event', 'Hello there!');
    return this.appService.getHello();
  }
}
