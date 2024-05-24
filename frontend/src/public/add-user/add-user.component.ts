import { Component } from '@angular/core';
import {UserFormComponent} from "../../components/users/user-form/user-form.component";

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    UserFormComponent
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

}
