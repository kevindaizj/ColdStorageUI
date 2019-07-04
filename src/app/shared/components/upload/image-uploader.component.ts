import { Component, Input, OnInit } from '@angular/core';
import { UploadFile, UploadXHRArgs, UploadFilter } from 'ng-zorro-antd';
import { ImagePreviewService } from 'app/services/image/image-previewer.service';
import { HttpPlusService } from 'app/services/http/http-plus.service';
import { TranslateService } from '@ngx-translate/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DCImageDimension } from '@shared/models/imgs/image-models';
import { Observable, Observer } from 'rxjs';
import { MessagePlusService } from 'app/services/messages/message-plus.service';
import { ImageHelper } from './../../utils/image-helper';

@Component({
// tslint:disable-next-line: component-selector
    selector: 'dc-image-uploader',
    template: `
    <nz-upload nzAction="" nzListType="picture-card" [(nzFileList)]="fileList"  [nzFilter]="filters"
            [nzShowUploadList]="showUploadList" [nzShowButton]="fileList.length < 1" [nzAccept]="'image/*'"
            [nzPreview]="handlePreview" [nzCustomRequest]="uploadImage" [nzRemove]="handleImageRemoved" [nzDisabled]="disabled">
            <i nz-icon type="plus"></i>
            <div class="ant-upload-text">{{uploadText}}</div>
    </nz-upload>
    `,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: DCImageUploaderComponent,
        multi: true
    }]
})
export class DCImageUploaderComponent implements OnInit, ControlValueAccessor {

    fileList = [];
    showUploadList = {
        showPreviewIcon: true,
        showRemoveIcon: true,
        hidePreviewIconInNonImage: true
    };

    disabled: boolean;
    uploadText = '';

    @Input()
    uploadUrl: string;

    @Input()
    category: string;

    @Input()
    validateDimension = false;
    @Input()
    dimension: DCImageDimension = { width: 700, height: 400 };

    innerImageId: string;
    get value() {
        return this.innerImageId;
    }
    set value(newImageId: string) {
        if (this.innerImageId !== newImageId) {
            this.onChangeCallback(newImageId);
            this.innerImageId = newImageId;
        }
    }

    filters: UploadFilter[] = [
        {
            name: 'dimension',
            fn: (fileList: UploadFile[]) => {
                return Observable.create((observer: Observer<UploadFile[]>) => {
                    if (!this.validateDimension) {
                        observer.next(fileList);
                        return;
                    }

                    ImageHelper.checkDimension(fileList, this.dimension)
                    .subscribe(filterFiles => {
                        observer.next(filterFiles);
                        observer.complete();
                        if (fileList.length !== filterFiles.length) {
                            this.translate.get('uploadImgDimensionWarnPrefix').subscribe(t => {
                                this.msg.error(t + ` ${this.dimension.width} X ${this.dimension.height}`);
                            });
                        }
                    });
                });
            }
        }
    ];


    private onChangeCallback = (_: any) => { };

    constructor(private imagePreviewService: ImagePreviewService,
                private httpPlus: HttpPlusService,
                private msg: MessagePlusService,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.translate.get('upload').subscribe(value => this.uploadText = value);
    }

    handlePreview = (file: UploadFile) => {
        const imageUrl = file.url || file.thumbUrl;
        this.imagePreviewService.open(imageUrl);
    }

    handleImageRemoved = (file: UploadFile) => {
        this.value = null;
        return true;
    }

    uploadImage = (uploadArgs: UploadXHRArgs) => {
        return this.httpPlus.uploadBase64Image(uploadArgs, this.category, this.uploadUrl)
            .subscribe((data: any) => {
                this.value = data.data.Id;
            });
    }

    writeValue(newImageId: any): void {
        if (newImageId) {
            if (this.fileList.length === 0) {
                this.fileList = this.fileList.concat({
                    uid: -1,
                    status: 'done'
                });
            }
            this.fileList[0].url = this.httpPlus.generateFileURL(newImageId);
        }
        this.innerImageId = newImageId;
    }
    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any): void {

    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.showUploadList.showRemoveIcon = !isDisabled;
    }
}