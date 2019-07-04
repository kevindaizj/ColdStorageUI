import { Injectable, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpResponseBase } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NotificationService } from 'app/services/notification/notification.service';


/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(private injector: Injector,
                private notification: NotificationService) { }

    /**
     * ng-alain处理tokenService.referrer.url，将授权失败前最后一个的http调用url设为referrerUrl，
     * 这是有问题的，因为这里的调用都是ajax请求，不是路由信息，所以这里做一个修正，
     * 可查看源码SimpleGuard:
     * https://github.com/ng-alain/delon/blob/443c4753860b742f1568de2ef2ef27136e36585f/packages/auth/src/token/simple/simple.guard.ts#L31
     */
    private setRefererUrl() {
        let url = this.injector.get(DOCUMENT).location.pathname;
        if (url.includes('/passport'))
            url = '/';
        this.tokenService.referrer.url = url;
    }

    private goTo(url: string) {
        setTimeout(() => this.injector.get(Router).navigateByUrl(url));
    }

    get tokenService() {
        return this.injector.get(DA_SERVICE_TOKEN) as ITokenService;
    }


    private handleData(response: HttpResponseBase): Observable<any> {
        // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
        if (response.status > 0) {
            this.injector.get(_HttpClient).end();
        }

        switch (response.status) {
            case 200:
                break;
            case 400:
                this.notification.error('BadRequestError');
                break;
            case 401: // 未登录状态码
                // 请求错误 401: https://preview.pro.ant.design/api/401 用户没有权限（令牌、用户名、密码错误）。
                this.tokenService.clear();
                this.setRefererUrl();
                this.goTo('/passport/login');
                break;
            case 403:
                // 未授权,提示
                this.notification.error('UnauthenticationToService');
                break;
            case 404:
                // 找不到api,提示
                this.notification.error('NotFoundService');
                break;
            default:
                if (response instanceof HttpErrorResponse) {
                    this.handleError(response.error);
                    return throwError(response);
                }
                break;
        }
        return of(response);
    }

    private handleError(error: any) {
        console.warn('Error: ', error);
        if (error) {
            if (error.ErrorCode) {
                // 提示 errorCode的翻译
                this.notification.errorCode(error.ErrorCode);
            } else if (error.Message) {
                // 提示 errorMsg
                this.notification.error(error.Message);
            }
        } else {
            // 提示未知错误
            this.notification.error('UnknowError');
        }
    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // 统一加上服务端前缀
        let url = req.url;
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            url = environment.SERVER_URL + url;
        }

        const newReq = req.clone({ url });
        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                // 允许统一对请求错误处理
                if (event instanceof HttpResponseBase) {
                    return this.handleData(event);
                }

                // 若一切都正常，则后续操作
                return of(event);
            }),
            catchError((err: HttpErrorResponse) => this.handleData(err)),
        );
    }


}

