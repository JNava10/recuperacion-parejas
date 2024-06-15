import { Component } from '@angular/core';
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    ToastModule
  ],
  templateUrl: './custom-toast.component.html',
  styleUrl: './custom-toast.component.css'
})
export class CustomToastComponent {

}
