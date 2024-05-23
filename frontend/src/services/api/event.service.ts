import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {environment} from "../../environments/environment";
import {
  EventItem,
  EventResponse,
  GetEventsResponse,
  SubscribedToEventResponse,
  SubscribeEventResponse
} from "../../interfaces/api/event/event";
import {sendTokenParam} from "../../utils/const/url.constants";
import {map, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  createEvent = (event: EventItem) => {
    return this.http.post<EventResponse>(`${environment.apiUrl}/event`, event, {params: {...sendTokenParam}})
  }

  getAllEvents = () => {
    return this.http.get<GetEventsResponse>(`${environment.apiUrl}/event`, {params: {...sendTokenParam}}).pipe(
      tap(body => body.data)
    )
  }

  getAvailableEvents = () => {
    return this.http.get<GetEventsResponse>(`${environment.apiUrl}/event/available`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  editEventDetails = (event: EventItem) => {
    return this.http.put<EventResponse>(`${environment.apiUrl}/event/details`, event, {params: {...sendTokenParam}})
  }

  editEventPlace = (event: EventItem) => {
    return this.http.put<EventResponse>(`${environment.apiUrl}/event/place`, event, {params: {...sendTokenParam}})
  }

  deleteEvent = (event: EventItem) => {
    return this.http.delete<EventResponse>(`${environment.apiUrl}/event/${event.id}`, {params: {...sendTokenParam}})
  }

  getEvent = (id: number) => {
    return this.http.get<EventResponse>(`${environment.apiUrl}/event/${id}`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  getIfRegisteredToEvent = (id: number) => {
    return this.http.get<SubscribedToEventResponse>(`${environment.apiUrl}/event/subscribed/${id}`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  registerToEvent(event: EventItem) {
    return this.http.post<SubscribeEventResponse>(`${environment.apiUrl}/event/subscribe/${event.id}`, {}, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  withdrawFromEvent(event: EventItem) {
    return this.http.post<SubscribeEventResponse>(`${environment.apiUrl}/event/withdraw/${event.id}`, {}, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }
}
