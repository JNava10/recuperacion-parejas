import {Component, inject, OnInit} from '@angular/core';
import {MenuModule} from "primeng/menu";
import {UserService} from "../../services/api/user.service";
import {MenuItem, MenuItemCommandEvent, SharedModule} from "primeng/api";
import {MenuService} from "../../services/menu.service";
import {roleNames} from "../../utils/const/common.constants";
import {adminMenuItems, memberMenuItems} from "../../utils/const/menu.constants";
import {ignoreElements, Observable} from "rxjs";
import {GetSelfRoleNames, UserItem} from "../../interfaces/api/user/user";
import {StorageService} from "../../services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RippleModule} from "primeng/ripple";
import {AvatarModule} from "primeng/avatar";

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    MenuModule,
    SharedModule,
    RippleModule,
    AvatarModule
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent implements OnInit {
  constructor(private menuService: MenuService, private userService: UserService, private router: Router, private storageService: StorageService, protected activeRoute: ActivatedRoute) {}

  menuBuild = false;
  roles?: string[];
  menuItems: MenuItem[] = [];
  show = true

  ngOnInit() {
    if (this.storageService.get('token') === null) return

    this.userService.getOwnData().subscribe(body => {
      this.user = body.data.query.user
    })

    this.userService.getSelfRoleNames().subscribe(body => {
      const roles = body.data.query;

      if (roles.includes(roleNames.admin)) {
        this.menuItems.push(...adminMenuItems)
      }

      if (roles.includes(roleNames.member)) {
        this.menuItems.push(...memberMenuItems)
      }

      this.menuItems.push(...this.allUsersMenuItems)

      this.menuService.avatarChange.subscribe(value => {
        this.user!.picUrl = value !== "" ? value : this.user?.picUrl;
      })

      this.menuBuild = true
    })

    this.show = this.storageService.get('token') !== null
  }

  user?: UserItem

  allUsersMenuItems: MenuItem[] = [
    {
      label: 'Perfil',
      items: [
        {label: 'Editar perfil', icon: 'fa-solid fa-circle-user', routerLink: 'edit-profile'},
        {label: 'Cerrar sesión', icon: 'fa-solid fa-right-from-bracket', command: (event: MenuItemCommandEvent) => {
            this.userService.logout().subscribe(async body => {
              if (body.data.executed) {
                this.storageService.removeAll()
                await this.router.navigate(['/login'])
                window.location.reload()
              }
            })
        }},
      ]
    }
  ];

}
