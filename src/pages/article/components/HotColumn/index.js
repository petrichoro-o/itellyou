import React from 'react';
import { useSelector } from 'umi';
import { Card, Avatar } from 'antd';
import Loading from '@/components/Loading';
import { Link } from 'umi';
import List from '@/components/List';
import styles from './index.less';

export default () => {
    const renderItem = ({ id, avatar, name, path, star_count, article_count }) => {
        return (
            <List.Item key={id}>
                <div className={styles['hot-item']}>
                    <div className={styles['avatar']}>
                        <Avatar shape="circle" src={avatar} size={38} />
                    </div>
                    <div className={styles['info']}>
                        <h2 className={styles['title']}>
                            <Link to={`/${path}`}>{name}</Link>
                        </h2>
                        <div className={styles['data']}>
                            <span>{article_count} 文章</span>
                            <span>{star_count} 关注</span>
                        </div>
                    </div>
                </div>
            </List.Item>
        );
    };

    const dataSource = useSelector(state => state.column.list);
    if (!dataSource) return <Loading />;
    return (
        <Card title="热门专栏">
            {<List dataSource={dataSource.data} renderItem={renderItem} />}
        </Card>
    );
};
