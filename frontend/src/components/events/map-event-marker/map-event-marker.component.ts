import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GoogleMap, MapMarker} from "@angular/google-maps";

@Component({
  selector: 'app-map-event-marker',
  standalone: true,
  imports: [
    GoogleMap,
    MapMarker
  ],
  templateUrl: './map-event-marker.component.html',
  styleUrl: './map-event-marker.component.css'
})
export class MapEventMarkerComponent implements OnInit {
  ngOnInit() {
    if (this.position) {
      this.center = this.position;
      this.markerPosition = this.position;
    }
  }

  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPosition?: google.maps.LatLngLiteral;

  @Input() position?: google.maps.LatLngLiteral
  @Output() positionChange = new EventEmitter<google.maps.LatLngLiteral>

  addMarker = ($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
    this.markerPosition = $event.latLng!.toJSON();

    this.positionChange.emit(this.markerPosition);
  };
}
