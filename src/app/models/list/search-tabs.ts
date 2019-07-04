export interface SearchTab {
    type: any;
    title: string;
    loaded: boolean;
}

export interface SearchTabCondition {
    [key: string]: any;
    searchTabType: any;
}

export interface SearchTabEvent {
    tabTypes: any[];
    condition: SearchTabCondition;
}


