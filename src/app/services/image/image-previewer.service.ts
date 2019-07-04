import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class ImagePreviewService {

    constructor(private modalSrv: NzModalService,
                private translate: TranslateService) { }

    open(imageUrl) {
        const content = `<img src="${imageUrl}" />`;
        this.modalSrv.create({
            nzTitle: this.translate.instant('imagePreview'),
            nzContent: content,
            nzStyle: { top: '50px' },
            nzClassName: 'image-preview',
            nzFooter: null
        });
    }
}
