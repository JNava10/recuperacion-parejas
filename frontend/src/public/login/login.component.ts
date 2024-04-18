import { Component } from '@angular/core';
import {LoginFormComponent} from "../../components/login-form/login-form.component";
import {MessagesModule} from "primeng/messages";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        LoginFormComponent,
        MessagesModule
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
