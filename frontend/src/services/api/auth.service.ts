import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginRequest, LoginResponse, LoginResponseData} from "../../interfaces/auth/login";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  apiUrl = environment.apiUrl;

  sendLoginData(email: string, password: string): Observable<LoginResponseData> {
    try {
      const body: LoginRequest = {email, password}

      return this.http.post<LoginResponseData>(`${this.apiUrl}/auth/login`, body)
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
