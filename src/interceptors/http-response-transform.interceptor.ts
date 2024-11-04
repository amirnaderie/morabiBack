import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class HttpResponseTransform<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => {
        const message = data?.message
          ? data.message
          : 'عملیات با موفقیت انجام شد';
        const code = data?.statusCode ? data?.statusCode : statusCode;
        delete data.message;
        return {
          statusCode: code,
          message: message,
          data: data.data,
        };
      }),
    );
  }
}
