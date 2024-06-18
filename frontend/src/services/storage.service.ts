import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  save = (key: string, value: any)  => {
    localStorage.setItem(`parejas_${key}`, value);
  }

  get = (key: string)  => {
    return localStorage.getItem(`parejas_${key}`);
  }

  getObject = (key: string)  => {
    return JSON.parse(localStorage.getItem(key)!) | 0;
  }

  remove = (key: string)  => {
    return localStorage.removeItem(key)
  }

  removeAll = ()  => {
    return localStorage.clear()
  }
}
