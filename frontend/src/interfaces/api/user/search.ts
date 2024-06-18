import {ApiResponse} from "../apiResponse";
import {User} from "./user";

export interface SearchResponse extends ApiResponse {
  data: {
    errors?: string[]
    founded: boolean
    results: User[]
  }
}

