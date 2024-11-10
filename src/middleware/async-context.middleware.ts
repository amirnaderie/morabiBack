// async-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncContextMiddleware implements NestMiddleware {
  constructor(private readonly als: AsyncLocalStorage<any>) {}

  use(req: Request, res: Response, next: () => void) {
    //referer
    const store = {
      correlationId:
        req.headers['x-correlation-id'] || req.headers['postman-token'],
      requestIp: req.headers['referer'] || '',
      // accessToken: req.headers['authorization']
      //   ? req.headers['authorization'].toString().split(' ')[1]
      //   : '',
      accessToken: req.cookies['accessToken'],
      subdomainId: req.subdomainId,
    };
    this.als.run(store, () => {
      next(); // Continue to the next middleware or request handler
    });
  }
}
