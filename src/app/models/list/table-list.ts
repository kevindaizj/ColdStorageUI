export interface Pager {
    totalItems: number;
    currentPage: number;
    maxSize: number;
    itemsPerPage: number;
}

export interface ListSortItem {
    field: string;
    direction: string;
}

export interface ConditionPredicateMapper {
    [key: string]: (property: any, conditionProperty: any) => boolean;
}
