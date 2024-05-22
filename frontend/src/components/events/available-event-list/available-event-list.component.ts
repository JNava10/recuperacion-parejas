import {Component, Input} from '@angular/core';
import {EventItem} from "../../../interfaces/api/event/event";
import {AvailableEventCardComponent} from "../available-event-card/available-event-card.component";

@Component({
  selector: 'app-available-event-list',
  standalone: true,
  imports: [
    AvailableEventCardComponent
  ],
  templateUrl: './available-event-list.component.html',
  styleUrl: './available-event-list.component.css'
})
export class AvailableEventListComponent {
  @Input() events: EventItem[] = [];


}
