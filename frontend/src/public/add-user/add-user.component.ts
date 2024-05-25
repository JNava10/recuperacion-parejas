import {Component, OnInit} from '@angular/core';
import {UserFormComponent} from "../../components/users/user-form/user-form.component";
import {UserService} from "../../services/api/role.service";
import {RoleItem} from "../../interfaces/api/user/user";

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    UserFormComponent
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit {

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllRoles().subscribe(roles => {
      this.roles = roles;
      this.rolesFetched = true
    })
  }

  roles: RoleItem[] = [];
  rolesFetched = false;
}
