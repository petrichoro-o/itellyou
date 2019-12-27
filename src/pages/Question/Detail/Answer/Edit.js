import React , { useState , useEffect } from 'react'
import Editor , { EditorBiz } from '@/components/Editor'
import { connect } from 'dva'
import { router } from 'umi'
import { Button, Icon, Tooltip, Modal } from 'antd';
import Timer from '@/components/Timer'
import styles from "./Answer.less";
import { useRef } from 'react';

const AnswerEdit = ({ dispatch , questionId , id , doc , userAnswer , hasHistory , onSubmit, onCancel }) => {
    const editor = useRef();
    const [ content , setContent ] = useState("")
    const [ saving  , setSaving ] = useState(false)
    const [ history , setHistory ] = useState(hasHistory)
    const [ publishing , setPublishing ] = useState(false)
    const docId = doc ? doc.id : 0
    useEffect(() => {
        if(doc){
            if(editor.current){
                editor.current.reset()
            }
        }
        
    },[doc, docId])

    const onEditorChange = content => {
        setContent(content)
    }

    const onEditorLoad = e => {
        editor.current = e
        if(id){
            dispatch({
                type:"doc/setDetail",
                payload:{
                    id
                }
            })
        }
    }

    const onDocLoad = () => {
        const collabBiz = editor.current ? editor.current.getCollabBiz() : null
        const document = collabBiz ? collabBiz.getInitialDocument() : null
        setContent(document ? document.value : "")
    }

    const onSaveExit = () => {
        if(editor.current)
        {
            editor.current.onSave(EditorBiz.SAVE_TYPE.USER_SAVE,() => {
                collabExit()
                onCancel()
            })
        }else{
            onCancel()
        }
    }

    const onSaveBefore = () => {
        setSaving(true)
    }

    const onSaveAfter = () => {
        setSaving(false)
        dispatch({
            type:"answer/findDraft",
            payload:{
                questionId
            }
        })
    }

    const showVersion = () => {
        if(editor.current){
            editor.current.showHistory()
        }
    }

    const onRenderStatus = () => {
        if(saving) return <span>草稿保存中...</span>
        if(userAnswer && userAnswer.draft && userAnswer.id === doc.id)
            return <span>草稿保存于<Timer time={doc.updated_time} /></span>
    }

    const onDeleteDraft = callback => [
        dispatch({
            type:"answer/deleteDraft",
            payload:{
                id:doc.id
            }
        }).then(res => {
            if(res.result){
                if(userAnswer && !userAnswer.published){
                    dispatch({
                        type:"doc/clearDetail"
                    })
                    if(editor.current){
                        editor.current.reset()
                    }
                    setHistory(true)
                }else if(onCancel){
                    collabExit()
                    onCancel()
                }
            }
            callback()
        })
    ]

    const deleteDraft = () => {
        Modal.confirm({
            title: '清除草稿',
            content: `你确定要清除保存的草稿${userAnswer && !userAnswer.published ? "" : '并取消编辑'}吗？`,
            okText: '确定',
            cancelText: '取消',
            centered:true,
            onOk() {
                return new Promise(resolve => {
                    if(editor.current)
                    {
                        editor.current.onSave(EditorBiz.SAVE_TYPE.USER_SAVE,() => {
                            onDeleteDraft(resolve)
                        })
                    }else{
                        onDeleteDraft(resolve)
                    }
                })
            },
            onCancel() {
            },
        })
    }

    const collabExit = () => {
        const collabBiz = editor.current ? editor.current.getCollabBiz() : null
        if(collabBiz){
            collabBiz.exit()
        }
    }

    const onPublish = () => {
        const editorBiz = editor.current ? editor.current.getEditorBiz() : null
        if(!editorBiz || publishing) return
        if(editorBiz.isEmpty(content)){
            return
        }
        setPublishing(true)
        editor.current.onPublish({
            remark:"发布回答"
        })
    }

    const onPublished = res => {
        setPublishing(false)
        if(!res.result) {
            return
        }
        collabExit()
        if(userAnswer && userAnswer.id === parseInt(res.data.id)){
            dispatch({
                type:'question/setUserAnswer',
                payload:{
                    published:res.data.published,
                    deleted:res.data.deleted
                }
            })
        }
        if(onSubmit) {
            onSubmit(res.data)
            return
        }
        router.push(`/question/${questionId}/answer/${res.data.id}`)
    }
    return (
        <div className={styles["editor-warpper"]}>
            <Editor
            id={doc ? doc.id : null}
            onLoad={onEditorLoad}
            onDocLoad={onDocLoad}
            onChange={onEditorChange}
            onSaveBefore={onSaveBefore}
            onSaveAfter={onSaveAfter}
            onPublished={onPublished}
            />
            <div className={styles.footer}>
                <div className={styles.status}>
                    {
                        doc && (
                            <div>
                                {
                                    userAnswer && userAnswer.draft && userAnswer.id === doc.id && 
                                    <Tooltip title="删除草稿">
                                        <Button type="ghost" onClick={deleteDraft}><Icon type="delete" theme="filled" /></Button>
                                    </Tooltip>
                                }
                                {
                                    onRenderStatus()
                                }
                            </div>
                        )
                    }
                    {
                        !doc && history && <Button onClick={showVersion} type="ghost" icon="rollback">撤销删除</Button>
                    }
                </div>
                <div className={styles.action}>
                    { 
                        doc && <Button onClick={showVersion}>历史</Button>
                    }
                    {
                        onCancel &&  <Button onClick={onSaveExit}>保存草稿并离开</Button>
                    }
                    <Button loading={publishing} type="primary" onClick={onPublish}>{ publishing ? "提交中..." : "提交回答"}</Button>
                </div>
            </div>
        </div>
    )
}
export default connect(({ doc , question }) => ({
    doc,
    questionId:question.detail ? question.detail.id : null,
    userAnswer:question.user_answer
}))(AnswerEdit)