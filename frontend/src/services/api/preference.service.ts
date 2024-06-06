import { Injectable } from '@angular/core';
import {GetUsersResponse} from "../../interfaces/api/user/user";
import {environment} from "../../environments/environment";
import {sendTokenParam} from "../../utils/const/url.constants";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {
  CreateChoicePreferenceItem, PreferenceQueryResponse,
  CreateRangePreferenceItem,
  GetPreferenceResponse, GetPreferencesResponse, UserPreferenceItem
} from "../../interfaces/api/preference/preferenceItem";

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  constructor(private http: HttpClient) { }

  getActivatedPreferences = () => {
    return this.http.get<GetPreferenceResponse>(`${environment.apiUrl}/preference/activated`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }

  saveChoicePreference = (preference: CreateChoicePreferenceItem) => {
    return this.http.post<GetPreferenceResponse>(`${environment.apiUrl}/preference/save/choice`, preference, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }
  saveRangePreference = (preference: CreateRangePreferenceItem) => {
    return this.http.post<GetPreferenceResponse>(`${environment.apiUrl}/preference/save/range`, preference, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }

  getAllPreferences = () => {
    return this.http.get<GetPreferencesResponse>(`${environment.apiUrl}/preference/`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }

  createUserPreferences = (preferences: UserPreferenceItem[]) => {
    return this.http.post<PreferenceQueryResponse>(`${environment.apiUrl}/preference/user-preferences`, preferences, {params: {...sendTokenParam}});
  }
  removePreference = (id: number) => {
    return this.http.delete<PreferenceQueryResponse>(`${environment.apiUrl}/preference/${id}`, {params: {...sendTokenParam}});
  }
}
