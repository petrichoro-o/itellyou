import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { Popover, Button, Icon } from 'antd'
import TagSelector from './Selector'
import TagCreateForm from './CreateForm'
import Loading from '@/components/Loading'
import styles from './index.less'
import { Link } from 'umi'
import { useDispatch, useSelector } from 'dva'

function Tag ({ id , href , target , className , icon , title , enableDelete , onDelete , onChange }) {

    const dispatch = useDispatch()
    const { detail } = useSelector(state => state.tag) || {}
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects['tag/find']

    const [ visible , setVisible ] = useState(detail && detail.id === id)

    useEffect(() => {
        if(visible && id){
            dispatch({
                type:'tag/find',
                payload:{
                    id
                }
            })
        }
    },[id,visible,dispatch])

    const renderLink = () => {
        return (
            <Link
            to={href}
            target={target}
            className={classnames(className,styles.tag)}
            >
                {icon}
                {title}
                {
                    enableDelete && <Icon type="close" onClick={() => { if(onDelete) onDelete(title) }} />
                }
            </Link>
        )
    }

    const renderSpan = () => {
        return (
            <span
            className={classnames(className,styles.tag)}
            >
                {icon}
                {title}
                {
                    enableDelete && <Icon type="close"  onClick={() => { if(onDelete) onDelete(title) }}/>
                }
            </span>
        )
    }

    const renderTag = () => {
        if(href !== undefined){
            return renderLink()
        }else{
            return renderSpan()
        }
    }

    const renderPopoverContent = () => {
        if(!detail){
            return <Loading />
        }
        if(loading && detail.id !== id){
            return <Loading />
        }
        const followLoading = loadingEffect.effects['tagStar/follow']
        const unfollowLoading = loadingEffect.effects['tagStar/unfollow']
        return (
            <div className={styles['popover-layout']}>
                <h2 className={styles['popover-title']}>{detail.name}</h2>
                <div className={styles['popover-content']}>
                    {detail.description || "暂无介绍"}
                </div>
                <div className={styles['popover-footer']}>
                    <div className={styles['popover-link']}>
                        <Link target="_blank" to={`/tag/${detail.id}`}>查看</Link>
                        <Link target="_blank" to="">编辑</Link>
                    </div>
                    <div className={styles['popover-star']}>
                        <span>{detail.star_count}人</span>
                        <Button 
                        icon="star" 
                        loading={followLoading || unfollowLoading} 
                        type={detail.use_star === true ? 'primary' : 'default'} 
                        onClick={onSetTag}>
                            { 
                                detail.use_star === true ? '已关注' : '关注'
                            }
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const onSetTag = () => {
        if(!detail) return
        const { id , name , use_star } = detail
        const type = use_star ? "unfollow" : "follow"
        dispatch({
            type:`tagStar/${type}`,
            payload:{
                id,
                name,
                remove:use_star
            }
        }).then(res => {
            dispatch({
                type: 'tag/updateDetail',
                payload:{
                    id,
                    name,
                    use_star:!use_star,
                    star_count:res.data
                }
            })
            if(onChange){
                onChange(!use_star,res.data)
            }
        })
    }
    
    const onVisibleChange = visible => {
        setVisible(visible)
    }

    const renderPopoverTag = () => {
        return (
            <Popover
            target="hover"
            mouseEnterDelay={1}
            onVisibleChange={onVisibleChange}
            content={
                renderPopoverContent()
            }
            >
                {
                    renderTag()
                }
            </Popover>
        )
    }

    return renderPopoverTag()
}

Tag.defaultProps = {
    enableDelete:false
}

Tag.Selector = TagSelector
Tag.CreateForm = TagCreateForm

export default Tag

export {
    TagCreateForm,
    TagSelector
}