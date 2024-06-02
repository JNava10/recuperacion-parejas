import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {
  CreateUserItem,
  ManageUserResponse,
  GetUserResponse,
  GetUsersResponse,
  User,
  UserResponse
} from "../../interfaces/api/user/user";
import {GetEventsResponse} from "../../interfaces/api/event/event";
import {sendTokenParam} from "../../utils/const/url.constants";
import {map, tap} from "rxjs";
import {SendRecoverCodeResponse, SendRecoverEmailResponse} from "../../interfaces/recover-password";

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
    return this.http.get<GetUserResponse>(`${environment.apiUrl}/user/${id}`, {params: {...sendTokenParam, withRoles: true}}).pipe(
      map(body => body.data.query)
    )
  }

  getAllUsers = () => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/user`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  getNotDeletedWithRoles = () => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/user/with-roles`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  createUser = (user: CreateUserItem) => {
    return this.http.post<ManageUserResponse>(`${environment.apiUrl}/user`, user,{params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  registerUser = (user: CreateUserItem) => {
    return this.http.post<ManageUserResponse>(`${environment.apiUrl}/user/register`, user).pipe(
      map(body => body.data.query)
    )
  }

  sendRecoverEmail = (email: string) => {
    return this.http.post<SendRecoverEmailResponse>(`${environment.apiUrl}/user/send-recover-email`, {email}).pipe(
      map(body => body.data.executed)
    )
  }

  sendRecoverCode = (code: string, email: string) => {
    return this.http.post<SendRecoverCodeResponse>(`${environment.apiUrl}/user/send-recover-code`, {code, email}).pipe(
      map(body => body.data.checked)
    )
  }

  updatePassword = (id: number, password: string) => {
    return this.http.put<ManageUserResponse>(`${environment.apiUrl}/user/password/${id}`, {password},{params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  addRoles = (id: number, roles: number[]) => {
    return this.http.post<ManageUserResponse>(`${environment.apiUrl}/user/roles/${id}`, {roles},{params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  deleteRoles = (id: number, roles: number[]) => {
    return this.http.post<ManageUserResponse>(`${environment.apiUrl}/user/roles/delete/${id}`, {roles}, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }


  editUserData = (data: CreateUserItem, id: number) => {
    return this.http.put<ManageUserResponse>(`${environment.apiUrl}/user/data/${id}`, data,{params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }
}
