import TableStore from '../../base/stores/TableStore';
import { RequirementsFetch } from './RequirementsUrls';
import {requirementsStore} from './RequirementsStore';
let { observable, action, computed, runInAction, toJS } = mobx;


export class RequirementsNextStore extends TableStore{
    constructor(props, context) {
        super(props, context);
        this.purchaseWay.splice(2,1);

    }
    //业务类型
    @observable orderType=[
        {
            "catCode": '1',
            "catName": "标准采购"
        }, {
            "catCode": '2',
            "catName": "外协采购"
        }, {
            "catCode": '3',
            "catName": "外协加工"
        }
    ];
    //采购类型
   @observable purchaseType=[
        {
            "catCode": '0',
            "catName": "库存采购"
        }, {
            "catCode":'1',
            "catName": "非库存采购"
        }
    ];
    //采购渠道：
    @observable purchaseChannel=[
         {
            "catCode": '1',
            "catName": "线上采购"
        }, {
            "catCode": '2',
            "catName": "线下采购"
        }
    ];
    //采购规则：
    @observable purchaseRule=[
         {
            "catCode": '1',
            "catName": "按物料合并"
        }, {
            "catCode": '2',
            "catName": "按明细采购"
        }
    ];
    //采购方式1：
    @observable purchaseWay=[
         {
            "catCode":'1',
            "catName": "电商询价"
        }, {
            "catCode": '2',
            "catName": "电商下单"
        },{
            "catCode": '3',
            "catName": "采购订单"
        }
    ];


    //交期要求
    @observable deliveryAskFor=[
       
         {
            "catCode": '1',
            "catName": "同物料取最早交期"
        }, {
            "catCode":'2',
            "catName": "同物料取最晚交期"
        }
    ];
    
     @observable closeTables=false;
     @observable.shallow dataSource=[];
     @observable.shallow data=[];
     @observable.shallow supplierList=[];
     @observable.shallow deptList=[];
     @observable.shallow empList=[];
     @observable.shallow siteList=[];
     @observable.shallow ComAddressList=[];
     @observable defaultDept="";
     @observable defaultPerson="";
     @observable deptCode="";
     @observable siteCode="";
     @observable addressCode="";
     @observable existPrice=[];
     @observable this_form={
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
     @observable supplierCode="";
     //存所有下拉的name==>确认页面显示
     @observable selectName={
         supplierName:"",
         deptName:"",
         empName:"",
         siteName:"",
         addressName:"",

     }
     
    //获取供应商下拉列表
    @action
    fetchSupplierList(params) {
        return RequirementsFetch.supplierList(params)
            .then(json => {
                if(json.status===2000){
                    runInAction(() => {
                        this.supplierList=json.data.list;
                    })  
                }
                return json
            });
    }

    //获取当前登录者信息
    @action
    fetchLogin(params) {
        return RequirementsFetch.login(params)
            .then(json => {
                return json
            });
    }

    //获取当前登录者所在部门下拉列表
    @action
    fetchDeptList(params) {
        return RequirementsFetch.deptList(params)
            .then(json => {
                if(json.status===2000){
                    runInAction(() => {
                        this.deptList=json.data.list;
                    })  
                }
                
                return json
            });
    }
    //获取登录者员工下拉列表
    @action
    fetchEmpList(params) {
        return RequirementsFetch.empList(params)
            .then(json => {
                if(json.status===2000){
                    runInAction(() => {
                        this.empList=json.data.list;
                    })  
                }
                
                return json
            });
    }
    //获取所有站点下拉列表
     @action
    fetchSiteList(params) {
        return RequirementsFetch.siteList(params)
            .then(json => {
                if(json.status===2000){
                    runInAction(() => {
                        this.siteList=json.data.list;
                    })  
                }
                
                return json
            });
    }
    //通过站点获取地址
     @action
    fetchComAddrBySiteList(params) {
        return RequirementsFetch.ComAddrBySiteList(params)
            .then(json => {
                if(json.status===2000){
                    runInAction(() => {
                        this.ComAddressList=json.data.list;
                    })  
                }
                
                return json
            });
    }
    @action
    fetchExistPrice(params) {
        return RequirementsFetch.ExistPriceList(params)
            .then(json => {
                if(json.status===2000){
                    runInAction(() => {
                        
                    })  
                }
                
                return json
            });
    }



};

let requirementsNextStore = new RequirementsNextStore();


export { requirementsNextStore };