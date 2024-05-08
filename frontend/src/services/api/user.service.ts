import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {User, UserResponse} from "../../interfaces/api/user/user";

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
}
