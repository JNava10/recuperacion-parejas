import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {
  CreateUserItem,
  ManageUserResponse,
  GetRolesResponse,
  GetUsersResponse,
  User,
  UserResponse
} from "../../interfaces/api/user/user";
import {GetEventsResponse} from "../../interfaces/api/event/event";
import {sendTokenParam} from "../../utils/const/url.constants";
import {map, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  getAllRoles = () => {
    return this.http.get<GetRolesResponse>(`${environment.apiUrl}/roles`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }
}
