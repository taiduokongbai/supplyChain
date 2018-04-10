import moment from "moment";
import SearchBarStore from '../../base/stores/SearchBarStore';
import TableStore from '../../base/stores/TableStore';
import { RequirementsFetch } from './RequirementsUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

//采购需求单列表
export class RequirementsStore extends TableStore{
    constructor(props, context) {
        super(props, context);
        this.fetchTableList = this.fetchTableList;
        this.date = new Date();
        this.year=this.date.getFullYear();
        this.startYear=this.date.getFullYear();
        this.seperator1 = "-";
        this.startMonth =  this.date.getMonth();
        this.endMonth =  this.date.getMonth()+2;
        this.strDate = "01";
        this.endDay= this.date.getDate();
        if ( this.startMonth >= 1 &&  this.startMonth <= 9) {
             this.startMonth = "0" +  this.startMonth;
        }
        if ( this.endMonth >= 1 &&  this.endMonth <= 9) {
             this.endMonth = "0" +  this.endMonth;
        }
        if(this.endMonth==13){
            this.endMonth="01";
            this.year=this.date.getFullYear()+1;
        }else if(this.endMonth==14){
            this.endMonth="02";
            
            this.year=this.date.getFullYear()+1;
        }
        if(this.endMonth%2){
            this.endDay='30';
        }else if(this.endMonth==2){
            this.endDay='28';
            this.startYear=this.date.getFullYear()-1;
            this.startMonth='12';
        }else{
            this.endDay='31';
        }
        if(this.endMonth==1){
            this.endDay='31';
        }
        this.startDate= this.startYear +  this.seperator1 +  this.startMonth +  this.seperator1 +  this.strDate;
        this.endDate=  this.year +  this.seperator1 +  this.endMonth +  this.seperator1 + this. endDay;
    }
    
    //需求来源
    @observable Sources=[
        {
            "catCode": "null",
            "catName": "全部"
        }, {
            "catCode": '3',
            "catName": "计划调度台"
        }, {
            "catCode": '2',
            "catName": "部门申请"
        }, {
            "catCode": '1',
            "catName": "MRP"
        }, {
            "catCode": '4',
            "catName": "文件导入"
        }
    ];

    //下推状态
    @observable pushdownFlag=[
        {
            "catCode": "null",
            "catName": "全部"
        }, {
            "catCode": '0',
            "catName": "未下推"
        }, {
            "catCode": '1',
            "catName": "已下推"
        }
    ];

    //业务类型
    @observable orderType=[
        {
            "catCode": "null",
            "catName": "全部"
        }, {
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

    // //物料属性
    // @observable materialProperty=[
    //     {
    //         "catCode": "null",
    //         "catName": "全部"
    //     }, {
    //         "catCode": '1',
    //         "catName": "通用件"
    //     }, {
    //         "catCode": '2',
    //         "catName": "标准件"
    //     }, {
    //         "catCode": '3',
    //         "catName": "外购件"
    //     }, {
    //         "catCode": '4',
    //         "catName": "外协件"
    //     }, {
    //         "catCode": '5',
    //         "catName": "自制件"
    //     }
    // ];
     @observable redMessage=false;
     @observable.shallow siteList=[];
     @observable.shallow dataList=[];
     @observable.shallow middleData=[];
     @observable notIn='';
     @observable notAttrIn=[];
     @observable siteCodeAttr=[];//siteCode排序取最小值
     @observable tableSelect=true;
     //@observable siteId;
     pageSizeOptions = ['10','15', '20', '30', '50'];
     @observable toback=false;
     @observable searchPm={orderCode:"",sourceType:null,sourceOrderCode:"",siteCode:null,pushdownFlag:0,orderType:null,categoryName:"",materialNickname:"",supplierNickname:"",planReceiveStart:this.startDate,planReceiveEnd:this.endDate,page:1,pageSize:15};

    @action
    fetchTableList(params) {
        this.loading = true;
        searchBarStore.setLoading(true);
        
        let pm = {...this.searchPm,...this.pages, ...params };
        return RequirementsFetch.requirementsList(pm)
            .then(this.updateTableList)
            .then(json => {
                this.dataList=json.data.list
                searchBarStore.setLoading(false);
                return json
            });
    }

    //初始化获取站点
    @action
    fetchsiteList(pm) {
        return RequirementsFetch.siteList(pm)
            .then(json => {
                json.data.list.unshift({siteCode:'null',siteName:'全部'})
                this.siteList=json.data.list
                return json
            });
    }
    @action
    fetchTableClose(pm) {
        return RequirementsFetch.CloseTableList(pm)
            .then(json => {
                return json
            });
    }
};

let requirementsStore = new RequirementsStore();
let searchBarStore = new SearchBarStore();

export { requirementsStore, searchBarStore };