// async-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncContextMiddleware implements NestMiddleware {
  constructor(private readonly als: AsyncLocalStorage<any>) {}

  use(req: Request, res: Response, next: () => void) {
    const store = {
      correlationId: req.headers['x-correlation-id'],
      accessToken: req.headers['authorization']?req.headers['authorization'].toString().split(' ')[1]:"",
    };
    this.als.run(store, () => {
      next(); // Continue to the next middleware or request handler
    });
  }
}
