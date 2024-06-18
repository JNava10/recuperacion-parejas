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
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetPreferenceResponse;

        return of(error);
      })
    );
  }

  deletePreference = (id: number) => {
    return this.http.delete<CrudEditResponse>(`${environment.apiUrl}/preference/${id}`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CrudEditResponse;

        return of(error);
      })
    );
  }

  saveChoicePreference = (preference: CreateChoicePreferenceItem) => {
    return this.http.post<GetPreferenceResponse>(`${environment.apiUrl}/preference/save/choice`, preference, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetPreferenceResponse;

        return of(error);
      })
    );
  }

  saveRangePreference = (preference: CreateRangePreferenceItem) => {
    return this.http.post<SavePreferenceResponse>(`${environment.apiUrl}/preference/save/range`, preference, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as SavePreferenceResponse;

        return of(error);
      })
    );
  }

  getAllPreferences = () => {
    return this.http.get<GetPreferencesResponse>(`${environment.apiUrl}/preference/`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetPreferencesResponse;

        return of(error);
      })
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
