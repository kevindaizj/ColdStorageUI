import { Observable, Observer, zip } from 'rxjs';
import { DCImageDimension } from '@shared/models/imgs/image-models';
import { UploadFile } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';

export class ImageHelper {

    static getImageDimension(file: UploadFile): Observable<DCImageDimension> | Observable<null> {
        return Observable.create((observer: Observer<DCImageDimension>) => {
            // check browser compatibility
            if ( !window.URL || !window.URL.createObjectURL || !window.URL.revokeObjectURL ) {
                observer.next(null);
                observer.complete();
                return;
            }

            const img = new Image();
            img.src = window.URL.createObjectURL(file);
            img.onload = () => {
                if (img.src)
                    window.URL.revokeObjectURL(img.src);

                observer.next({ width: img.naturalWidth, height: img.naturalHeight });
                observer.complete();
            };
        });
    }

    static checkDimensionSingle(file: UploadFile, compareDimension: DCImageDimension): Observable<UploadFile> | Observable<null> {
        return Observable.create((observer: Observer<UploadFile>) => {
            ImageHelper.getImageDimension(file).subscribe((dimension: DCImageDimension) =>{
                if (!dimension) {
                    observer.next(file);
                    observer.complete();
                    return;
                }

                if (compareDimension.width === dimension.width && compareDimension.height === dimension.height) {
                    observer.next(file);
                    observer.complete();
                } else {
                    observer.next(null);
                    observer.complete();
                }
            });
        });
    }

    static checkDimension(fileList: UploadFile[], compareDimension: DCImageDimension): Observable<UploadFile[]> {
        return Observable.create((observer: Observer<UploadFile[]>) => {
            const getters: Observable<UploadFile>[] = [];
            for (const file of fileList) {
                getters.push(ImageHelper.checkDimensionSingle(file, compareDimension));
            }

            zip(...getters).subscribe(files => {
                const filterFiles = files.filter(o => o);
                observer.next(filterFiles);
                observer.complete();
            });
        });
    }

}
