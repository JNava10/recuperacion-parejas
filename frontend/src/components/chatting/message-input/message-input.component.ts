import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {FileAttachmentComponent} from "../../file-attachment/file-attachment.component";
import {SendMessageApiParams, SendMessageSocketParams} from "../../../interfaces/api/chat/message";
import {Message, MessageService} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {validateFiles} from "../../../utils/common.utils";

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FileAttachmentComponent,
    TooltipModule
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css'
})
export class MessageInputComponent {
  constructor(private messageService: MessageService) {}

  messageInput = new FormControl('');
  filesToSend: File[] = [];
  maxFileSize = 1024; // 1 MB
  maxFileCount = 4;

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
    const files = Array.from(input.files!);

    const valid = validateFiles(files, {maxCount: 4, maxSizeMb: 1}, this.messageService)

    if (!valid) return;

    this.filesToSend = files;
  }

  removeFiles = () => {
    this.filesToSend = []
  };
}
