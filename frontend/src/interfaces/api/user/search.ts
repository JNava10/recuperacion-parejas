import {ApiResponse} from "../apiResponse";
import {User} from "./user";

export interface SearchResponse extends ApiResponse {
  data: {
    founded: boolean
    results: User[]
  }
}

