import {MessageTypes} from "../../enums/ message/message-types";

export interface Message {
  value: string,
  type: MessageTypes
}

