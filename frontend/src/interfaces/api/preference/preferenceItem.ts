import {ApiResponse} from "../apiResponse";
import {FormControl} from "@angular/forms";

export interface GetPreferenceResponse extends ApiResponse {
  data: {
    executed: true
    query: PreferenceItemWithType[]
  }
}

export interface SavePreferenceResponse extends ApiResponse {
  data: {
    executed: true
  }
}

export interface GetPreferencesResponse extends ApiResponse {
  data: {
    executed: true
    query: PreferenceList
  }
}


export interface CreatePreferencesResponse extends ApiResponse {
  data: {
    executed: true
    query: boolean
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

export interface PreferenceList {
  choice: ChoicePreference[],
  range: RangePreference[],
}

export interface PreferenceValueFormItem {
  preference: number,
  value: number
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


export interface ChoicePreference extends Preference {
  options?: Option[]
  optionSelected?: string
}

export interface PreferenceControl extends Preference {
  label?: string,
  required?: string,
}

export interface Option {
  preference: number
  option_name: string
  option_value: number
}

export interface Preference {
  id?: number
  name?: string
  description?: string
  type?: {
    text?: string
  }
  userValues?: UserValue[]
}

export interface RangePreference extends Preference {
  values?: PreferenceValue
}

export interface PreferenceValue {
  preference?: number
  min_value?: number
  max_value?: number
}

export interface UserValue {
  value?: number
}

export interface UserPreferenceItem {
  user?: number
  preference?: number
  value?: number
}

export interface PreferenceType {
  id?: number
  text?: string
}


export interface PreferenceOption {
  text: string
}
