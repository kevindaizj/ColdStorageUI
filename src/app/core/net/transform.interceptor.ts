import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponseBase, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { mergeMap } from 'rxjs/operators';

/**
 * HTTP转换拦截器，用于转换请求和响应, 使请求和响应与公司其他项目结构一致
 * 因为只是简单的转换，所以不需要在这个类做错误处理（错误处理在default.interceptor.ts）
 */
@Injectable()
export class TransformInterceptor implements HttpInterceptor {

    private httpRequestPrefixes: string[] = ['/api', '/file'];

    private reqPrefixMatched(url: string): boolean {
        for (const prefix of this.httpRequestPrefixes) {
            if (url.startsWith(prefix))
                return true;
        }
        return false;
    }

    private setRequest(req: HttpRequest<any>): HttpRequest<any>  {
        let url = req.url;
        let body = req.body;
        let params = req.params;

        if (this.reqPrefixMatched(url)) {
            url = environment.SERVER_REQUEST_BASE_URL + url;
            params = params.append('sessionKey', req.headers.get('sessionKey'));

            if (body && body.data) {
                body = { ... body.data };
            }
        }

        const newReq = req.clone({
            url,
            body,
            params
        });

        return newReq;
    }

    private setResponse(res: HttpResponse<any>, reqUrl: string): Observable<any> {
        let body = res.body;
        if (this.reqPrefixMatched(reqUrl)) {
            body = { data: res.body };
        }

        const newRes = res.clone({
            body
        });

        return of(newRes);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = req.url;
        const newReq = this.setRequest(req);
        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                if (event instanceof HttpResponse) {
                    return this.setResponse(event, url);
                }
                return of(event);
            }),
        );
    }

}