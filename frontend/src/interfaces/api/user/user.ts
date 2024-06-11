import {ApiResponse} from "../apiResponse";
import {EventItem} from "../event/event";
import {PreferenceList} from "../preference/preferenceItem";

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
  enabled?: boolean
  firstSurname?: string
  secondSurname?: string
  nickname?: string
  picUrl?: string
  lastLogin?: any
  connected?: boolean
  createdAt?: string
  updatedAt?: string
  roles?: RoleItem[]
  roleIds?: number[]
}

export interface PendingChatUserItem extends UserItem {
  pendingCount: number
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

export interface GetUsersResponse extends ApiResponse {
  data: {
    executed: true
    query: UserItem[]
  }
}

export interface GetPendingChatsResponse extends ApiResponse {
  data: {
    executed: true
    chats: ChatListResponse
  }
}

export interface ChatListResponse extends ApiResponse {
  notPending: UserItem[],
  pending: PendingChatUserItem[]
}

export interface GetUserResponse extends ApiResponse{
  data: {
    executed: true
    query: UserItem
  }
}

export interface ManageUserResponse extends ApiResponse {
  data: {
    executed: true
    query: boolean
  }
}

export interface RoleItem {
  id?: number,
  name?: string,
  display_name?: string
}

export interface GetRolesResponse extends ApiResponse {
  data: {
    executed: true
    query: RoleItem[]
  }
}

export interface DeleteUserResponse {
  data: {
    executed: true
    query: boolean
  }
}

export interface GetProfileResponse extends ApiResponse{
  data: {
    executed: true
    query: {
      user: UserItem,
      preferences: PreferenceList
    }
  }
}
