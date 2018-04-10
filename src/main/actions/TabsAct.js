import { TABSREDU } from '../consts/ActTypes';
import { Urls } from '../../base/consts/urls';
import { ReqApi } from '../../base/services/ReqApi';
import { getMenus, getTabs } from '../../base/consts/MenusList';
import { tabsData } from '../reducers/TabsRedu';

let getStateFun = (getState) => {
    return getState()[TABSREDU];
}
const actions = {
    TabInsert: (tabKey) => (dispatch, getState) => {
        let state = getStateFun(getState);
        let stateJson = state.toJS();
        let tabTitle = stateJson.tabsData[tabKey].title;
        let pkey = stateJson.tabsData[tabKey].pkey;
        if (tabTitle != undefined) {
            state = state.set("activeKey", tabKey).set("openKeys", pkey)
                .updateIn(['tabs'], (tabs) => {
                    let index = tabs.map(t => t.key).indexOf(tabKey);
                    if (index < 0)
                        tabs = tabs.splice(tabs.size, 0, { key: tabKey, title: tabTitle })
                    return tabs;
                })
            dispatch({ type: TABSREDU, state });
        }
    },
    TabAdd: (tab) => (dispatch, getState) => {
        let state = getStateFun(getState)
            .set("activeKey", tab.key)
            .updateIn(['tabs'], (tabs) => {
                let index = tabs.map(t => t.key).indexOf(tab.key);
                if (index < 0)
                    tabs = tabs.splice(tabs.size, 0, tab)
                return tabs;
            })
        dispatch({ type: TABSREDU, state });
    },
    TabRemove: (key, activeKey) => (dispatch, getState) => {
        let state,
            count = 0,
            stateMap = getStateFun(getState),
            akey = activeKey;
        state = stateMap.updateIn(['tabs'], (tabs) => {
            let index = tabs.map(t => t.key).indexOf(key);
            if (index > -1)
                tabs = tabs.splice(index, 1)
            count = tabs.size;
            return tabs;
        }).updateIn(["activeKey"], (k) => {
            if (stateMap.get("tabs").size - 1 == 0)
                return "";
            else
                return activeKey;
        })
        dispatch({ type: TABSREDU, state });
    },
    TabChange: (activeKey) => (dispatch, getState) => {
        let state = getStateFun(getState).set("activeKey", activeKey);
        dispatch({ type: TABSREDU, state });
    },
    getMenus: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            // url: Urls.LOGIN_GET_SIDE_MENUES,
            url: Urls.LOGIN_GETMENUES,
            pm
        }).then(json => {
            let poses = json.data.list;
            let state = getStateFun(getState)
                .set("menusData", getMenus(poses, 'supplyModule'))
                .set("tabsData", getTabs(poses, tabsData, 'supplyModule'));
            dispatch({ type: TABSREDU, state });
        });
    },
}

export default actions;