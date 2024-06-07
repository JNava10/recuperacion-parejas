import {Component, OnInit} from '@angular/core';
import {EditUserFormComponent} from "../../component/users/edit-user-form/edit-user-form.component";
import {UserService} from "../../services/api/user.service";
import {UserItem} from "../../interfaces/api/user/user";
import {EditProfileDataFormComponent} from "../../components/edit-profile-data-form/edit-profile-data-form.component";
import {PreferenceList} from "../../interfaces/api/preference/preferenceItem";
import {
  EditProfilePreferencesFormComponent
} from "../../components/edit-preferences-form/edit-profile-preferences-form.component";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    EditUserFormComponent,
    EditProfileDataFormComponent,
    EditProfilePreferencesFormComponent
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getOwnData().subscribe((body) => {
      this.user = body.data.query.user;
      console.log(body.data.query)
      this.preferences = body.data.query.preferences;
      this.userFetched = true
    })
  }

  user?: UserItem
  preferences?: PreferenceList
  userFetched = false
}
