import { Injectable } from '@angular/core';
import {GetUsersResponse} from "../../interfaces/api/user/user";
import {environment} from "../../environments/environment";
import {sendTokenParam} from "../../utils/const/url.constants";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {GetPreferenceResponse} from "../../interfaces/api/preference/preferenceItem";

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
}
