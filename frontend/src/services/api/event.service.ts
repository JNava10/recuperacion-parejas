import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {environment} from "../../environments/environment";
import {CreateEventValues} from "../../interfaces/forms/events/events";
import {Event, CreateEventResponse, GetAllEventsResponse} from "../../interfaces/api/event/event";
import {sendTokenParam} from "../../utils/const/url.constants";
import {map, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  createEvent = (event: CreateEventValues) => {
    return this.http.post<CreateEventResponse>(`${environment.apiUrl}/event`, event, {params: {...sendTokenParam}})
  }

  getAllEvents = () => {
    return this.http.get<GetAllEventsResponse>(`${environment.apiUrl}/event`, {params: {...sendTokenParam}}).pipe(
      tap(body => body.data)
    )
  }
}
