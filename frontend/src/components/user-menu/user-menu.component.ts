import {Component, OnInit} from '@angular/core';
import {MenuModule} from "primeng/menu";
import {getUserMenuItems} from "../../utils/common.utils";
import {UserService} from "../../services/api/user.service";
import {MenuItem} from "primeng/api";
import {userMenuItems} from "../../utils/const/menu.constants";

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    MenuModule
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent implements OnInit {
  constructor(private userService: UserService) {}

  roles?: string[]
  menuItems?: MenuItem[]

  ngOnInit() {
    this.userService.getSelfRoles().subscribe(body => {
      this.roles = body.data.roles
    })

    this.menuItems = userMenuItems
  }
}
