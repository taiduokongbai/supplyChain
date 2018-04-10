import {ReqApi} from '../../../base/services/ReqApi';
import TableStore from '../../../base/stores/TableStore';
import BusinessUrls from '../../../base/consts/BusinessUrls';

let { observable, action, computed, runInAction, toJS ,createTransformer} = mobx;

 class MaterialAvailabilityCheckStore extends TableStore {

     @observable.shallow  dataSource = [];


     @observable.shallow  cacheDataSource = {};



     pages = {
         page: 1,
         pageSize: 15
     };
     pageSizeOptions = ['10','15', '20', '30', '50'];

     rowKeyCoide = "id";
    constructor(props, context) {
        super(props, context)

        this.transformer = createTransformer((store) => ({
            loading: store.loading,
            dataSource: store.dataSource.slice(),
            cacheDataSource:store.cacheDataSource,
            rowKey:this.rowKeyCoide,
            pagination: Object.assign({}, { ...store.paging }, {
                pageSizeOptions: store.pageSizeOptions,
                showSizeChanger: true,
                showTotal: (total) => `总共 ${total} 条记录`,
            })

        }));

    }


     @action
     fetchTableInformation(pm={}){
         this.loading = true;
         return ReqApi.get({
             url: BusinessUrls.SCM_MATERIALCHECK_GET,
             pm
         }).then((json)=>{
             if(json.data && json.status === 2000){
                 this.cacheDataSource = json.data;
             }
             return json;
             this.loading = false;
         });
     }



     //查询物料可用性检查信息
     @action
     fetchTableList(pm=this.pages){

        this.loading = true;

         return ReqApi.get({
             url: BusinessUrls.SCM_MATERIALCHECK_FINDLIST,
             pm
         }).then((json)=>{
             if(json.data && json.status === 2000){
                 this.updateTableList(json);
             }
             this.loading = false;
         });
     }


     @action
     editRow(index,row){
         this.dataSource[index] = row;
         this.dataSource.slice();
     }


     @action
     switchRow(pm){
         this.loading = true;
         return ReqApi.post({
             url: BusinessUrls.SCM_MATERIALCHECK_UPDATEDETAIL,
             pm
         }).then((json)=>{
             this.loading = false;
             return json;
         });
     }



     @action.bound
     pageOnChange(page) {
         if (this.loading) return;
         if (typeof page === "number") {
             this.pages = {
                 ...this.pages,
                 page
             };
             this.paging = {
                 ...this.paging,
                 current: page
             };
         } else {
             this.pages = {
                 ...this.pages,
                 ...page
             };
             this.paging = {
                 ...this.paging,
                 current: page.page,
                 pageSize: page.pageSize
             };

         };
         this.loading = true;
     };

     //物料可用性检测保存
     @action
     save(pm={}){
         this.loading = true;
         return ReqApi.post({
             url: BusinessUrls.SCM_MATERIALCHECK_SAVE,
             pm
         }).then((json)=>{
             runInAction(()=>{this.loading = false})
             return json;
         });
     }

     get Props (){
         return this.transformer(this);
     }

}









class MaterialAvailabilityCheckConfigCompStore extends MaterialAvailabilityCheckStore{
    @observable.shallow  dataSource = [];

    cacheDataSource = {};

    constructor(props, context) {
        super(props, context)

        this.transformer = createTransformer((store) => ({
            loading: store.loading,
            cacheDataSource:store.cacheDataSource,
            dataSource: store.dataSource.slice(),
            rowKey:this.rowKeyCoide,
            pagination:false

        }));
    }

    @action
    fetchTableInformation(pm={}){
        return ReqApi.get({
            url: BusinessUrls.SCM_MATERIALCHECK_GET,
            pm
        }).then((json)=>{
            if(json.data && json.status === 2000){
                this.cacheDataSource = json.data;
            }
            return json;
        });
    }



    //查询物料可用性检查信息list
    @action
    fetchTableData(pm=this.pages){
        return ReqApi.get({
            url: BusinessUrls.SCM_MATERIALCHECK_FINDLIST,
            pm
        }).then((json)=>{
            if(json.data && json.status === 2000){
                this.updateTableList(json);
            }
        });
    }

    //查询物料可用性检查信息
    @action
    fetchTableList(pm=this.pages){
        this.loading = true;
        this.fetchTableInformation().then((json)=>{
            json.data || (json.data={});
            var pm = Object.assign({
                planOrderCode:json.data.planOrderCode,
                planMode:json.data.planMode,
                productionCode:json.data.productionCode,
                productionName:json.data.productionName,
                sellOrderCode:json.data.sellOrderCode,
                contractCode:json.data.contractCode,
                materialCode:json.data.materialCode,
                materialName:json.data.materialName
            },{checkFlag:0})

            if(json.status === 2000){
                this.fetchTableData(pm).then(()=>{
                    this.loading = false
                });
            }

        });
    }

    @action
    refreshTableList(pm={CheckFlag:0}){
        this.loading = true;
        return  this.fetchTableInformation().then((json)=>{
            if(json.status === 2000){
                json.data || (json.data={});
                var pm = Object.assign({
                    planOrderCode:json.data.planOrderCode,
                    planMode:json.data.planMode,
                    productionCode:json.data.productionCode,
                    productionName:json.data.productionName,
                    sellOrderCode:json.data.sellOrderCode,
                    contractCode:json.data.contractCode,
                    materialCode:json.data.materialCode,
                    materialName:json.data.materialName
                },{checkFlag:0})
                ReqApi.post({
                    url: BusinessUrls.SCM_MATERIALCHECK_REFRESH,
                    pm:pm,
                }).then((json)=>{
                    if(json.data && json.status === 2000){
                        let {list} = json.data;

                        this.dataSource = list;
                        this.loading = false;
                    }
                    return json;
                });


            }

        });

    }


}





export let MaterialAvailabilityCheckStores = new MaterialAvailabilityCheckStore();
export let MaterialAvailabilityCheckConfigCompStores = new MaterialAvailabilityCheckConfigCompStore();