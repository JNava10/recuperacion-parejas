import {ApiResponse} from "../apiResponse";

export interface GetPreferenceResponse extends ApiResponse {
  data: {
    executed: true
    query: PreferenceItem[]
  }
}

export interface PreferenceItem {
  id?: number
  name?: string
  description?: string,
  created_at?: string
  updated_at?: string
  deleted_at?: string
}
