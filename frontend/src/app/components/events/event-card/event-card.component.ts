import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EventItem, SummaryFile} from "../../../../interfaces/api/event/event";
import {DatePipe, NgIf} from "@angular/common";
import {CreateEventComponent} from "../../../../components/events/create-event/create-event.component";
import {DialogModule} from "primeng/dialog";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {} from "googlemaps";
import MapMouseEvent = google.maps.MapMouseEvent;
import {EditEventComponent} from "../../../../components/events/edit-event/edit-event.component";
import {
  ConfirmDeleteEventComponent
} from "../../../../components/events/confirm-delete-event/confirm-delete-event.component";
import {EventService} from "../../../../services/api/event.service";
import {SidebarModule} from "primeng/sidebar";
import {
  ManageEventMembersFormComponent
} from "../../../../components/events/manage-event-members-form/manage-event-members-form.component";

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    DatePipe,
    CreateEventComponent,
    DialogModule,
    ReactiveFormsModule,
    NgIf,
    EditEventComponent,
    ConfirmDeleteEventComponent,
    SidebarModule,
    ManageEventMembersFormComponent
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {

  constructor(private eventService: EventService) {}

  protected readonly Date = Date;

  @Input() event?: EventItem;
  @Output() refresh = new EventEmitter<null>();

  protected editingEvent = false;
  protected deletingEvent = false;
  protected showMembers = false;

  summaryFile?: SummaryFile

  protected showEditEvent = () => {
    this.editingEvent = true;
  };

  showDeleteEvent = () => {
    this.deletingEvent = true
  };

  handleDeleteEvent = (deleteEvent: boolean) => {
    if (!deleteEvent) this.deletingEvent = false;

    this.eventService.deleteEvent(this.event!).subscribe(() => {
      this.refresh.emit()
    })
  };
  getSummaryFile = (event: EventItem) => {
    this.eventService.getSummaryFile(event).subscribe((body) => {
      this.summaryFile = body.data.file;
    })
  };

  showMembersSidebar = () => {
    this.showMembers = true
  };
}
