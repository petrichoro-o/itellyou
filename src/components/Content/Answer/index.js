import React, { useState } from 'react';
import classNames from 'classnames';
import Author from '@/components/User/Author';
import { CommentButton, EditButton, ReportButton } from '@/components/Button';
import { Vote, Favorite, Comment, Adopt, Delete, Edit } from './Action';
import styles from '../index.less';
import { Space } from 'antd';
import { history, Link, useDispatch } from 'umi';
import Editor from '@/components/Editor';
import Timer from '@/components/Timer';
import { RewardButton } from '@/components/Reward';

const Answer = ({
    data: {
        id,
        cover,
        question_id,
        description,
        author,
        column,
        comments,
        use_author,
        allow_adopt,
        adopted,
        allow_delete,
        allow_edit,
        ...item
    },
    authorSize,
    desc,
    action = true,
    readFull = true,
}) => {
    const [commentVisible, setCommentVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [fullVisible, setFullVisible] = useState(false);

    const dispatch = useDispatch();

    const onEditCancel = () => {
        setEditVisible(false);
    };

    const onEditSubmit = doc => {
        setEditVisible(false);
        if (doc) {
            dispatch({
                type: 'answer/updateDetail',
                payload: doc,
            });
            dispatch({
                type: 'answer/updateListItem',
                payload: doc,
            });
            history.push(`/question/${question_id}/answer/${doc.id}`);
        } else {
            window.location.reload();
        }
    };

    const renderEdit = () => {
        return (
            <div style={{ marginTop: 10 }}>
                <Edit id={id} onCancel={onEditCancel} onSubmit={onEditSubmit} />
            </div>
        );
    };

    const allowEdit = !desc && allow_edit;

    const renderContent = () => {
        if (desc && !fullVisible) {
            description = description.trim();
            const hasMore =
                description.length > 3 && description.substr(description.length - 3) === '...';
            return (
                <div className={styles['description']}>
                    <Link to={`/question/${question_id}/answer/${id}`}>
                        <span dangerouslySetInnerHTML={{ __html: description }} />
                    </Link>
                    {/**readFull && hasMore && (
                        <Button
                            className={styles['read-more']}
                            type="link"
                            onClick={() => setFullVisible(true)}
                        >
                            阅读全文
                        </Button>
                    )**/}
                </div>
            );
        }
        return (
            <div className={styles['content']}>
                <div>{<Editor.Viewer key={id} content={item.content} />}</div>

                <p className={styles['footer']}>
                    <Link className={styles['time']} to={`/question/${question_id}/answer/${id}`}>
                        {item.updated_time === null || item.version === 1 ? '发布于' : '更新于'}
                        <Timer
                            time={
                                item.updated_time === null || item.version === 1
                                    ? item.created_time
                                    : item.updated_time
                            }
                        />
                    </Link>
                    {allowEdit && (
                        <EditButton
                            className={styles['edit']}
                            type="link"
                            onClick={() => setEditVisible(!editVisible)}
                        >
                            编辑{item.draft_version > item.version ? '（有未发布的草稿）' : ''}
                        </EditButton>
                    )}
                </p>
                <RewardButton author={author} dataType="answer" dataKey={id} />
            </div>
        );
    };

    const renderAction = () => {
        return (
            <Space size="large">
                <Adopt
                    id={id}
                    question_id={question_id}
                    allow_adopt={allow_adopt}
                    adopted={adopted}
                />
                <Vote id={id} question_id={question_id} {...item} />
                <CommentButton onClick={() => setCommentVisible(!commentVisible)}>
                    {comments === 0 ? '添加评论' : `${comments} 条评论`}
                </CommentButton>
                {item.allow_star && (
                    <Favorite id={id} use_star={item.use_star} allow_star={item.allow_star} />
                )}
                {!allowEdit && <ReportButton id={id} type="answer" />}
                {allow_delete && (
                    <Delete
                        id={id}
                        question_id={question_id}
                        allow_delete={allow_delete}
                        callback={() => history.push(`/question/${question_id}`)}
                    />
                )}
                {allowEdit && <EditButton onClick={() => setEditVisible(!editVisible)} />}
            </Space>
        );
    };

    const renderBody = () => {
        return (
            <div>
                <div className={classNames(styles['body'], { [styles['has-cover']]: cover })}>
                    {renderContent()}
                    {cover && (
                        <div
                            className={styles['cover']}
                            style={{ backgroundImage: `url(${cover})` }}
                        />
                    )}
                </div>
                {action && renderAction()}
                {commentVisible && <Comment question_id={question_id} answer_id={id} />}
            </div>
        );
    };

    return (
        <div className={styles['item']}>
            {author && (
                <div className={styles['header']}>
                    <Author
                        className={styles['author']}
                        info={{ ...author, use_author }}
                        size={authorSize}
                    />
                </div>
            )}

            {editVisible && renderEdit()}
            {!editVisible && renderBody()}
        </div>
    );
};
Answer.Vote = Vote;
Answer.Favorite = Favorite;
Answer.Comment = Comment;
Answer.Adopt = Adopt;
Answer.Delete = Delete;
Answer.Edit = Edit;
export default Answer;
