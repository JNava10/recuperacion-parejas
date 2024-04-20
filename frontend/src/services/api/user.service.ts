import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  searchMember = (input: string) => {
    const body = {input}

    console.log(body)

    return this.http.post<SearchResponse>(`${environment.apiUrl}/user/member/search`, body);
  }
}
