import {ApiResponse} from "../apiResponse";

export interface LoginRequest {
  email: string,
  password: string
}

export interface LoginResponseData {
  token: string,
  logged: boolean
  firstLogin: boolean,
  socketToken: string
}

export interface LoginResponse extends ApiResponse {
  data: LoginResponseData
}
