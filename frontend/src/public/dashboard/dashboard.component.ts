import {Component, OnInit} from '@angular/core';
import {FindMembersComponent} from "../../components/find-members/find-members.component";
import {SocketService} from "../../services/socket.service";
import {RegisteredEventsComponent} from "../../components/events/registered-events/registered-events.component";
import {UsersToMatchListComponent} from "../../components/friendship/users-to-match-list/users-to-match-list.component";
import {FriendshipService} from "../../services/api/friendship.service";
import {UserService} from "../../services/api/user.service";
import {UserItem} from "../../interfaces/api/user/user";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FindMembersComponent,
    RegisteredEventsComponent,
    UsersToMatchListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.likableUsers = users;
    })
  }

  likableUsers?: UserItem[];

}
