import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, Link } from 'umi';
import Loading from '@/components/Loading';
import Pay from '@/components/Pay';
import { Card, Space, Statistic, Button } from 'antd';
import styles from './index.less';
import Withdraw from './Withdraw';

export default () => {
    const [payVisible, setPayVisible] = useState(false);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const dispatch = useDispatch();
    const me = useSelector(state => state.user.me);

    useEffect(() => {
        dispatch({
            type: 'thirdAccount/find',
        });
    }, [dispatch]);

    const { alipay } = useSelector(state => state.thirdAccount) || {};

    const onClose = status => {
        if (status === 'succeed') {
            window.location.reload();
        } else {
            setPayVisible(false);
            setWithdrawVisible(false);
        }
    };

    if (!me) return <Loading />;

    const {
        rank,
        bank: { credit, cash, score },
    } = me;

    const renderWithdrawBtn = () => {
        if (alipay) return <Button onClick={() => setWithdrawVisible(true)}>提现</Button>;
        return (
            <span>
                <Link to="/settings/account">绑定支付宝</Link>后可提现
            </span>
        );
    };

    return (
        <div className={styles['warpper']}>
            <Card>
                <div className={styles['body']}>
                    <Space size="large">
                        <Statistic title="我的积分" value={credit} />
                        <Statistic title="我的余额(元)" value={cash} precision={2} />
                        <Statistic
                            title="我的等级"
                            valueRender={node => (
                                <span>
                                    {rank.name}({node})
                                </span>
                            )}
                            value={score}
                        />
                    </Space>
                    <Space size="large" className={styles['action']}>
                        {renderWithdrawBtn()}
                        <Button type="primary" onClick={() => setPayVisible(true)}>
                            充值
                        </Button>
                    </Space>
                    {payVisible && <Pay onClose={onClose} />}
                    {withdrawVisible && <Withdraw onClose={onClose} />}
                </div>
            </Card>
        </div>
    );
};
