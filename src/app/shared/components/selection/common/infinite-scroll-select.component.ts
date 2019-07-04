import { OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { debounceTime, switchMap, map, tap } from 'rxjs/operators';
import { ControlValueAccessor } from '@angular/forms';
import { DCCommOptionItem } from './option';
import { TranslateService } from '@ngx-translate/core';


export abstract class InfiniteScrollSelectBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Output()
    change = new EventEmitter<any>();

    optionList: DCCommOptionItem[] = [];

    private searchChange$ = new BehaviorSubject('');
    private searchSubscription: Subscription;
    private condition: any = {};
    private pageIndex = 1;
    private pageSize = 10;

    isLoading = false;
    isLoadingMore = false;
    stopLoadMore = false;

    loadingText: string = this.translate.instant('searching');
    loadMoreText: string = this.translate.instant('loadingMore');

    disabled = false;

    private innerValue: any;
    get value() {
        return this.innerValue;
    }
    set value(newValue: any) {
        if (this.innerValue === newValue)
            return;

        this.onChangeCallback(newValue);
        this.baseOnViewToModel(this.innerValue, newValue);

        const selectedItems = this.optionList.filter(o => o.val === newValue);
        if (selectedItems && selectedItems.length)
            this.change.emit(selectedItems[0]);
        else
            this.change.emit(null);

        this.innerValue = newValue;
    }

    private onChangeCallback = (_: any) => { };
    private onTouchedFn: () => void = () => void 0;

    protected abstract searchUrl(): string;
    protected abstract searchTextSetter(condition: any, searchText: string): void;
    protected abstract idGetter(condition: any): any;
    protected abstract idSetter(condition: any, id: any): void;
    protected abstract conditionGenerator(condition: any): any;
    protected abstract listItemMapper(item: any): DCCommOptionItem;
    protected abstract onModelToView(oldValue: any, newValue: any): void;
    protected abstract onViewToModel(oldValue: any, newValue: any): void;
    abstract onSearch(searchText: string, id: any): void;

    private baseOnModelToView(oldValue: any, newValue: any) {
        if (newValue) {
            if (!this.optionList.some(o => o.val == newValue)) {
                this.iSearch(null, newValue);
            }
        }
        this.onModelToView(oldValue, newValue);
    }

    private baseOnViewToModel(oldValue: any, newValue: any) {
        if (oldValue && !newValue && this.idGetter(this.condition) == oldValue) {
            this.iSearch(null);
        }
        this.onViewToModel(oldValue, newValue);
    }


    constructor(protected http: _HttpClient, protected translate: TranslateService) {
    }

    ngOnInit(): void {
        const optionList$ = this.searchChange$.asObservable().pipe(
            debounceTime(500),
            switchMap(() => this.getDatas())
        );
        this.searchSubscription = optionList$.subscribe(data => {
            this.isLoading = false;
            this.isLoadingMore = false;
            if (data.length < this.pageSize) {
                this.stopLoadMore = true;
            }
            if (this.pageIndex === 1)
                this.optionList = data;
            else
                this.optionList = [...this.optionList, ...data];
        });
    }

    private getDatas(): Observable<any[]> {
        const url = this.searchUrl();
        const condition = { ...this.condition, Index: this.pageIndex, PageSize: this.pageSize };
        const postData = this.conditionGenerator(condition);
        return this.http.post(url, {
            data: postData
        })
        .pipe(map((res: any) => res.data ))
        .pipe(map((list: any[]) => {
            return list.map((item: any) => {
                const option = this.listItemMapper(item);
                return {
                    ...item,
                    ...option
                };
            });
        }));
    }

    iSearch(searchText: string, id: any = null): void {
        this.searchTextSetter(this.condition, searchText);
        this.idSetter(this.condition, id);
        this.isLoading = true;
        this.stopLoadMore = false;
        this.pageIndex = 1;
        this.searchChange$.next('');
    }

    loadMore(): void {
        if (this.stopLoadMore || this.isLoadingMore)
            return;
        this.isLoadingMore = true;
        ++this.pageIndex;
        this.searchChange$.next('');
    }

    writeValue(newValue: any): void {
        const oldValue = this.innerValue;
        this.innerValue = newValue;
        if (oldValue !== newValue) {
            this.baseOnModelToView(oldValue, newValue);
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedFn = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    ngOnDestroy(): void {
        if (this.searchSubscription)
            this.searchSubscription.unsubscribe();
        this.searchChange$.unsubscribe();
    }

}
