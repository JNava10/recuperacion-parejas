import {ApiResponse} from "../apiResponse";

export interface CreateEventResponse extends ApiResponse {
  data: {
    executed: true
    query: Event
  }
}

export interface Event {
  id: number
  name: string
  description: string
  picUrl?: string
  summaryUrl?: string
  latitude?: number
  longitude?: number
  author?: number
  createdAt?: string
  updatedAt?: string
}

export interface GetAllEventsResponse {
  data: {
    executed: true
    query: Event[]
  }
}
