import {Component, OnInit} from '@angular/core';
import {EditUserFormComponent} from "../../../component/users/edit-user-form/edit-user-form.component";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../services/api/user.service";
import {UserItem} from "../../../interfaces/api/user/user";

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    EditUserFormComponent
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.queryParams['id'];

    this.userService.findUserById(userId).subscribe(body => {
      this.user = body.user
    });
  }

  user?: UserItem;

}
