import {ApiResponse} from "../apiResponse";

export interface EventResponse extends ApiResponse {
  data: {
    executed: true
    query: EventItem
    errors?: string[]
  }
}

export interface SubscribeEventResponse extends ApiResponse {
  data: {
    executed: boolean
    closed: boolean
    errors?: string[]
  }
}

export interface EventItem {
  id?: number
  name?: string
  description?: string
  picUrl?: string
  scheduledDateTime?: string
  closeDateTime?: string
  summaryUrl?: string
  latitude?: number
  longitude?: number
  author?: number
  createdAt?: string
  updatedAt?: string
  assistants? : {
    count: number
  }
}

export interface CreateEventItem {
  id?: number
  name?: string
  description?: string
  picUrl?: string
  scheduledDateTime?: string
  closeDateTime?: string
  summaryUrl?: string
  latitude?: number
  longitude?: number
}

export interface GetEventsResponse {
  data: {
    executed: true
    query: EventItem[]
  }
}

export interface SummaryFile {
  url: string,
  name: string
}

export interface SubscribedToEventResponse {
  data: {
    errors?: string[]
    executed: true
    query: boolean
  }
}

export interface EventSummaryResponse {
  data: {
    errors?: string[]
    executed: true
    file: SummaryFile
  }
}

export interface ManageEventResponse extends ApiResponse {
  data: {
    errors?: string[]
    executed: true
    query: {
      id: number
    }
  }
}
