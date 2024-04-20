import {ApiResponse} from "../apiResponse";

export interface SearchResponse extends ApiResponse {
  data: {
    founded: boolean
    results: User[]
  }
}

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
