import {ApiResponse} from "../apiResponse";

export interface GetPreferenceResponse extends ApiResponse {
  data: {
    executed: true
    query: PreferenceItemWithType[]
  }
}

export interface PreferenceItem {
  id?: number
  name?: string,
  typeId?: number
  description?: string,
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

export interface PreferenceItemWithType extends PreferenceItem {
  type: PreferenceType
}

export interface PreferenceType {
  id?: number
  text?: string
}
