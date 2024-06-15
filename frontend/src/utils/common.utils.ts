import {Message, MessageService} from "primeng/api";

export const getQueryToast = (executed: boolean, description: string) => {
  const message: Message = {detail: description}

  message.summary = executed ? "Exito" : "Error"
  message.severity = executed ? "success" : "error"

  return message
}

export const addQueryMessage = (executed: boolean, description: string, messageService: MessageService) => {
  const message: Message = {detail: description}

  message.summary = executed ? "Exito" : "Error"
  message.severity = executed ? "success" : "error"

  messageService.add(message)
}
