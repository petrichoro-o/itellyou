import { list ,follow,unfollow } from '@/services/question/star'

export default {
    namespace: 'questionStar',

    state: {},

    effects: {
        *list({ payload }, { call,put }){
            const response = yield call(list,payload)
            yield put({
                type: 'setList',
                payload: response.data
            })
        },
        *follow({ payload }, { call , put }){
            const response = yield call(follow,payload)
            if(response.result){
                yield put({
                    type:'replaceItem',
                    payload:{
                        id:payload.id,
                        use_star:true,
                        star_count:response.data,
                        created_time:new Date()
                    }
                })
                yield put({
                    type:'question/updateDetail',
                    payload:{
                        id:payload.id,
                        use_star:true,
                        star_count:response.data
                    }
                })
            }
            return response
        },
        *unfollow({payload:{ name , ...payload }}, { call , put }){
            const response = yield call(unfollow,payload)
            if(response.result){
                yield put({
                    type:'replaceItem',
                    payload:{
                        id:payload.id,
                        use_star:false,
                        star_count:response.data
                    }
                })

                yield put({
                    type:'question/updateDetail',
                    payload:{
                        id:payload.id,
                        use_star:false,
                        star_count:response.data
                    }
                })
            }
            return response
        }
    },

    reducers:{
        setList(state , {payload:{ append , end , total , data , ...payload }}){
            const key = "list"
            const list = state[key]
            if(!list || !append){
                return {
                    ...state,
                    [key]:{end , total , data , ...payload}
                }
            }
            const dataList = list.data.concat()
            data.forEach(item => {
                if(!dataList.find(child => child.question.id === item.id)){
                    dataList.push(item)
                }
            })
            return {
                ...state,
                [key]:{...list,end,total,data:dataList}
            }
        },
        removeItem(state , { payload } ){
            const key = "list"
            const data = state[key] ? state[key].data || [] : [];
            const index = data.findIndex(item => item.question.id === payload.id)
            if(index >= 0){
                data.splice(index,1)
            }
            return {
                ...state,
                [key]:{...state[key],data}
            }
        },
        replaceItem(state , { payload : { created_time , ...payload} } ){
            const key = "list"
            const list = state[key]
            if(list){
                const data = list.data.concat()
                const index = data.findIndex(item => item.question.id === payload.id)
                if(index >= 0){
                    const item = data[index]
                    data.splice(index,1,{...item ,question:{...item.question,...payload} , created_time })
                }
                
                return {
                    ...state,
                    [key]:{...list,data}
                }
            }
            return {
                ...state
            }
        }
    }
}