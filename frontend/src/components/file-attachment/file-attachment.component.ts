import {Component, Input} from '@angular/core';
import {SlicePipe} from "@angular/common";

@Component({
  selector: 'app-file-attachment',
  standalone: true,
  imports: [
    SlicePipe
  ],
  templateUrl: './file-attachment.component.html',
  styleUrl: './file-attachment.component.css'
})
export class FileAttachmentComponent {
  @Input() file?: File

  canDownload = false;
  nameCharLimit = 10

  getFileSize = () => {
    const size = this.file!.size;

    if (size > 1048576) { // 1 MB
      return `${Math.round(size / 1048576)} MB`
    } else {
      return `${Math.round(size / 1024)} KB`
    }
  };

  getTypeIcon = () => {
    const mimePrefix = this.file!.type.split('/')[0];

    const icons = new Map([
      ['image', '<i class="fa-solid fa-image"></i>'],
      ['pdf', '<i class="fa-solid fa-file-pdf"></i>'],
      ['default', '<i class="fa-solid fa-file"></i>'],
    ]);

    const icon = icons.get(mimePrefix);

    if (icon) {
      return icon
    } else {
      return icons.get('default');
    }
  };
}
