import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {DeleteUserResponse, GetUserResponse, User, UserItem, UserResponse} from "../../interfaces/api/user/user";
import {GetEventsResponse} from "../../interfaces/api/event/event";
import {sendTokenParam} from "../../utils/const/url.constants";
import {map, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  searchMember = (input: string) => {
    const body = {input}

    return this.http.post<SearchResponse>(`${environment.apiUrl}/user/member/search`, body);
  }

  findUserById = (id: string) => {
    const body = {id}

    return this.http.post<UserResponse>(`${environment.apiUrl}/user/member/search`, body);
  }

  getAllUsers = () => {
    return this.http.get<GetUserResponse>(`${environment.apiUrl}/user`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  getNotDeletedWithRoles = () => {
    return this.http.get<GetUserResponse>(`${environment.apiUrl}/user/with-roles`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  deleteUser = (user: UserItem) => {
    return this.http.delete<DeleteUserResponse>(`${environment.apiUrl}/user/${user.id}`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }
}
