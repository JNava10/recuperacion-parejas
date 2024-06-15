import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {FileAttachmentComponent} from "../../file-attachment/file-attachment.component";
import {SendMessageApiParams, SendMessageSocketParams} from "../../../interfaces/api/chat/message";
import {Message, MessageService} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";

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

    const valid = this.validateFiles(files)

    if (!valid) return;

    this.filesToSend = files;
  }

  removeFiles = () => {
    this.filesToSend = []
  };

  private validateFiles = (files: File[]) => {
    const fileSizeValid = files.every(file => file.size <= this.maxFileSize);
    const fileCountValid = files.length <= this.maxFileCount;

    const message: Message = {severity: 'warn', summary: '¡Ojo!'};

    if (!fileSizeValid && fileCountValid) {
      message.detail = 'Has intentado subir demasiados archivos y demasiado grandes.';
    } else if (!fileSizeValid) {
      message.detail = 'Los archivos indicados son demasiado grandes.';
    } else if (fileCountValid) {
      message.detail = 'Se han subido demasiados archivos.'
    }

    if (message.detail) this.messageService.add(message);

    return message.detail === undefined;
  }
}
