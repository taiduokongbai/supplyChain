import { ReqApi } from '../../../base/services/ReqApi'
import { Urls } from '../../consts/InventoryUrls'

let { observable, action, computed, runInAction, toJS,createTransformer } = mobx;


//opType 0新增行 1 修改行 2 删除行
export default class OtherOutboundOrderAddEditableTableStore {

    rowKeyCoide = "id";

    delRowCache = [];


    @observable currentEditableKey = null;

    @observable.shallow dataSource = [
       /* {
            key: "0",
            status: "启用",
            materialCode: "0001",
            materialName: "胶水",
            materialSpec: "自动6AT",
            materialModel: "MLA10",
            planAmount: null,
            materialUnitName: "套"
        },
        {
            key: "1",
            status: "关闭",
            materialCode: "0002",
            materialName: "米奇林轮胎",
            materialSpec: "255/55 R17",
            materialModel: "9C071",
            planAmount: 10,
            materialUnitName: "个"
        },*/
    ];

    @observable loading = false;


    pageSizeOptions = ['10', '20', '30', '50'];

    @action
    init=()=>{
        this.dataSource = [];
    }

    constructor() {

        this.transformer = createTransformer((store) => ({
            // bordered:true,
            loading: store.loading,
            dataSource: store.dataSource.slice(),
            rowKey:this.rowKeyCoide,
            pagination: Object.assign({}, { ...store.paging }, {
                pageSizeOptions: store.pageSizeOptions,
                showSizeChanger: true,
                showTotal: (total) => `总共 ${total} 条记录`
            })
        }));
    }


    @action
    fetchList =(pm = {outCode:null})=>{

        return ReqApi.get({
            url: Urls.OUT_GETORDERINFO,
            pm,
        }).then((json) => {

            runInAction(()=>{
                this.dataSource = json.data.list;
            });
        });
    }

    cloneDataSource=(obj)=>{
        return JSON.parse(JSON.stringify(obj));
    }


    @action
    add = (row={}) => {
        row.id = -new Date().getTime();
        row.opType = 0;


        row.materialUnitCode = (row.materialInventory && row.materialInventory.inventoryUnit) || "";
        row.materialUnitName = (row.materialInventory && row.materialInventory.inventoryUnitName) || "";
        row.materialModel = row.model;


        const newData = [row].concat(this.cloneDataSource(this.dataSource));
        this.currentEditableKey = row[this.rowKeyCoide];
        this.dataSource = newData;
    }


    @action
    edit = (key) => {

        const newData = this.cloneDataSource(this.dataSource);
        const target = newData.filter(item => key === item[this.rowKeyCoide])[0];

        if(!(target.opType) && !(target.opType === 0)){
            target.opType = 1;
        }

        if (target) {
            this.currentEditableKey = key;
            this.dataSource = newData;
        }
    }


    @action
    del = (key)=>{
        const newData = this.cloneDataSource(this.dataSource);

        let index = newData.findIndex(item => key === item[this.rowKeyCoide]);
        if(index >= 0){

            let delTarget = newData.splice(index,1)[0];
            if(delTarget){
                if(delTarget.opType && !(delTarget.opType === 0)){
                    delTarget.opType = 2;
                    this.delRowCache.push(delTarget);
                }
                if(delTarget.opType === undefined){
                    delTarget.opType = 2;
                    this.delRowCache.push(delTarget);
                }
                this.dataSource = newData;
            }
        }
    }


    @action
    save = (key,row={}) => {
        const newData = this.cloneDataSource(this.dataSource);
        const target = newData.filter(item => key === item[this.rowKeyCoide])[0];

        if (target) {
            Object.assign(target,row);
            this.currentEditableKey = null;
            this.dataSource = newData;
        }
    }

    @action
    cancel = (key) => {
        const newData = this.cloneDataSource(this.dataSource);
        const target = newData.filter(item => key === item[this.rowKeyCoide])[0];
        if (target) {
            Object.assign(target, newData.filter(item => key === item.key)[0]);

            this.currentEditableKey = null;
            this.dataSource = newData;
        }
    }


    get Props (){
        return this.transformer(this);
    }
};


export let OtherOutboundOrderAddTableStore =  new OtherOutboundOrderAddEditableTableStore();
export let OtherOutboundOrderEditTableStore =  new OtherOutboundOrderAddEditableTableStore();

