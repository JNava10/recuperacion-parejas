import {Component, Input} from '@angular/core';
import {PendingChatUserItem, UserItem} from "../../interfaces/api/user/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-recent-chat-list',
  standalone: true,
  imports: [],
  templateUrl: './recent-chat-list.component.html',
  styleUrl: './recent-chat-list.component.css'
})
export class RecentChatListComponent {
  constructor(private router: Router) {
  }

  @Input() pending?: PendingChatUserItem[];
  @Input() readed?: UserItem[];

  goToChat = async (user: PendingChatUserItem | UserItem) => {
    await this.router.navigate(['chat', {id: user.id}]);
  };
}
