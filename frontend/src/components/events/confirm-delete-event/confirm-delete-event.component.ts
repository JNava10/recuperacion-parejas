import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-delete-event',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete-event.component.html',
  styleUrl: './confirm-delete-event.component.css'
})
export class ConfirmDeleteEventComponent {
  @Output() deleteEvent = new EventEmitter<boolean>();

  emitDelete = (confirm: boolean) => this.deleteEvent.emit(confirm)
}
