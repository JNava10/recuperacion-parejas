import {ApiResponse} from "../apiResponse";

export interface EventResponse extends ApiResponse {
  data: {
    executed: true
    query: EventItem
  }
}

export interface SubscribeEventResponse extends ApiResponse {
  data: {
    executed: true
    query: boolean
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

export interface GetEventsResponse {
  data: {
    executed: true
    query: EventItem[]
  }
}

export interface SubscribedToEventResponse {
  data: {
    executed: true
    query: boolean
  }
}
