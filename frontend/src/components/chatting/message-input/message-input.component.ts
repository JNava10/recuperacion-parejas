import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent {
  inputMessage = new FormControl('');

  @Output() onSendMessage = new EventEmitter<string>();

  triggerMessageSend = (text: string) => {
    this.onSendMessage.emit(text);
  }
}
