import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {UsersToMatchCardComponent} from "../users-to-match-card/users-to-match-card.component";
import {FriendshipService} from "../../../services/api/friendship.service";

@Component({
  selector: 'app-users-to-match-list',
  standalone: true,
  imports: [
    UsersToMatchCardComponent
  ],
  templateUrl: './users-to-match-list.component.html',
  styleUrl: './users-to-match-list.component.css'
})
export class UsersToMatchListComponent implements OnInit{

  constructor(private friendshipService: FriendshipService) {}

  ngOnInit(): void {
    this.userSelected = this.users![0]
  }

  @Input() users?: UserItem[];
  @Output() isMatch = new EventEmitter<UserItem>();

  userSelected?: UserItem

  handleUserClicked = (isLike: boolean) => {
    if (isLike) {
      this.friendshipService.likeUser(this.userSelected!).subscribe(isMatch =>  {
        this.handleLike(isMatch);
      })
    } else {
      this.selectNextUser();
    }
  };

  private handleLike(isMatch: boolean) {
    if (isMatch) this.showMatch();
    else {
      this.selectNextUser();
    }
  }

  private showMatch() {
    this.isMatch.emit(this.userSelected);
    this.selectNextUser();
  }

  private selectNextUser() {
    this.users?.shift();
    this.userSelected = this.users![0];
  }
}
