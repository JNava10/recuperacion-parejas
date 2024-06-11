import {Component, OnInit} from '@angular/core';
import {FindMembersComponent} from "../../components/find-members/find-members.component";
import {RegisteredEventsComponent} from "../../components/events/registered-events/registered-events.component";
import {UsersToMatchListComponent} from "../../components/friendship/users-to-match-list/users-to-match-list.component";
import {FriendshipService} from "../../services/api/friendship.service";
import {UserService} from "../../services/api/user.service";
import {PendingChatUserItem, UserItem} from "../../interfaces/api/user/user";
import {DialogModule} from "primeng/dialog";
import {Router} from "@angular/router";
import {MatchesListComponent} from "../../components/friendship/matches-list/matches-list.component";
import {RecentChatListComponent} from "../../components/recent-chat-list/recent-chat-list.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FindMembersComponent,
    RegisteredEventsComponent,
    UsersToMatchListComponent,
    DialogModule,
    MatchesListComponent,
    RecentChatListComponent
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

    this.userService.getChats().subscribe(body => {
      const pendingMap = new Map<number, PendingChatUserItem>()
      const readMap = new Map<number, UserItem>()

      console.log(body.data.chats.read)

      body.data.chats.read.forEach((user) => {
        console.log(user)
        readMap.set(user.id!, user!)
      })

      body.data.chats.pending.forEach((user) => {
        console.log(user)
        pendingMap.set(user.id!, user!)
      })

      this.chatList = {
        pending: pendingMap, read: readMap
      };
    })
  }

  isMatch = false;
  matchedUser?: UserItem;
  likableUsers?: UserItem[];
  matches?: UserItem[];
  chatList?: { read: Map<number, UserItem>; pending: Map<number, PendingChatUserItem> };

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
