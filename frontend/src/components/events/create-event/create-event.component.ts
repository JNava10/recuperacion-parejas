import { Component } from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {CreateEventValues} from "../../../interfaces/forms/events/events";
import {EventService} from "../../../services/api/event.service";

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CalendarModule
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  constructor(private eventService: EventService) {
  }

  createEventForm = new FormGroup({
    name: new FormGroup(''),
    description: new FormGroup(''),
    scheduledDate: new FormGroup('')
  })

  handleCreateForm = () => {
    const formData = this.createEventForm.value;
    const event: CreateEventValues = {
      name: formData.name!,
      description: formData.description!,
      scheduledDate: formData.scheduledDate!
    }

    this.eventService.createEvent(event).subscribe(body => {
      body.data.query
    })
  };
}
