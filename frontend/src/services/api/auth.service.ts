import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginResponse, LoginResponseData} from "../../interfaces/auth/login";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  apiUrl = environment.apiUrl;

  sendLoginData(email: string, password: string) {
    try {
      let data: LoginResponseData | null;

      if (!email || !password) throw new Error('Los datos a mandar no están definidos.');

      const body = {email, password}


      this.http.post(`${this.apiUrl}/auth/login`, body).subscribe((res: LoginResponse)  => {
        data = res.data
      })
    }
  }
}
