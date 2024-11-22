import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  onlyLettersAndNumbers(str: string): boolean {
    return /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(str);
  }

  randomString(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrs123456789'.split(
      '',
    );

    // Returns a random integer between min (included) and max (excluded)
    // Using Math.round() will give you a non-uniform distribution!
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function pickRandom(arr) {
      return arr[getRandomInt(0, arr.length)];
    }

    let s = '';
    while (length--) s += pickRandom(chars);
    return s;
  }
}
