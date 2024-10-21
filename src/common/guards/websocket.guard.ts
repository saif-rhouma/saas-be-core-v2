/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { MSG_EXCEPTION } from '../constants/messages';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebSocketGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }
    const client: Socket = context.switchToWs().getClient();

    WebSocketGuard.validateToken(client);
    return true;
  }

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.auth;

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(MSG_EXCEPTION.UNAUTHORIZED_TOKEN_NOT_FOUND);
    }

    const config = new ConfigService();
    const jwtService = new JwtService();

    const { user } = jwtService.verify(token, {
      secret: config.get('ACCESS_TOKEN_SECRET'),
    });
    client.data.user = user;
    return user;
  }
}
