import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent {
  inputMessage = new FormControl('');

  sendMessage() {
    const message = this.inputMessage.value
  }
}
