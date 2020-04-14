import React from 'react';
import { Avatar } from 'antd';
import { Link } from 'umi';
import classnames from 'classnames';
import UserBrand from '../Brand';
import './index.less';

export default ({
    info: { id, path, name, avatar, description, use_author },
    size,
    extra,
    className,
    model,
    brand = true,
}) => {
    size = size || 'default';
    let avatarShape = 'circle'; //"square"
    let avatarSize = 40;
    if (size === 'small') {
        avatarShape = 'circle';
        avatarSize = 24;
        description = undefined;
    }
    if (size === 'middle') avatarSize = 32;
    const getLink = () => {
        return (
            <Link to={`/${path}`}>
                <span dangerouslySetInnerHTML={{ __html: name }} />
                {use_author && <span>(作者)</span>}
            </Link>
        );
    };
    return (
        <div className={classnames('user-author', `user-author-${size}`, className)}>
            {(!model || model === 'avatar') && (
                <div className="user-author-avatar">
                    <UserBrand id={id}>
                        <Avatar
                            shape={avatarShape}
                            size={avatarSize}
                            src={avatar || 'http://cdn-object.itellyou.com/avatar/default.png'}
                        />
                    </UserBrand>
                </div>
            )}
            {(!model || model === 'name') && (
                <div className="user-author-content">
                    <div className="user-author-name">
                        {brand && <UserBrand id={id}>{getLink()}</UserBrand>}
                        {!brand && getLink()}
                    </div>
                    {description && (
                        <p
                            className="user-author-desc"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}
                </div>
            )}

            {extra}
        </div>
    );
};