import { Component } from '@angular/core';
import {CreateEventComponent} from "../../components/events/create-event/create-event.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CreateEventComponent,
    FormsModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {

}
