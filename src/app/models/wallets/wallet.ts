export interface WalletInfo {
    WalletId: string;
    Name: string;
    PWDHint: string;
    Remark: string;
    IsLogin: boolean;
    AllAddressCount: number;
    AllTrasactionCount: number;
    CreateTime: Date;
}

export interface WalletOperInfo {
    WalletId: string;
    PWDHint: string;
}
