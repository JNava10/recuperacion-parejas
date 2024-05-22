import {Component, Input} from '@angular/core';
import {EventItem} from "../../../interfaces/api/event/event";

@Component({
  selector: 'app-available-event-list',
  standalone: true,
  imports: [],
  templateUrl: './available-event-list.component.html',
  styleUrl: './available-event-list.component.css'
})
export class AvailableEventListComponent {
  @Input() events: EventItem[] = [];


}
