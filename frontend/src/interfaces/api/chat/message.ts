import {ApiResponse} from "../apiResponse";
import {User} from "../user/user";

export interface Message {

}

export interface UserMessages extends ApiResponse {
  user: User,
  messages: Message[]
}
