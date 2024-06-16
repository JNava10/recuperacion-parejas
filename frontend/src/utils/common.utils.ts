import {Message, MessageService} from "primeng/api";
import TimeAgo from 'javascript-time-ago'
import es from 'javascript-time-ago/locale/es'
import {inject} from "@angular/core";
import {UserService} from "../services/api/user.service";
import {userMenuItems} from "./const/menu.constants";
import {Preference} from "../interfaces/api/preference/preferenceItem";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export const getQueryToast = (executed: boolean, description: string) => {
  const message: Message = {detail: description}

  message.summary = executed ? "Exito" : "Error"
  message.severity = executed ? "success" : "error"

  return message
}

export const showQueryToast = (executed: boolean, description: string, messageService: MessageService) => {
  const message: Message = {detail: description}

  message.summary = executed ? "Exito" : "Error"
  message.severity = executed ? "success" : "error"

  messageService.add(message)
}


TimeAgo.addDefaultLocale(es)
const timeAgo = new TimeAgo('es-ES')

export const getTimeAgo = (timestamp: number) => {
  const date = new Date(timestamp);

  return timeAgo.format(date)
}

export const getUserMenuItems = () => {

}

export const userPreferencesToFormGroup = (preferences: Preference[]) => {
  const group: any = {};

  preferences.forEach((preference) => {
    group[preference.id!] = new FormControl(preference.userValues![0].value || 1, Validators.required)
  });

  return new FormGroup(group);
}

export const preferencesToFormGroup = (preferences: Preference[]) => {
  const group: any = {};

  preferences.forEach((preference) => {
    group[preference.id!] = new FormControl(1, Validators.required)
  });

  return new FormGroup(group);
}
