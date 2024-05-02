import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {environment} from "../../environments/environment";
import {ChatMessages} from "../../interfaces/api/chat/message";
import {sendTokenParam} from "../../utils/const/url.constants";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getMessages = (partnerId: number) => {
    return this.http.get<ChatMessages>(`${environment.apiUrl}/user/member/messages/${partnerId}`, {params: {...sendTokenParam}});
  }



}
