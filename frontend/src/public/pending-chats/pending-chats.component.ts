import {Component, OnInit} from '@angular/core';
import {RecentChatListComponent} from "../../components/recent-chat-list/recent-chat-list.component";
import {NavigationEnd, Router} from "@angular/router";
import {NewMessageArgs} from "../../interfaces/api/chat/message";
import {UserService} from "../../services/api/user.service";
import {FriendshipService} from "../../services/api/friendship.service";
import {SocketService} from "../../services/socket.service";
import {MessageService} from "primeng/api";
import {PendingChatUserItem, UserItem} from "../../interfaces/api/user/user";

@Component({
  selector: 'app-pending-chats',
  standalone: true,
  imports: [
    RecentChatListComponent
  ],
  templateUrl: './pending-chats.component.html',
  styleUrl: './pending-chats.component.css'
})
export class PendingChatsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private friendshipService: FriendshipService,
    private socketService: SocketService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.userService.getChats().subscribe(body => {
      body.data.chats.notPending.forEach((user) => {
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
    this.userService.findUserById(args.from).subscribe(body => {
      const pendingUser: PendingChatUserItem = {...body, pendingCount: 1}

      return this.pending.set(body.data.query.id!, pendingUser);
    })
  }

  pending = new Map<number, PendingChatUserItem>();
  notPending = new Map<number, UserItem>();
}
