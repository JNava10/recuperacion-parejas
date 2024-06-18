import {UserItem} from "../user/user";

export interface SendLikeResponse {
  data: {
    errors?: string[]
    executed: boolean
    isMatch: boolean
  }
}
