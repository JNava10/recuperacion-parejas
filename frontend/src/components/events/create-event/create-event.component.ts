import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
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

  @Output() created = new EventEmitter<boolean>();

  createEventForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    scheduledDate: new FormControl('')
  })

  handleCreateForm = () => {
    const formData = this.createEventForm.value;
    const event: CreateEventValues = {
      name: formData.name!,
      description: formData.description!,
      scheduledDate: formData.scheduledDate!,
      picUrl: "https://cdn-9.motorsport.com/images/amp/YpNpMWJ0/s1000/ferrari-f1-75-con-paraspruzzi.jpg",
      summaryUrl: "https://www.fia.com/sites/default/files/fia_2024_formula_1_technical_regulations_-_issue_1_-_2023-04-25.pdf" ,
      latitude: 10.1,
      longitude: 10.2
    }

    this.eventService.createEvent(event).subscribe(body => {
      this.created.emit(body.data.executed)
    })
  };
}
