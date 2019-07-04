import { STColumn, STColumnBadge } from '@delon/abc';

export const TxListColumns = [
    { i18n: 'operationId', index: 'TxOpreationId' },
    { i18n: 'belongWallets', render: 'belongWalletTpl' },
    { i18n: 'address', render: 'AddressTpl' },
    { i18n: 'moneyAmount', render: 'AmountTpl', className: 'text-right' },
    { i18n: 'createDate', render: 'createTimeTpl', width: '80px', className: 'text-center' },
    { i18n: 'operation', render: 'operation', width: '60px', className: 'text-center' }
];