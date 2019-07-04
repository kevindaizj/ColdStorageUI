import { SimpleDictItem } from './simple-dict.data';

export interface DictApiMapItem {
    url: string;
    method: 'GET' | 'POST';
    params?: any;
    mapping: (result: any) => SimpleDictItem;
}

export interface DictApiMapping {
    [key: string]: DictApiMapItem;
}

export const dictApiMapping: DictApiMapping = {
    RoleType: {
        url: '/api/common/role/dropdownlist',
        method: 'GET',
        params: {},
        mapping: result => {
            return {
                key: parseInt(result.Value, 10),
                val: result.Text,
                i18nKey: 'Role_' + result.Text
            };
        }
    }
};
