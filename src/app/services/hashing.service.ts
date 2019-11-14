import { Injectable } from '@angular/core';
import { AHashing } from './ahashing';

@Injectable({
  providedIn: 'root'
})
export class HashingService implements AHashing {
  constructor() { }

  public getHashCode(letter: string): number {
    return letter.charCodeAt(0) - 97;
  }
}
