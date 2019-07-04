import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, NzMessageDataOptions } from 'ng-zorro-antd';

@Injectable({
    providedIn: 'root'
})
export class MessagePlusService {

    constructor(
        private service: NzMessageService,
        private translate: TranslateService
        ) {
    }

    success(content: string, options?: NzMessageDataOptions)  {
        this.createWithI18n('success', content, options);
    }

    info(content: string, options?: NzMessageDataOptions)  {
        this.createWithI18n('info', content, options);
    }

    warning(content: string, options?: NzMessageDataOptions)  {
        this.createWithI18n('warning', content, options);
    }

    error(content: string, options?: NzMessageDataOptions)  {
        this.createWithI18n('error', content, options);
    }


    private createWithI18n(
                  type: 'success' | 'info' | 'warning' | 'error' | 'loading' | string,
                  content: string,
                  options?: NzMessageDataOptions) {

        const langKeys = [content];
        if (content) {
            langKeys.push(content);
        }

        this.translate.get(langKeys).subscribe(values => {
            this.service.create(type, values[content], options);
        });
    }


}