import moment from "moment";
import { message } from '../../../base/components/AntdComp';
let { observable, action, computed, runInAction, toJS } = mobx;
import { ProDesignBomFetch } from '../../consts/ProDesignBomUrls';
import TableStore from '../../../base/stores/TableStore';
import TableEditStore from '../../../base/stores/TableEditStore';
//import {StdUnitStore} from '../../data/DropDownStore';
import TreeSelectStore from '../../../base/stores/TreeSelectStore';
import SelectStore from '../../../base/stores/SelectStore';
import { proDesignBomDetailsInfoStore} from '../store/ProDesignBomDetailsStore';
import MeasureStore from '../../../base/stores/MeasureStore';
const measurestore = new MeasureStore();
//新增
export class AddProDesignBomStore extends TableStore {
    constructor() {
        super();
        this.detailStore = new EditProDesignBomTableStore(this);
        //this.stdUnitStore = new StdUnitStore();
        this.measurestore = measurestore;
    }
    //从新建传到详情的参数
    Ids = {
        bomTypeId: '',
        productId: '',
        bomLogIds: ''
    };
    @observable addVisible=false;
    @observable fileList = [];
    @observable bomDetial={};
    @observable comboboxList=[];
    @observable addProDesignBomLoading=false;
    @observable compareErrorMessage="";
    //获取产品BOM信息
    @action
    getBomDetail(pm){
        //this.bomDetial={};
        editProDesignBomTableStore.displayBtn = false;
        this.addProDesignBomLoading=true;
        return ProDesignBomFetch.getBomDetailList(pm)
            .then(json => {
               if(json.status==2000){
                   runInAction(() => {
                        this.bomDetial=json.data;
                        
                    }) 

               }
               this.addProDesignBomLoading=false;
               return json;
            });
    }
    //启用产品设计BOM
    @action
    enableProDesignBom(pm){
        this.addProDesignBomLoading=true;
        return ProDesignBomFetch.enableProDesignBomData(pm)
            .then(json => {
                this.addProDesignBomLoading=false;
                return json;
            });
    }
    //新建产品设计BOM
    @action
    addProDesignBom(pm){
        this.addProDesignBomLoading=true;
        return ProDesignBomFetch.addProDesignBomData(pm)
            .then(json => {
                this.addProDesignBomLoading=false;
                return json;
            });
    }

}
//产品分类
export class ProductCategoryStore extends TreeSelectStore {
    keyName = 'categoryCode';
    LabelName = 'categoryName';
    style = {
        width: 333
    };
    @action
    fetchCombBoxList(pm){
        return ProDesignBomFetch.getCombBoxList(pm)
            .then(this.updateSelectList);
    }

    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            this.setList(json.data);
        };
        this.loading = !this.loading;
        return json;
    }

    @action
    fetchSelectList(pm) {
        return AllotFetch.getStockTree(pm)
            .then(this.updateSelectList);
    }

    @action
    setListSelf = () => {
        let data = this.selectList.slice(),
            key = this.keyName,
            name = this.LabelName;
        let loop = data => data.map((item) => {
            item.key = item[key] + '';
            item.value = item[key] + '';
            item.label = item[name];
            if (item.children) loop(item.children);
            return item;
        });
        this.setList(loop(data));
    }

}

//获取导入类型--一级类
export class ImportAddTypeStore extends SelectStore {
    keyName = 'categoryCode';
    labelName = 'categoryName';

    @action
    fetchSelectList(pm) {
        return ProDesignBomFetch.getCombBoxList(pm)
            .then(this.updateSelectList);
    };

    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            json.data.unshift({categoryCode:'',categoryName:'全部'});
            this.setList(json.data);
        };
        this.loading = !this.loading;
        return json;
    };
};

//物料明细
export class EditProDesignBomTableStore extends TableEditStore {
    constructor(pStore) {
        super();
        this.pStore = pStore;
    };
    pages = {
        page: 1,
        pageSize: 50,

    };
    paging = {
        total: 0,
        current: 1,
        pageSize: 50,
    };
    pageSizeOptions = ['10', '15','20', '30', '50'];
    recordKey = 'id';
    inputCell = ['materialCode'];
    //操作按钮的显示隐藏
    displayBtn = false;
    search = {};
    @action
    fetchTableList(params) {
        this.loading = true;
        if(params){
            this.search = params;
        }
        let pm={...{paging:1},...this.pages,...this.search};
        return ProDesignBomFetch.editProDesignBomTable(pm)
            .then(json => {
                if(json.status===2000){
                    runInAction(() => {
                        this.resetDetail(json.data);
                        this.loading = false;
                    })
                } else {
                    runInAction(() => {
                        this.loading = false;
                    })
                }
            });
    }
    @action
    resetDetail(data) {
        this.editingRecord = {};
        this.editingIndex = null;
        this.pages = {
            page:data.page,
            pageSize:data.pageSize
        };
        this.paging = {
            total: data.total,
            current: data.page,
            pageSize: data.pageSize
        };
        this.dataSource = data.list || [];
    }
   
    get Props() {
        return Object.assign({
            displayBtn:this.displayBtn,
        },super.Props);
    }

}
//设计类型
export class DesignTypeStore extends SelectStore {
    keyName = 'catCode';
    labelName = 'catName';

    @action
    fetchDesignType(pm) {
        return ProDesignBomFetch.getDesignType(pm)
            .then(this.updateSelectList);
    }
    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            json.data.list[0].catList.unshift({catCode:'',catName:'全部'});
            this.setList(json.data.list[0].catList);
        };
        this.loading = !this.loading;
        return json;
    }
}
let designTypeStore = new DesignTypeStore(),
    addProDesignBomStore = new AddProDesignBomStore(),
    importAddTypeStore=new ImportAddTypeStore(),
    productCategoryStore=new ProductCategoryStore(),
    //stdUnitStore = addProDesignBomStore.stdUnitStore,
    editProDesignBomTableStore = addProDesignBomStore.detailStore;

export {
    addProDesignBomStore,
    editProDesignBomTableStore,
    designTypeStore,
    importAddTypeStore,
    productCategoryStore,
    measurestore
};