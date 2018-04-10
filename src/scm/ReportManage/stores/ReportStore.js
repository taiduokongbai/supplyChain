import { ReqApi } from '../../../base/services/ReqApi';
import { Urls ,LoginUrls} from '../../../base/consts/Urls'
import { getData,store } from '../../data/StoreConfig';

const prefix = window.BigDigit;
const ReportUrls = {
    AUTHORITY: `${prefix}:8880/rest/c2msystem/c2m/c2m_secret`,
    REPORT_INDEX: `${prefix}/index.html`,
    SALE_REPORT: `${prefix}/sale.html`,
    PURCHASE_REPORT: `${prefix}/purchase.html`,
};
export { ReportUrls }
const ReportFetch = {
    authority: (pm = {}) => ReqApi.get({
        url: ReportUrls.AUTHORITY, pm
    }),
};
let { observable, action, computed, runInAction, toJS } = mobx;
export default class ReportStore{
    constructor(props) {
        this.type = props.type;
    }

    getUrl(companyCode){
        return ReportFetch.authority().then(json => {
            if (json.resultCode && json.resultCode == '200') {
                this.token = json.Authorization;
                this.url = ReportUrls[this.type] + '?token=' + json.Authorization + '&companyCode=' + companyCode;
            }
            this.loading = false;
            return json; 
        })
    }
    
    @observable loading = false;
    @observable url = "";
    @observable token = "";
    @observable height;
    @action setToken() {
        this.loading = true;
        let person = getData('LayoutTopRedu').get("dataSource") || {};
        if(!person.length){
            return ReqApi.get({
                url: Urls.GET_PERSONAL_INFO,
                pm: {}
            }).then(result => {
                if(result.status == 2000){
                    if(result.data){
                        return this.getUrl(result.data.companyCode)
                    }
                }
            })
        }else{
            return this.getUrl(person.companyCode)
        }
    }
}