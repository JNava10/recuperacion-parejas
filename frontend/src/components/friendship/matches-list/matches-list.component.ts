import {Component, Input} from '@angular/core';
import {UserItem} from "../../../interfaces/api/user/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-matches-list',
  standalone: true,
  imports: [
  ],
  templateUrl: './matches-list.component.html',
  styleUrl: './matches-list.component.css'
})
export class MatchesListComponent {
  constructor(private router: Router) {}

  @Input() matches?: UserItem[];

  goToChat = async (user: UserItem) => {
    await this.router.navigate(['chat', {id: user.id}]);
  };
}
