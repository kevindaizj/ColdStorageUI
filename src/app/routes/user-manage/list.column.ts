import { STColumn, STColumnBadge } from '@delon/abc';

export const UserListColumns = [
    { i18n: 'userName', index: 'UserName', width: '17%' },
    { i18n: 'userRole', render: 'roleTpl', width: '80px', className: 'text-center' },
    { i18n: 'status', render: 'statusTpl', width: '80px', className: 'text-center' },
    { i18n: 'createDate', index: 'CreateTime', width: '130px', className: 'text-center', type: 'date' },
    { i18n: 'operation', render: 'operation', width: '120px', className: 'text-center' }
];