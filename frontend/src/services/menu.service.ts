import {Injectable, OnInit} from '@angular/core';
import {UserService} from "./api/user.service";
import {MenuItem} from "primeng/api";
import {roleNames} from "../utils/const/common.constants";
import {adminMenuItems, memberMenuItems} from "../utils/const/menu.constants";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor() { }

  // BehaviourSubject se puede usar, entre otras cosas, para crear y manejar observables
  // a los que nos podemos suscribir dede donde queramos.
  private avatarSubject = new BehaviorSubject<string>("");

  avatarChange = this.avatarSubject.asObservable();

  updateAvatar(picUrl: string) {
    this.avatarSubject.next(picUrl);
  }
}
