import {ApiResponse} from "../apiResponse";

export interface User {
  id: number
  email: string
  name: string
  first_surname: string
  second_surname: string
  nickname: string
  pic_url: string
  last_login: any
  connected: boolean
  created_at: string
}

export interface UserResponse extends ApiResponse {
  user: User
}

export interface UserMessagesResponse extends ApiResponse {
  user: User
}
