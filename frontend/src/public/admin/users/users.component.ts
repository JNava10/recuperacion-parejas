import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/api/user.service";
import {UserItem} from "../../../interfaces/api/user/user";
import {UserTableComponent} from "../../../components/users/user-table/user-table.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserTableComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  constructor(private userService: UserService) {}

  usersFetched = false;

  ngOnInit() {
    this.userService.getNotDeletedWithRoles().subscribe(users => {
      this.users = users;

      console.log(users)

      this.usersFetched = true;
    })
  }

  users?: UserItem[]
}
