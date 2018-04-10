import TableStore from '../../base/stores/TableStore';
import SelectStore from '../../base/stores/SelectStore';
import {message} from 'antd';
import { RequirementsFetch } from './RequirementsUrls';
import {requirementsNextStore} from './RequirementsNextStore';
import {requirementsStore} from './RequirementsStore';
let { observable, action, computed, runInAction, toJS } = mobx;


export class RequirementsConfrimStore extends TableStore{
    constructor(props, context) {
        super(props, context);
    }
    @observable list={};
    @observable visible=false;
    @observable record={};
    @observable index="";
    @observable confrimLoading=false;
    @observable mark=false;
    //@observable unit=[];
    //确认
    @action
    fetchConfrim(params) {
        this.confrimLoading=true;
        return RequirementsFetch.confrim(params)
            .then(json => {
                if(json.status==2000){
                    runInAction(() => {
                        requirementsStore.middleData=[];
                        requirementsStore.notIn="";
                        requirementsNextStore.this_form={
                            this_orderType:"1",
                            this_purchaseRule:"1",
                            this_purchaseChannel:"1",
                            this_purchaseWay:"1",
                            this_supplier:"",
                            this_planReceiveDate:"",
                            this_site:"",
                            this_address:"",
                            this_dept:"",
                            this_emp:"",
                            this_deliveryAskFor:"1",
                            this_remark:""
                        }
                        message.success(json.message[0].msg);
                        this.confrimLoading = false;
                    })
                }
                runInAction(() => {
                    this.confrimLoading = false;
                })
                return json
            });
    }
};

export class UnitStore extends SelectStore {
    keyName = 'unitCode';
    labelName = 'unitName';

    @action
    fetchUnit(pm) {
        return RequirementsFetch.unitList(pm)
            .then(this.updateSelectList);
    }
}
const unitStore = new UnitStore();

let requirementsConfrimStore = new RequirementsConfrimStore();


export { requirementsConfrimStore,unitStore };