import {UserItem} from "../user/user";

export interface SendLikeResponse {
  data: {
    executed: boolean
    isMatch: boolean
  }
}
