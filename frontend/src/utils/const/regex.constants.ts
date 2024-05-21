export const EMAIL_REGEX = /[A-Za-z0-9]{4,25}@[A-Za-z]{3,10}.[A-Za-z]{2,7}$/;
export const PASSWORD_REGEX = /[\w!"·$%&\/(\\)=?*¿+\-`<>.:,;|@#~½¬{\[\]}ªº]{3,20}/;

export const event = {
  name: /[A-Za-z]{1,18}$/,
  description: /[A-Za-z]{1,18}$/,
  scheduledDate: /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
  scheduledTime: /[0-9]{1,2}:[0-9]{1,2}/
}
