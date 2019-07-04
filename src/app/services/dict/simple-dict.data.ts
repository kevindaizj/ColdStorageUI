import { Injectable } from '@angular/core';

export interface SimpleDictItem {
    key: any;
    val: any;
    /**
     * 只针对来自后台api的数据
     */
    i18nKey?: string;
    extra?: any;
}
export interface SimpleDict {
    [key: string]: SimpleDictItem[];
}


export const SimpleDictData: SimpleDict  = {
    YesOrNo: [
        { key: true, val: 'Yes' },
        { key: false, val: 'No' }
    ],
    YesOrNo2: [
        { key: 1, val: 'Yes' },
        { key: 0, val: 'No' }
    ],
    UserStatus: [
        { key: true, val: 'valid' },
        { key: false, val: 'invalid' }
    ],
    AddressCategory: [
        { key: 0, val: 'company' },
        { key: 1, val: 'customer' }
    ],
    AddressType: [
        { key: 0, val: 'receiveAddressType' },
        { key: 1, val: 'changeAddressType' }
    ],
    AddressExportType: [
        { key: 1, val: 'addrExportAccordBatchNo' },
        { key: 2, val: 'addrExportAccordCondition' }
    ]
};

