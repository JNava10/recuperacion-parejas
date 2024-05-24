import {ApiResponse} from "../apiResponse";
import {EventItem} from "../event/event";

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

export interface UserItem {
  id?: number
  email?: string
  name?: string
  firstSurname?: string
  secondSurname?: string
  nickname?: string
  picUrl?: string
  lastLogin?: any
  connected?: boolean
  createdAt?: string
  updatedAt?: string
  roles?: Role[]
}

export interface CreateUserItem extends UserItem {
  password?: string
}

export interface UserResponse extends ApiResponse {
  user: User
}

export interface UserMessagesResponse extends ApiResponse {
  user: User
}

export interface GetUserResponse {
  data: {
    executed: true
    query: UserItem[]
  }
}

export interface CreateUserResponse {
  data: {
    executed: true
    query: boolean
  }
}

export interface Role {
  id?: number,
  name?: string,
  display_name?: string
}
