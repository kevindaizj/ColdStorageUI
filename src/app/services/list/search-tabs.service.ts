import { Injectable, OnDestroy } from '@angular/core';
import { SearchTab, SearchTabEvent, SearchTabCondition } from 'app/models/list/search-tabs';
import { Observable, BehaviorSubject } from 'rxjs';
import { SimpleDictService } from '../dict/simple-dict.service';
import { SimpleDictItem } from '../dict/simple-dict.data';
import { debounceTime } from 'rxjs/operators';
import { NzTabChangeEvent } from 'ng-zorro-antd';

@Injectable()
export class SearchTabsService implements OnDestroy {
    tabs: SearchTab[] = [];
    selectedIndex = 0;

    condition: SearchTabCondition = {} as SearchTabCondition;

    private searchSubject: BehaviorSubject<SearchTabEvent>;
    searchTrigger$: Observable<SearchTabEvent>;

    constructor(private dictServ: SimpleDictService) {
    }

    init(tabDictType: string) {
        this.searchSubject = new BehaviorSubject<SearchTabEvent>({ tabTypes: null, condition: this.condition });
        this.searchTrigger$ = this.searchSubject.asObservable().pipe(debounceTime(500));
        this.initTabs(tabDictType);
    }

    private initTabs(tabDictType: string) {
        this.dictServ.getAllVals(tabDictType)
            .subscribe((items: SimpleDictItem[]) => {
                let index = 0;
                for (const item of items) {
                    this.tabs.push({
                        title: item.val,
                        type: item.key,
                        loaded: index == this.selectedIndex ? true : false
                    });
                    index++;
                }
            });
    }

    search(selectedTabIndexFn: (searchTabType: any) => number = type => type) {
        const searchTabType = this.condition.searchTabType;
        if (searchTabType !== null && searchTabType !== undefined)
            this.selectedIndex = selectedTabIndexFn(searchTabType);

        const event: SearchTabEvent = {
            tabTypes: null,
            condition: this.condition,
        };
        this.searchSubject.next(event);
    }

    switchAndSearch(tabType: any, selectedTabIndexFn: (searchTabType: any) => number = type => type) {
        this.searchSubject.next({ tabTypes: [tabType], condition: this.condition });
        this.selectedIndex = selectedTabIndexFn(tabType);
    }

    onTabSelect($event: NzTabChangeEvent) {
        const tab = this.tabs[$event.index];
        if (!tab.loaded) {
            this.searchSubject.next({ tabTypes: [tab.type], condition: this.condition });
            this.tabs[$event.index].loaded = true;
        }
    }

    ngOnDestroy(): void {
        this.searchSubject.unsubscribe();
    }


}