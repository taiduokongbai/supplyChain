import { message } from 'antd';
import { ProDesignBomFetch } from '../../consts/ProDesignBomUrls';
import TableEditStore from '../../../base/stores/TableEditStore';
import TableStore from '../../../base/stores/TableStore';
import SelectStore from '../../../base/stores/SelectStore';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { productTableStore } from './ProDesignBomStore';
import { editProDesignBomTableStore,addProDesignBomStore} from './AddProDesignBomStore'
import { EditProDesignBomTableStore } from './AddProDesignBomStore'


let { observable, action, computed, runInAction, toJS } = mobx;

//获取设计类型
export class DeignTypeDetailsStore extends SelectStore {
    @observable designLabel = '';
    keyName = 'catCode';
    labelName = 'catName';

    @action
    fetchSelectList(pm) {
        return ProDesignBomFetch.getDesignType(pm)
            .then(this.updateSelectList);
    };

    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            json.data.list[0].catList.unshift({catCode:'',catName:'全部'});
            this.setList(json.data.list[0].catList);
            runInAction(()=>{
                this.designLabel = json.data.list[0].catList[0].catCode;
            });
        };
        this.loading = !this.loading;
        return json;
    };
};

//获取导入类型
export class ImportTypeDetailsStore extends SelectStore {
    @observable importLabel = '';
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
            // runInAction(() => {
            //     this.importLabel = json.data[0].categoryCode;
            // });
        };
        this.loading = !this.loading;
        return json;
    };
};

//产品信息
export class ProDesignBomDetailsInfoStore{

    @observable detailsLoading = false;
    displayProCode = false;
    @observable visible = false;
    @observable compareErrorMessage="";
    @observable returnFlag = '';
    @observable fileList=[];
    @observable errorPage = false;
    Ids = {
        bomTypeId: '',
        productId: '',
        bomLogIds: ''
    };
    init = {
        id: '',
        productCode: '',
        productName: '',
        productSpec: '',
        productModel: '',
        productTexture: '',
        gbCode: '',
        productCategoryCode: '',
        productCategoryName: '',
        stdQty: '',
        stdUnitCode: '',
        stdUnitName: '',
        productBrand: '',
        sourceCode: '',
        status: 0,
        // lockFlag: null,
        // lockTime: '',
        // lockUser: '',
        fileIds: '',
        remarks: '',
        totalNumberOfFiles:""
    };

    //产品信息
    @action
    getProDesignBomDetailsInfo = (pm) => {
        this.displayProCode = false;
        detailsEditTable.displayBtn = false;
        proDesignBomDetailsInfoStore.errorPage = false;
        this.detailsLoading = true;
        return ProDesignBomFetch.getBomDetailList(pm).then(json => {
                    if (json.status === 2000) {
                        Object.assign(this.init, json.data);
                        runInAction(() => {
                            this.detailsLoading = false
                        })
                    } else {
                        runInAction(() => {
                            this.detailsLoading = false
                        })
                    }
                    return json;
                })
    };

    //禁用
    @action
    ableProDesignBom = (id,status) => {
        this.detailsLoading = true;
        let pm = {id:id,status:status};
        ProDesignBomFetch.ableProDesignBom(pm).then(json => {
            if (json.status === 2000) {
                store.dispatch(TabsAct.TabRemove("importProDesignBomDetails", "proDesignBom"));
                store.dispatch(TabsAct.TabAdd({
                    title: "产品设计BOM",
                    key: "proDesignBom"
                }));
                productTableStore.fetchTableList();
                message.success('禁用成功');
            } else {
                runInAction(() => {
                    this.detailsLoading = false
                });
                message.error('失败');
            }
            return json;
        })
    };

    //启用产品设计BOM
    @action
    enableProDesignBom(pm){
        this.detailsLoading=true;
        return ProDesignBomFetch.enableProDesignBomData(pm).then(json => {
            this.detailsLoading=false;
                return json;
            })
    }
    //产品图片查看
    @action
    getBomPictureList(pm){
        return ProDesignBomFetch.getBomPicture(pm).then(json => {
               return json;   
            })
    }

    //产品图片保存
    @action
    saveBomPictureFetch(pm){
        return ProDesignBomFetch.saveBomPicture(pm).then(json => {
                return json;
            })
    }
    //产品图片删除
    @action
    removeBomPictureFetch(pm){
        return ProDesignBomFetch.removeBomPicture(pm).then(json => {
                return json;
            })
    }
     //产品明细图片保存
    @action
    saveBomDetailPictureFetch(pm){
        return ProDesignBomFetch.saveBomDetailPicture(pm).then(json => {
                return json;
            })
    }
     //产品明细图片删除
    @action
    removeBomDetailPictureFetch(pm){
        return ProDesignBomFetch.removeBomDetailPicture(pm).then(json => {
                return json;
            })
    }
    //公共图片上传
    // @action
    // uploadPicFetch(pm){
    //     return ProDesignBomFetch.uploadPic(pm).then(json => {
    //             return json;
    //         })
    // }
};

export class DetailsEditTable extends EditProDesignBomTableStore {
    @observable detailOrProduct=false;
    @observable materialCode="";
    @observable productDetailId="";
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
                    });
                } else {
                    runInAction(() => {
                        this.loading = false;
                    })
                }
            });
    };

    //点击编辑
    @action.bound
    onEdit(record, index) {
        if (!this.beforeEvent('edit')) return;
        this.loading = true;
        // let { page, pageSize } = this.pages;
        // if (page && page != 1) {
        //     index = (page - 1) * pageSize + index;
        // };
        if (this.editingIndex == null) {
            this.editingIndex = index;
            this.editingRecord = record;
        } else {
            message.warn("已有行处于编辑状态！")
        }
        this.loading = false;
        this.afterEvent('edit');
    }

    // 修改物料时的保存
    @action.bound
    handleSave() {
        if (!this.beforeEvent('save')) return;
        this.loading = true;
        delete this.editingRecord.isNewRow;
        let list = this.dataSource.slice();
        ProDesignBomFetch.modifyMaterialDetail({id:this.editingRecord.id,
            materialCode:this.editingRecord.materialCode,
            syncFlag:this.editingRecord.syncFlag})
            .then(json => {
                if(json.status === 2000){
                    Object.assign(this.editingRecord,json.data);
                }
                list[this.editingIndex] = this.editingRecord;
                this.dataSource = list;
                this.editingRecord = {};
                this.editingIndex = null;
                this.loading = false;
                this.afterEvent('save');
            });
    };

     // 上传图片
    @action.bound
    onDelete(record,index) {
        console.log(1111);
        this.detailOrProduct=true;
        addProDesignBomStore.addVisible=true;
        return ProDesignBomFetch.getBomDetailPictureList({materialCode:record.materialCode}).then(json=>{
            if(json.status===2000){
                runInAction(() => {
                    proDesignBomDetailsInfoStore.fileList=json.data.list;
                    this.materialCode=record.materialCode;
                    this.productDetailId=record.id;
                })

            }
        })

    };
}

let proDesignBomDetailsInfoStore = new ProDesignBomDetailsInfoStore(),
    deignTypeDetailsStore = new DeignTypeDetailsStore(),
    importTypeDetailsStore = new ImportTypeDetailsStore(),
    detailsEditTable = new DetailsEditTable();
    // proDesignBomDetailsEditTableStore = new ProDesignBomDetailsEditTableStore(),
    // proDesignBomDetailsTableStore = new ProDesignBomDetailsTableStore();

export { proDesignBomDetailsInfoStore, deignTypeDetailsStore, importTypeDetailsStore, detailsEditTable}