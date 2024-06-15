import {ApiResponse} from "../apiResponse";
import {UserItem} from "../user/user";

export interface NewMatchNotification {
  id: number,
  from: number,
  to: number,
  seen: boolean,
  createdAt: string,
  userFrom?: UserItem,
  userTo?: UserItem,
}

export interface GetNotificationsResponse extends ApiResponse {
  data: {
    query: NewMatchNotification[]
  }
}
