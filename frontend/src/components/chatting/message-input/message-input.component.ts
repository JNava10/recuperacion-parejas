import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FileAttachmentComponent} from "../../file-attachment/file-attachment.component";
import {SendMessageApiParams, SendMessageSocketParams} from "../../../interfaces/api/chat/message";

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FileAttachmentComponent
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent {
  messageInput = new FormControl('');
  filesToSend: File[] = []

  @Output() onSendMessage = new EventEmitter<SendMessageApiParams>();

  triggerMessageSend = () => {
    if (this.filesToSend.length > 0) {
      this.onSendMessage.emit({files: this.filesToSend});
      this.messageInput.setValue('');
    } else if (this.messageInput.value && this.messageInput.value!.length > 0) {
      this.onSendMessage.emit({text: this.messageInput.value!});
      this.messageInput.setValue('');
    }
  }

  openFileDialog = (input: HTMLInputElement) => {
    input.click();
  }

  handleFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filesToSend = Array.from(input.files!);
  }

  removeFiles = () => {
    this.filesToSend = []
  };
}
