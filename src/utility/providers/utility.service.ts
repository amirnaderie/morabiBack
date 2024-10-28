import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  onlyLettersAndNumbers(str: string): boolean {
    return /^[\u0600-\u06FFA-Za-z0-9._/,-\s\u200C]*$/.test(str);
  }
}
