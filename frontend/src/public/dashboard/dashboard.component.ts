import {Component, OnInit} from '@angular/core';
import {FindMembersComponent} from "../../components/find-members/find-members.component";
import {SocketService} from "../../services/socket.service";
import {RegisteredEventsComponent} from "../../components/events/registered-events/registered-events.component";
import {UsersToMatchListComponent} from "../../components/friendship/users-to-match-list/users-to-match-list.component";
import {FriendshipService} from "../../services/api/friendship.service";
import {UserService} from "../../services/api/user.service";
import {UserItem} from "../../interfaces/api/user/user";
import {DialogModule} from "primeng/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {MatchesListComponent} from "../../components/friendship/matches-list/matches-list.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FindMembersComponent,
    RegisteredEventsComponent,
    UsersToMatchListComponent,
    DialogModule,
    MatchesListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private userService: UserService, private router: Router, private friendshipService: FriendshipService) {}

  ngOnInit(): void {
    this.getMatchedUsers();

    this.friendshipService.getOwnMatches().subscribe(matches => {
      this.matches = matches;
    })
  }

  isMatch = false;
  matchedUser?: UserItem;
  likableUsers?: UserItem[];
  matches?: UserItem[];

  handleMatch(matchedUser: UserItem) {
    this.matchedUser = matchedUser;
    this.isMatch = true;

  }

  goToChat = async (user: UserItem) => {
    await this.router.navigate(['chat', {id: user.id}]);
  };

  private getMatchedUsers() {
    this.friendshipService.getMatchableUsers().subscribe(users => {
      this.likableUsers = users;
    });
  }
}
