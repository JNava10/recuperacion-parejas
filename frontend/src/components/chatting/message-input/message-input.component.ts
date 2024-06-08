import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FileAttachmentComponent} from "../../file-attachment/file-attachment.component";

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
  filesInput = new FormControl([]);
  filesToSend?: File[]

  @Output() onSendMessage = new EventEmitter<string>();
  @Output() onSendFiles = new EventEmitter<string>();

  triggerMessageSend = (text: string) => {
    this.onSendMessage.emit(text);
    this.messageInput.setValue('');
  }

  openFileDialog = (input: HTMLInputElement) => {
    input.click();
  }

  triggerFilesSend = (text: string) => {
    // this.onSendMessage.emit(text);
    // this.inputMessage.setValue('');
  }

  handleFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filesToSend = Array.from(input.files!);

    console.log(this.filesToSend)
  }
}
