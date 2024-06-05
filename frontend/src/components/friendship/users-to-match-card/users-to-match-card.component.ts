import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";

@Component({
  selector: 'app-users-to-match-card',
  standalone: true,
  imports: [],
  templateUrl: './users-to-match-card.component.html',
  styleUrl: './users-to-match-card.component.css'
})
export class UsersToMatchCardComponent {
  @Input() user?: UserItem
  @Output() buttonClicked = new EventEmitter<boolean>();

  emitClick = (isLike: boolean) => {
    this.buttonClicked.emit(isLike)
  };
}
