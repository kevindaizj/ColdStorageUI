import { TranslateService } from '@ngx-translate/core';
import { SimpleDictData, SimpleDictItem } from './simple-dict.data';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable, of } from 'rxjs';
import { dictApiMapping } from './simple-dict.mapping';
import { SimpleDictCacheService } from './simple-dict-cache.service';

@Injectable({
    providedIn: 'root'
})
export class SimpleDictService {

    constructor(private cacheServ: SimpleDictCacheService,
                private translate: TranslateService) {

    }

    private getLangKey(items: SimpleDictItem[], key: string, isCachedData: boolean = false) {
        for (const item of items) {
            if (item.key == key) {
                if (isCachedData)
                    return item.i18nKey || item.val;
                else
                    return item.val;
            }
        }
        return '';
    }

    private translateAll(items: SimpleDictItem[], accessor: (o: SimpleDictItem) => string): Observable<SimpleDictItem[]> {
        return Observable.create(observer => {
            const langKeys = items.map<string>(o => accessor(o));
            this.translate.get(langKeys).subscribe(translatedDatas => {
                const results = [] as SimpleDictItem[];

                for (const item of items) {
                    const newItem = { ...item };
                    results.push(newItem);

                    const langKey = translatedDatas[accessor(item)];
                    if (langKey) {
                        newItem.val = langKey;
                    }
                }

                observer.next(results);
            }, error => observer.next([...items]));
        });
    }


    getPromiseVal(dictType: string, key: string): Observable<any> {
        return Observable.create(observer => {

            if (SimpleDictData[dictType]) {
                const langKey = this.getLangKey(SimpleDictData[dictType], key);
                this.translate.get(langKey).subscribe( data => observer.next(data), error => observer.next() );

            } else {
                const cachedDict$ = this.cacheServ.get(dictType);
                cachedDict$.subscribe((cachedDict: SimpleDictItem[]) => {
                    if (cachedDict) {
                        const langKey = this.getLangKey(cachedDict, key, true);
                        this.translate.get(langKey).subscribe(data => observer.next(data), error => observer.next());
                        return;
                    }
                    observer.next();
                });
            }
        });
    }

    getAllVals(dictType: string): Observable<SimpleDictItem[]> {
        return Observable.create(observer => {

            if (SimpleDictData[dictType]) {
                const items = SimpleDictData[dictType];
                this.translateAll(items, o => o.val)
                    .subscribe(results => observer.next(results),
                               error => observer.next([...items])
                    );

            } else {
                const cachedDict$ = this.cacheServ.get(dictType);
                cachedDict$.subscribe((cachedDict: SimpleDictItem[]) => {
                    if (cachedDict) {
                        this.translateAll(cachedDict, o => o.i18nKey || o.val)
                            .subscribe(results => observer.next(results),
                                       error => observer.next([...cachedDict])
                            );
                        return;
                    }
                    observer.next([]);
                });
            }
        });
    }


}