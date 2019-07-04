import { Injectable } from '@angular/core';
import { Pager, ConditionPredicateMapper } from 'app/models/list/table-list';

@Injectable()
export class TableFrontListService {

    constructor() {
    }

    pager: Pager = {
        totalItems: 0,
        currentPage: 1,
        maxSize: 5,
        itemsPerPage: 10
    };

    /** 当前页 */
    list: any[];

    /** 搜索结果 */
    searchResults: any[];

    /** 未通过验证的列表 */
    invalidRecords: any[];

    /** 是否处于验证中 */
    invalidSearchOperation: boolean;

    /** 搜索条件 */
    condition: any = {};

    /** 搜索条件 */
    loading = false;

    /** 每次搜索的结果缓存 */
    private searchMap: {} = {};

    /** 获取原始列表的方法 */
    private originalListGetter: () => any[];

    private filter: (item: any) => boolean;
    private invalidFilter: (item: any) => boolean;
    private filterCallback: () => void;
    private invalidFilterCallback: () => void;

    initialize(originalListGetter: () => any[],
               filter: (item: any) => boolean,
               filterCallback: () => void,
               invalidFilter?: (item: any) => boolean,
               invalidFilterCallback?: () => void) {
        this.originalListGetter = originalListGetter;
        this.filter = filter;
        this.filterCallback = filterCallback;
        this.invalidFilter = invalidFilter;
        this.invalidFilterCallback = invalidFilterCallback;
    }

    search() {
        this.pager.currentPage = 1;
        this.invalidSearchOperation = false;
        this.getList();
    }

    searchInvalid() {
        if (this.invalidSearchOperation) {
            this.search();
        } else {
            this.searchInvalidRecords();
        }
    }

    private searchInvalidRecords() {
        this.pager.currentPage = 1;
        this.invalidRecords = null;
        this.invalidSearchOperation = true;
        this.getInvalidList();
    }

    pageChanged(pageIndex: number) {
        this.pager.currentPage = pageIndex;
        if (this.invalidSearchOperation) {
            this.getInvalidList();
        } else {
            this.getList();
        }
    }

    clearConditionAndSearch() {
        this.pager.currentPage = 1;
        this.clearCondition();
        if (this.invalidSearchOperation) {
            this.getInvalidList();
        } else {
            this.getList();
        }
    }

    reset() {
        this.list = null;
        this.searchResults = null;
        this.condition = {};
        this.searchMap = {};
    }



    conditionFilter(item: any, condition: any, mapper: ConditionPredicateMapper): boolean {
        const predicates: boolean[] = [];
        for (const key of Object.keys(mapper)) {
            if (this.isEmpty(condition[key])  || this.isEmpty(mapper[key])) {
                predicates.push(true);
            } else {
                const isMatch = mapper[key](item[key], condition[key]);
                predicates.push(isMatch);
            }
        }

        return predicates.every(o => o);
    }

    private isEmpty(value: any) {
        return value == null || value.length === 0;
    }


    private generateSearchKey(): string {
        let key = '';
// tslint:disable-next-line: forin
        for (const name in this.condition) {
            key += name + '=' + this.condition[name] + '&';
        }
        return key;
    }

    private paging(list: any[]) {
        this.pager.totalItems = list.length;
        if (this.pager.currentPage <= 1) {
            this.list = list.slice(0, this.pager.itemsPerPage);
        } else {
            const start = (this.pager.currentPage - 1) * this.pager.itemsPerPage;
            const end = start + this.pager.itemsPerPage;
            this.list = list.slice(start, end);
        }
    }

    private filterList() {
        const list = [];
        const originalList = this.originalListGetter();

        for (const item of originalList) {
            if (!this.filter)
                return;

            const seleted = this.filter(item);

            if (seleted)
                list.push(item);
        }

        return list;
    }

    private getList() {
        this.list = null;
        let list = [];
        const key = this.generateSearchKey();

        this.loading = true;
        setTimeout(() => {
            try {
                if (this.searchMap[key])
                    list = this.searchMap[key];
                else
                    list = this.searchMap[key] = this.filterList();

                this.paging(list);

                this.searchResults = list;

                if (this.filterCallback)
                    this.filterCallback();

            } catch (ex) {
                console.error(ex);
            }

            this.loading = false;
        }, 100);

    }

    private getInvalidList() {
        this.list = null;
        this.loading = true;
        setTimeout(() => {
            try {
                const list = this.invalidRecords = this.filterInvalidList();
                this.paging(list);
                this.searchResults = list;

                if (this.invalidFilterCallback)
                    this.invalidFilterCallback();

            } catch (ex) {
                console.error(ex);
            }

            this.loading = false;
        }, 100);
    }

    private filterInvalidList() {
        const list = [];
        const originalList = this.originalListGetter();

        for (const item of originalList) {
            if (!this.invalidFilter)
                return;

            const selected = this.invalidFilter(item);

            if (selected)
                list.push(item);
        }

        return list;
    }

    private clearCondition() {
        this.condition = {};
    }

}
