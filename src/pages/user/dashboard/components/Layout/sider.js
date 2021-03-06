import {
    SnippetsOutlined,
    FileTextOutlined,
    BugOutlined,
    FormOutlined,
    BankOutlined,
    HeartOutlined,
    StarOutlined,
    HistoryOutlined,
} from '@ant-design/icons';

export default [
    {
        key: 'recent',
        title: '最近编辑',
        icon: <SnippetsOutlined />,
        to: '/dashboard',
    },
    {
        type: 'divider',
    },
    {
        key: 'article',
        title: '文章',
        icon: <FileTextOutlined />,
        to: '/dashboard/article',
    },
    {
        key: 'question',
        title: '问题',
        icon: <BugOutlined />,
        to: '/dashboard/question',
    },
    {
        key: 'answer',
        title: '回答',
        icon: <FormOutlined />,
        to: '/dashboard/answer',
    },
    {
        key: 'column',
        title: '专栏',
        icon: <BugOutlined />,
        to: '/dashboard/column',
    },
    {
        key: 'wallet',
        title: '钱包',
        icon: <BankOutlined />,
        to: '/dashboard/wallet',
    },
    {
        type: 'divider',
    },
    {
        key: 'follows',
        title: '关注',
        icon: <HeartOutlined />,
        to: '/dashboard/follows',
    },
    {
        key: 'collections',
        title: '收藏',
        icon: <StarOutlined />,
        to: '/dashboard/collections',
    },
    {
        key: 'history',
        title: '最近浏览',
        icon: <HistoryOutlined />,
        to: '/dashboard/history',
    },
];
