import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/api/user.service";
import {User, UserItem} from "../../../interfaces/api/user/user";
import {UserTableComponent} from "../../../components/users/user-table/user-table.component";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {DatePipe} from "@angular/common";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserTableComponent,
    CdkDropList,
    CdkDrag,
    DatePipe,
    RouterOutlet
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  constructor(private userService: UserService) {}

  usersFetched = false;
  users?: UserItem[]

  ngOnInit() {
    this.getUsers();
  }

  protected getUsers() {
    this.userService.getNotDeletedWithRoles().subscribe(body => {
      this.users = body.data.query
      this.usersFetched = true;
    })
  }
}
