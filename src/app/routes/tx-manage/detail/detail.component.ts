import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzDrawerRef } from 'ng-zorro-antd';

@Component({
    selector: 'app-tx-manage-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.less']
})
export class TxManageDetailComponent implements OnInit {

    @Input()
    txInfo: any;

    constructor(
        private drawerRef: NzDrawerRef<boolean>,
    ) { }

    ngOnInit() {
    }

    back() {
        this.drawerRef.close();
    }

}
