/**
 * 计划列表 store
 */
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { PlanDisplanFetch } from '../../consts/PlanDispatchUrls';
let { observable, action, computed, runInAction, toJS, useStrict } = mobx;

export class PlanDeskListStore extends TableStore {
    pages = {
        page: 1,
        pageSize: 15
    };
    paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
    pageSizeOptions = ['10', '15', '20', '30', '50'];
    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        let pm = { ...this.pages, ...searchBarStore.Pm, ...params };
        if(pm.createByTime||(pm.createByTime=="")){
            if(pm.createByTime==""){
                 pm=Object.assign(pm,{createDateStart:""},{createDateEnd:""})
            }else{
                 pm=Object.assign(pm,{createDateStart:pm.createByTime.slice()[0]},{createDateEnd:pm.createByTime.slice()[1]})
            } 
            delete pm.createByTime
        }
        return PlanDisplanFetch.getPlanDeskList(pm)
            .then(this.updateTableList)
            .then(json => {
                searchBarStore.setLoading(false);
                return json
            });
    }
    @action 
    fetchTableDelet(pm) {
        this.loading = true;
        return PlanDisplanFetch.delPlanDeskList(pm).then(json => {
            runInAction(()=>{
                this.loading=false;
            })
            return json;
        });
    }
}
let planDeskListStore = new PlanDeskListStore();
let searchBarStore=new SearchBarStore();

export {planDeskListStore,searchBarStore }