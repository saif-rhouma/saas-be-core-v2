/* eslint-disable prettier/prettier */

import { NotificationType } from 'src/common/constants/notification';

interface Message {
  type: NotificationType;
  payload: any;
}

export interface ServerToClientEvents {
  newNotification: (payload: Message) => void;
  onInit: (payload: Message) => void;
}
