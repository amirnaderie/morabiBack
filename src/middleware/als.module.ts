import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage<any>(),
    },
  ],
  exports: [AsyncLocalStorage],
})
export class AlsModule {}
