import { Injectable } from '@angular/core';
import { SimpleDictItem } from './simple-dict.data';
import { dictApiMapping, DictApiMapItem } from './simple-dict.mapping';
import { of, Observable, Observer } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { map, share, tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class SimpleDictCacheService {

    private dictCacheList: {
        type: string;
        time: Date;
        data: SimpleDictItem[];
    }[] = [];

    private requests: { [key: string]: Observable<SimpleDictItem[]> } = {};


    constructor(private http: _HttpClient) {

    }

    private getCacheData(dictType: string): SimpleDictItem[] {
        for (let i = this.dictCacheList.length - 1; i >= 0; i--) {
            const item = this.dictCacheList[i];
            if (item.type === dictType) {
                const interval = Math.abs(new Date().getTime() - item.time.getTime());
                if (interval > 60 * 60 * 24 * 1000) {
                    return null;
                } else {
                    return item.data;
                }
            }
        }
        return null;
    }

    private clearCacheData(dictType: string) {
        for (let i = this.dictCacheList.length - 1; i >= 0; i--) {
            const item = this.dictCacheList[i];
            if (item.type === dictType) {
                this.dictCacheList.splice(i, 1);
            }
        }
    }

    private getApiConfig(dictType: string): DictApiMapItem {
        const apiConfig = dictApiMapping[dictType];
        if (!apiConfig)
            throw new Error('No api configs for SimpleDict >>> dictType::' + dictType);
        return apiConfig;
    }

    private createApiRequest(dictType: string): Observable<any> {
        const apiConfig = this.getApiConfig(dictType);

        let request$ = of(null);
        if (apiConfig.method === 'GET') {
            request$ = this.http.get(apiConfig.url, apiConfig.params);
        } else {
            request$ = this.http.post(apiConfig.url, { data: apiConfig.params });
        }

        return request$;
    }

    private requestDictData(dictType: string): Observable<SimpleDictItem[]> {
        const apiConfig = this.getApiConfig(dictType);
        return Observable.create((observer: Observer<any>) => {
            const request$ = this.createApiRequest(dictType);
            request$.pipe(
                map(res => res.data),
                map((list: any[]) => {
                    return list.map(item => apiConfig.mapping(item));
                })
            )
                .subscribe((list: any[]) => {
                    this.clearCacheData(dictType);
                    this.dictCacheList.push({ type: dictType, time: new Date(), data: list });
                    observer.next(list);
                },
                    error => observer.next(null));
        })
            .pipe(share());
    }

    get(dictType: string): Observable<SimpleDictItem[]> {
        const cached = this.getCacheData(dictType);
        if (cached)
            return of(cached);

        return Observable.create((observer: Observer<SimpleDictItem[]>) => {
            if (!this.requests[dictType]) {
                this.requests[dictType] = this.requestDictData(dictType);
            }
            const request$ = this.requests[dictType];
            const subscription = request$.subscribe(
                results => {
                    observer.next(results);
                    subscription.unsubscribe();
                },
                err => {
                    observer.next(null);
                    subscription.unsubscribe();
                });
        });
    }


}