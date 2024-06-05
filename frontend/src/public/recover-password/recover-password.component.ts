import { Component } from '@angular/core';
import {RecoverPasswordFormComponent} from "../../components/recover-password-form/recover-password-form.component";

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    RecoverPasswordFormComponent
  ],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {

}
