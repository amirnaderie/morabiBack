import { Module } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { AsyncContextMiddleware } from './async-context.middleware';

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
  