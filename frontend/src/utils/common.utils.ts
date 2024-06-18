import {Message, MessageService} from "primeng/api";
import TimeAgo from 'javascript-time-ago'
import es from 'javascript-time-ago/locale/es'
import {Preference} from "../interfaces/api/preference/preferenceItem";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FileValidationOptions} from "../interfaces/fileValidation";

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

export const validateFiles = (files: File[], options: FileValidationOptions, messageService: MessageService) => {
  const fileSizeValid = files.every(file => file.size <= options.maxSizeMb * (1024 * 1024));
  const fileCountValid = files.length <= options.maxCount;
  const hasFiles = files.length > 0;

  const message: Message = {severity: 'warn', summary: '¡Ojo!'};

  if (!fileSizeValid) {
    message.detail = 'Has intentado subir un archivo demaisado grande.';
  } else if (!fileCountValid) {
    message.detail = 'Has intentado subir demasiados archivos.';
  } else if (!hasFiles) {
    message.detail = 'No se ha intentado subir ningun archivo.';
  }

  if (message.detail) messageService.add(message);

  return message.detail === undefined;
}
