import { HttpHeaders, HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Base64Service } from '../base64/base64.service';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { BaseUploadFile } from 'app/models/upload/BaseUploadFile';
import { UploadXHRArgs } from 'ng-zorro-antd';

@Injectable({
    providedIn: 'root'
})
export class HttpPlusService {

    constructor(
        private http: HttpClient,
        private base64: Base64Service,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {

    }

    public download(url: string, data: any, method: 'get' | 'post' = 'post'): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this.http.request(method, url, {
                body: data,
                responseType: 'arraybuffer',
                observe: 'response'
            }).subscribe(res => {
                const fileName = this.getFileNameFromHeader(res.headers);
                const blob = new Blob([res.body]);
                this.downloadFileFromBlob(blob, fileName);
                observer.next(true);
                observer.complete();
            }, err => {
                observer.error(err);
            });
        });
    }

    public upload(url: string, files: File[] | File, method: 'get' | 'post' = 'post'): Observable<any> {
        const formData = new FormData();
        if (files instanceof Array) {
            for (let i = 0; i < files.length; i++) {
                formData.append('file' + i, files[i]);
            }
        } else {
            formData.append('file', files);
        }
        return Observable.create((observer: Observer<any>) => {
            this.http.request(method, url, {
                body: formData
            }).subscribe(data => {
                observer.next(data);
                observer.complete();
            }, err => {
                observer.error(err);
            });
        });
    }

    private getFileNameFromHeader(headers: HttpHeaders): string {
        const disposition = headers.get('content-disposition');
        let fileName = disposition.substring(disposition.indexOf('filename=') + 9);
        if (fileName.indexOf('filename*=UTF-8\'\'') >= 0) {
            fileName = fileName.substring(fileName.indexOf('filename*=UTF-8\'\'') + 17);
        }
        if (fileName.lastIndexOf('.') < 0) {
            fileName = fileName.substring(0, fileName.lastIndexOf('==') + 2);
            fileName = fileName.substring(fileName.lastIndexOf('?') + 1);
            fileName = this.base64.decodeBase64(fileName);
        }
        return fileName;
    }
    private downloadFileFromBlob(blob: Blob, fileName: string) {
        if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            const objUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            a.setAttribute('href', objUrl);
            a.setAttribute('download', fileName);
            a.click();
            URL.revokeObjectURL(objUrl);
        }
    }

    generateFileURL(fileId: string, url: string = '/api/file/info/imageresponse') {
        const prefix = '/file/download';
        const token = this.tokenService.get().token;
        const link = `${prefix}${url}?sessionKey=${token}&fileId=${fileId}`;
        return link;
    }

    uploadBase64Image(uploadArgs: UploadXHRArgs,
        category: 'Blog' | 'Adv' | 'Sponsor' | 'Merchant' | 'Question' | string,
        url: string = '/api/file/upload'): Observable<any> {

        const file = uploadArgs.file as unknown as File;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return Observable.create(observer => {
            let httpSubscription = null;
            reader.onload = (e) => {
                let base64String = reader.result as string;
                base64String = base64String.substring(base64String.indexOf('base64,') + 7);
                const postData: BaseUploadFile = {
                    Name: file.name,
                    DisplayName: file.name,
                    Suffix: file.name.substring(file.name.lastIndexOf('.')),
                    Size: file.size,
                    Base64String: base64String,
                    Category: category
                };

                const req = new HttpRequest('POST', url, { data: postData }, {
                    reportProgress: true,
                    withCredentials: true
                });

                httpSubscription = this.http.request(req).subscribe((event: HttpEvent<{}>) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        if (event.total > 0) {
                            // tslint:disable-next-line:no-any
                            (event as any).percent = event.loaded / event.total * 100;
                        }
                        uploadArgs.onProgress(event, uploadArgs.file);
                    } else if (event instanceof HttpResponse) {
                        observer.next(event.body);
                        uploadArgs.onSuccess(event.body, uploadArgs.file, event);
                    }
                }, (err) => {
                    observer.error(err);
                    uploadArgs.onError(err, uploadArgs.file);
                });
            };

            return () => {
                if (httpSubscription)
                    httpSubscription.unsubscribe();
            };
        });
    }


}
