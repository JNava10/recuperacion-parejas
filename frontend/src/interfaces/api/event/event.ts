import {ApiResponse} from "../apiResponse";

export interface EventResponse extends ApiResponse {
  data: {
    executed: true
    query: EventItem
  }
}


export interface EventItem {
  id?: number
  name?: string
  description?: string
  picUrl?: string
  scheduledDateTime?: string
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
    query: EventItem[]
  }
}
