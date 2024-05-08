import {ApiResponse} from "../apiResponse";

export interface ChatMessages extends ApiResponse {
  data: {
    executed: boolean,
    query: {
      emitterUser: MessageUser,
      receiverUser: MessageUser,
      messages: Message[]
    }
  }
}

export interface MessageUser {
  id: number
  email: string
  nickname: string
  pic_url: string
  connected: boolean
}

export interface Message {
  id: number
  emitter: number
  receiver: number
  text: string
  read: boolean
  created_at: string
  updated_at: string
  deleted_at: any
}
