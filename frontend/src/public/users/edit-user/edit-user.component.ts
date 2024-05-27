import {Component, OnInit} from '@angular/core';
import {EditUserFormComponent} from "../../../component/users/edit-user-form/edit-user-form.component";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../services/api/user.service";
import {RoleItem, UserItem} from "../../../interfaces/api/user/user";
import {RoleService} from "../../../services/api/role.service";

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    EditUserFormComponent
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private roleService: RoleService) {}

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.queryParams['id'];

    this.userService.findUserById(userId).subscribe(user => {
      this.user = user
    });

    this.roleService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    })
  }

  user?: UserItem;
  roles?: RoleItem[];

}
