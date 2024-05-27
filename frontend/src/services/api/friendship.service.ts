import { Injectable } from '@angular/core';
import {GetEventsResponse} from "../../interfaces/api/event/event";
import {environment} from "../../environments/environment";
import {sendTokenParam} from "../../utils/const/url.constants";
import {map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {GetUserResponse, GetUsersResponse, ManageUserResponse, UserItem} from "../../interfaces/api/user/user";

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor(private http: HttpClient) { }

  likeUser = (userToLike: UserItem) => {
    return this.http.post<ManageUserResponse>(`${environment.apiUrl}/friendship/like/${userToLike.id}`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }

  getLikableUsers = () => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/friendship/likables/`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    );
  }

}
