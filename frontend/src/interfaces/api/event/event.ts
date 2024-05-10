import {ApiResponse} from "../apiResponse";

export interface CreateEventResponse extends ApiResponse {
  data: {
    executed: true
    query: CreateEventQuery
  }
}

export interface CreateEventQuery {
  id: number
  name: string
  description: string
  picUrl: string
  summaryUrl: string
  latitude: number
  longitude: number
  author: number
  createdAt: string
  updatedAt: string
}
