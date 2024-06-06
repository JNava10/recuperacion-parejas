import {Component, OnInit} from '@angular/core';
import {EditUserFormComponent} from "../../component/users/edit-user-form/edit-user-form.component";
import {UserService} from "../../services/api/user.service";
import {UserItem} from "../../interfaces/api/user/user";
import {EditProfileDataFormComponent} from "../../components/edit-profile-data-form/edit-profile-data-form.component";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    EditUserFormComponent,
    EditProfileDataFormComponent
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getOwnData().subscribe((body) => {
      this.user = body.data.query;
      this.userFetched = true
    })
  }

  user?: UserItem
  userFetched = false
}
