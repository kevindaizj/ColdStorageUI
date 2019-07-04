import { Injectable } from '@angular/core';
import { NzNotificationService, NzNotificationDataOptions, NzNotificationDataFilled } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(
        private service: NzNotificationService,
        private translate: TranslateService
        ) {
    }

    success(msg: string, title: string = 'Success', options?: NzNotificationDataOptions)  {
        this.createWithI18n('success', msg, title, options);
    }

    info(msg: string, title: string = 'Info', options?: NzNotificationDataOptions)  {
        this.createWithI18n('info', msg, title, options);
    }

    error(msg: string, title: string = 'Error', options?: NzNotificationDataOptions)  {
        this.createWithI18n('error', msg, title, options);
    }

    errorCode(errCode: string) {
        this.error(`ErrorCode_${errCode}`);
    }

    warning(msg: string, title: string = 'Warning', options?: NzNotificationDataOptions)  {
        this.createWithI18n('warning', msg, title, options);
    }

    private createWithI18n(
                  type: 'success' | 'info' | 'warning' | 'error' | 'blank' | string,
                  msg: string,
                  title?: string,
                  options?: NzNotificationDataOptions) {

        const langKeys = [msg];
        if (title) {
            langKeys.push(title);
        }

        this.translate.get(langKeys).subscribe(values => {
            this.service.create(type, values[title || ''], values[msg], options);
        });
    }


}