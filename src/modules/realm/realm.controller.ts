import { Controller } from '@nestjs/common';
import { RealmService } from './providers/realm.service';

@Controller('realm')
export class RealmController {
  constructor(private readonly realmService: RealmService) {}
}
