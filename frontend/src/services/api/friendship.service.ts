import { Injectable } from '@angular/core';
import {GetEventsResponse} from "../../interfaces/api/event/event";
import {environment} from "../../environments/environment";
import {sendTokenParam} from "../../utils/const/url.constants";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {GetUserResponse, GetUsersResponse, ManageUserResponse, UserItem} from "../../interfaces/api/user/user";
import {SendLikeResponse} from "../../interfaces/api/friendship/like";

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor(private http: HttpClient) { }

  likeUser = (userToLike: UserItem) => {
    return this.http.post<SendLikeResponse>(`${environment.apiUrl}/friendship/like/${userToLike.id}`, {}, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.isMatch)
    );
  }

  getOwnMatches = () => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/friendship/matched`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }

  getLikableUsers = () => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/friendship/likables/`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }

}
