import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/api/user.service";
import {User, UserItem} from "../../../interfaces/api/user/user";
import {UserTableComponent} from "../../../components/users/user-table/user-table.component";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserTableComponent,
    CdkDropList,
    CdkDrag,
    DatePipe
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  constructor(private userService: UserService) {}

  usersFetched = false;
  activatedUsers?: UserItem[]
  nonActivatedUsers?: UserItem[]
  activatedUsersId = "activatedUsers"
  nonActivatedUsersId = "nonActivatedUsers"

  ngOnInit() {
    this.getUsers();
  }

  protected getUsers() {
    this.userService.getNotDeletedWithRoles().subscribe(users => {
      this.nonActivatedUsers = users?.filter(user => user.enabled === false)
      this.activatedUsers = users?.filter(user => user.enabled === true)
      this.usersFetched = true;
    })
  }

  drop(event: CdkDragDrop<UserItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    const user = event.item.data as UserItem;

    if (event.previousContainer.id === this.activatedUsersId) {
      this.userService.enableOrDisableUser(user, false).subscribe(executed => {
        if (executed) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
          );
        }
      })
    } else {
      this.userService.enableOrDisableUser(user, true).subscribe(executed => {
        if (executed) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
          );
        }
      })
    }
  }
}
