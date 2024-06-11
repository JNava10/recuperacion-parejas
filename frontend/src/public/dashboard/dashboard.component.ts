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
import {SocketService} from "../../services/socket.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {NewMessageArgs} from "../../interfaces/api/chat/message";
import {matBottomSheetAnimations} from "@angular/material/bottom-sheet";

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
  constructor(private userService: UserService, private router: Router, private friendshipService: FriendshipService, private socketService: SocketService) {}

  ngOnInit(): void {
    this.getMatchedUsers();

    this.friendshipService.getOwnMatches().subscribe(matches => {
      this.matches = matches;
    })

    this.userService.getChats().subscribe(body => {

      body.data.chats.notPending.forEach((user) => {
        console.log(user)
        this.notPending.set(user.id!, user!)
      })

      body.data.chats.pending.forEach((user) => {
        this.pending.set(user.id!, user!)
      })
    })

    this.socketService.listenNewMesages((args: NewMessageArgs) => {
      const pendingUser = this.pending.get(args.from);
      const notPendingUser = this.notPending.get(args.from);

      if (pendingUser) {
        this.setNewMessage(pendingUser);
      } else if (notPendingUser) {
        this.switchToPending(notPendingUser);
      } else if (!pendingUser && !notPendingUser) {
        this.getNewSender(args);
      }
    })
  }

  private switchToPending(user: UserItem) {
    this.notPending.delete(user.id!);
    this.pending.set(user.id!, {...user, pendingCount: 1})
  }

  private setNewMessage(pendingUser: PendingChatUserItem) {
    pendingUser.pendingCount++;

    this.pending.set(pendingUser.id!, pendingUser)
  }

  private getNewSender(args: NewMessageArgs) {
    this.userService.findUserById(args.from).subscribe(user => {
      const pendingUser: PendingChatUserItem = {...user, pendingCount: 1}

      return this.pending.set(user.id!, pendingUser);
    })
  }

  pending = new Map<number, PendingChatUserItem>();
  notPending = new Map<number, UserItem>();
  isMatch = false;
  matchedUser?: UserItem;
  likableUsers?: UserItem[];
  matches?: UserItem[];

  handleMatch(matchedUser: UserItem) {
    this.matchedUser = matchedUser;
    this.socketService.sendNewMatch(matchedUser)
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
