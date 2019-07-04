import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SimpleInterceptor } from '@delon/auth';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import { TransformInterceptor } from '@core/net/transform.interceptor';

export const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true},
  { provide: HTTP_INTERCEPTORS, useClass: TransformInterceptor, multi: true},
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true}
];
