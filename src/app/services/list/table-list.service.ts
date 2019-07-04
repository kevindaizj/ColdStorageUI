import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { Pager, ListSortItem } from 'app/models/list/table-list';
import { STChangeSort } from '@delon/abc';


@Injectable()
export class TableListService {
    public pager: Pager = {
        totalItems: 0,
        currentPage: 1,
        maxSize: 5,
        itemsPerPage: 10
    };

    public condition: any = {};
    private orders: ListSortItem[] = [];
    public list: any[];
    public listUrl: string;

    public listItemProcessor: (item: any) => void = null;
    public conditionGenerator: (condition: any, pager: Pager, orders: any) => any;
    public totalCountGetter: (result: any) => number = r =>  r.Total;
    public listGetter: (result: any) => any[] = r => r.Records;

    constructor(private http: _HttpClient) {

    }

    public getList(): Observable<any> {
        return Observable.create(observer => {
            this.list = null;
            const condition = { ... this.condition };
            if (this.orders && this.orders.length) {
                condition.OrderBy = this.orders[0].field;
                condition.Dir = this.orders[0].direction;
            }
            const postData = this.conditionGenerator(condition, this.pager, this.orders);
            this.http.post(this.listUrl, {
                data: postData
            }).subscribe((data: any) => {
                const result = data.data;
                this.pager.totalItems = this.totalCountGetter(result);
                this.list = this.listGetter(result);
                if (this.listItemProcessor) {
                    for (const item of this.list) {
                        this.listItemProcessor(item);
                    }
                }

                observer.next(result);
            }, (err) => {
                this.list = [];
                observer.error(err);
            });
        });

    }

    public changeSortOrders(sort: STChangeSort) {
        const orders: ListSortItem[] = [];
        const keys = Object.keys(sort.map);
        for (const key of keys) {
          orders.push({
            field: key,
            direction: sort.map[key] === 'descend' ? 'desc' : 'asc',
          });
        }
        this.orders = orders;
    }

}
