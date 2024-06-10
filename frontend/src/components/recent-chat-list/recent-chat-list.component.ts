import {Component, Input} from '@angular/core';
import {UserItem} from "../../interfaces/api/user/user";

@Component({
  selector: 'app-recent-chat-list',
  standalone: true,
  imports: [],
  templateUrl: './recent-chat-list.component.html',
  styleUrl: './recent-chat-list.component.css'
})
export class RecentChatListComponent {
  @Input() users?: UserItem[];


}
