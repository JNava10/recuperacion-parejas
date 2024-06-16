import { Injectable } from '@angular/core';
import {CrudEditResponse, GetUsersResponse} from "../../interfaces/api/user/user";
import {environment} from "../../environments/environment";
import {sendTokenParam} from "../../utils/const/url.constants";
import {catchError, map, of} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {
  CreateChoicePreferenceItem, CreatePreferencesResponse,
  CreateRangePreferenceItem,
  GetPreferenceResponse, GetPreferencesResponse, SavePreferenceResponse, UserPreferenceItem
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
    return this.http.post<SavePreferenceResponse>(`${environment.apiUrl}/preference/save/range`, preference, {params: {...sendTokenParam}})
  }

  getAllPreferences = () => {
    return this.http.get<GetPreferencesResponse>(`${environment.apiUrl}/preference/`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }

  createUserPreferences = (preferences: UserPreferenceItem[]) => {
    return this.http.post<CreatePreferencesResponse>(`${environment.apiUrl}/preference/user`, preferences, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CreatePreferencesResponse;

        return of(error);
      })
    );
  }
}
