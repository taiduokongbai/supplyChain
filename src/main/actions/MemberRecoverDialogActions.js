/**
 * Created by MW on 2017/3/24.
 */
import { ReqApi } from '../../base/services/ReqApi'
import { Urls } from '../../base/consts/urls';
import { MEMBERDIALOGREDU, MEMBERCHANGEREDU } from '../consts/ActTypes';

//编辑
export let show = (id) => (dispatch, getState) => {
    let state = getState()[MEMBERDIALOGREDU].setIn(["eidtMemberDialog", "visible"], true);
    dispatch({ type: MEMBERDIALOGREDU, state });
    dispatch(loadEnum(id));
}



export let hide = () => (dispatch, getState) => {
    let state = getState()[MEMBERDIALOGREDU].setIn(["eidtMemberDialog", "visible"], false);
    dispatch({ type: MEMBERDIALOGREDU, state });
}


export let setLoading = (bool) => (dispatch, getState) => {
    let state = getState()[MEMBERDIALOGREDU].setIn(["eidtMemberDialog", "loading"], bool);
    dispatch({ type: MEMBERDIALOGREDU, state });
}




//办公
export let getAddressEnum = (pm = {}) => (dispatch, getState) => {
    /* ReqApi.get({
         url: Urls.ADDRESS_GET_ALL,
         pm:{
             id
         },
     }).then(json => {
         if(json.status=== 2000){
             let state =  getState()[MEMBERDIALOGREDU].setIn(["eidtMemberDialog","addressEnum"],json.data.list);
             dispatch({type:MEMBERDIALOGREDU, state});
         }
     });*/



    return ReqApi.get({
        url: Urls.ADDRESS_ALLLIST,
        pm: pm,
    }).then(json => {
        if (json.status === 2000 && json.data) {
            let state = getState()[MEMBERDIALOGREDU].setIn(["eidtMemberDialog", "addressEnum"], json.data.list);
            dispatch({ type: MEMBERDIALOGREDU, state });
            return true;
        } else {
            return false
        }
    });

}

//部门列表
export let getDeptListEnum = () => (dispatch, getState) => {
    return ReqApi.get({
        url: Urls.DEPT_LIST,
    }).then(json => {
        if (json.status === 2000 && json.data) {
            let state = getState()[MEMBERDIALOGREDU].setIn(["eidtMemberDialog", "deptEnum"], [json.data]);
            dispatch({ type: MEMBERDIALOGREDU, state });
        }
    })
}


//职位列表
export let getPositionListEnum = () => (dispatch, getState) => {
    return ReqApi.get({
        url: Urls.POSITION_JOB_LIST,
    }).then(json => {
        if (json.status === 2000 && json.data) {
            let state = getState()[MEMBERDIALOGREDU].setIn(["eidtMemberDialog", "positionEnum"], json.data.list);
            dispatch({ type: MEMBERDIALOGREDU, state });
        }
    })
}

//国家枚举列表
export let getCountryListEnum = () => (dispatch, getState) => {
    return ReqApi.get({
        url: Urls.COUNTRY_GETSELECTED,
    }).then(json => {
        if (json.status === 2000 && json.data) {
            let state = getState()[MEMBERDIALOGREDU].setIn(["eidtMemberDialog", "countryEnum"], json.data.list);
            dispatch({ type: MEMBERDIALOGREDU, state });
        }
    })
}



export let loadEnum = (id) => (dispatch, getState) => {
    dispatch(setLoading(true));
    Promise.all([
        dispatch(getDeptListEnum()),
        dispatch(getAddressEnum()),
        dispatch(getPositionListEnum()),
        dispatch(getCountryListEnum()),
        dispatch(getEmployees(id))

    ]).then(values => {
        dispatch(setLoading(false));
    }, reason => {
        dispatch(setLoading(false));
    });
}







//恢复已停用员工
export let getEmployees = (empCode) => (dispatch, getState) => {
    return ReqApi.get({
        url: Urls.GET_DETAILS_INFO,
        pm: { empCode }
    }).then(json => {
        if (json.status === 2000 && json.data) {
            if (json.data.dept && json.data.dept[0]) {
                json.data.dept[0].deptCode = "";
                json.data.dept[0].deptValue = "";
            }
            if (json.data.position && json.data.position[0]) {
                json.data.position[0].positionCode = "";
                json.data.position[0].positionValue = "";
            }
            let state = getState()[MEMBERDIALOGREDU].setIn(["eidtMemberDialog", "dataSource"], json.data);
            dispatch({ type: MEMBERDIALOGREDU, state });
        }
        return json;
    });
}

export let recoverMember = (data) => (dispatch, getState) => {
    dispatch(setLoading(true));
    return ReqApi.post({
        url: Urls.EMPLOYEE_ADD,
        pm: { ...data, status: 1 }
    }).then(json => {
        if (json.status === 2000) {
            dispatch(setLoading(false));
        }
        return json;
    }, reason => {
        dispatch(setLoading(false));
    });
}


