import { Component } from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";

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
  createEventForm = new FormGroup({
    name: new FormGroup(''),
    description: new FormGroup(''),
    scheduledDate: new FormGroup('')
  })

  handleCreateForm = () => {

  };
}
