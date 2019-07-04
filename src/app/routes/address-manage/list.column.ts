import { STColumn, STColumnBadge } from '@delon/abc';

export const UserListColumns = [
    { i18n: 'address', index: 'AddressStr' },
    { i18n: 'walletName', index: 'WalletName' },
    { i18n: 'addressCategory', render: 'addressCategoryTpl', className: 'text-center' },
    { i18n: 'addressType', render: 'addressTypeTpl', className: 'text-center' },
    { i18n: 'addressPath', index: 'Path' },
    { i18n: 'batchNo', index: 'OprationBatchNo', className: 'text-center' },
    { i18n: 'createDate', render: 'createTimeTpl', width: '130px', className: 'text-center' },
    { i18n: 'operation', render: 'operation', width: '120px', className: 'text-center' }
];