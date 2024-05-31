export const EMAIL_REGEX = /[A-Za-z0-9]{4,25}@[A-Za-z]{3,10}.[A-Za-z]{2,7}$/;
export const PASSWORD_REGEX = /[\w!"·$%&\/(\\)=?*¿+\-`<>.:,;|@#~½¬{\[\]}ªº]{3,20}/;

export const event = {
  name: /[A-Za-z\s.]{1,30}$/,
  description: /[A-Za-z\s,.]{1,200}$/,
  scheduledDate: /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/,
  scheduledTime: /[0-9]{1,2}:[0-9]{1,2}/
}

export const user = {
  name: /[A-Za-z\s.]{1,20}$/,
  firstLastname: /[A-Za-z\s.]{1,20}$/,
  secondLastname: /[A-Za-z\s.]{1,20}$/,
  nickname: /[A-Za-z0-9._]{1,20}$/,
  email: /[A-Za-z0-9]{4,25}@[A-Za-z]{3,10}.[A-Za-z]{2,7}$/,
  password: /[\w!"·$%&\/(\\)=?*¿+\-`<>.:,;|@#~½¬{\[\]}ªº]{3,20}/
}

export const preference = {
  name: /[A-Za-z¿?,\s.]{1,25}$/,
  description: /[A-Za-z¿?,\s.]{1,50}$/,
  option: /[\w¿?,\s.]{1,20}$/,
}

