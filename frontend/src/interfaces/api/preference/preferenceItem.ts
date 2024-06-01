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

export interface CreatePreferenceItem {
  name?: string,
  description?: string
}

export interface CreateChoicePreferenceItem extends CreatePreferenceItem {
  options: PreferenceOption[]
}

export interface CreateRangePreferenceItem extends CreatePreferenceItem {
  range: {
    min: number,
    max: number
  }
}

export interface PreferenceItemWithType extends PreferenceItem {
  type: PreferenceType
}

export interface PreferenceType {
  id?: number
  text?: string
}


export interface PreferenceOption {
  text: string
}
