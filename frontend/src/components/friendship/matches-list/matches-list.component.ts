import {Component, Input, OnInit} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {Router} from "@angular/router";
import {onFriendConnectParams} from "../../../interfaces/socket/socket";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-matches-list',
  standalone: true,
  imports: [
  ],
  templateUrl: './matches-list.component.html',
  styleUrl: './matches-list.component.css'
})
export class MatchesListComponent implements OnInit {
  constructor(private router: Router, private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.listenFriendConnected((params: onFriendConnectParams) => {
      const friendId = params.id;

      const friend = this.matches?.find(user => user.id === friendId)!

      const friendIndex = this.matches?.indexOf(friend);

      this.matches![friendIndex!].connected = true
    })

    this.socketService.listenFriendDisconnected((params: onFriendConnectParams) => {
      const friendId = params.id;

      const friend = this.matches?.find(user => user.id === friendId)!
      const friendIndex = this.matches?.indexOf(friend);

      this.matches![friendIndex!].connected = false
    })
  }

  @Input() matches?: UserItem[];

  goToChat = async (user: UserItem) => {
    await this.router.navigate(['chat', {id: user.id}]);
  };
}
