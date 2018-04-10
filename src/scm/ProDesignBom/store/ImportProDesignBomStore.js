import { message } from 'antd';
import TableEditStore from '../../../base/stores/TableEditStore';
import SelectStore from '../../../base/stores/SelectStore';
import { ProDesignBomFetch } from '../../consts/ProDesignBomUrls';
let { observable, action, computed, runInAction, toJS } = mobx;
//获取设计类型
export class DeignTypeStore extends SelectStore {
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
            this.setList(json.data.list[0].catList);
            runInAction(()=>{
                this.designLabel = json.data.list[0].catList[0].catCode;
            });
        };
        this.loading = !this.loading;
        return json;
    };
    @action
    setDefaultLabel = (value) => {
        this.designLabel = value;
    };
};

//获取导入类型
export class ImportTypeStore extends SelectStore {
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
            // this.setList(json.data[0].children);
            this.setList(json.data);
            // json.data.map()
            // importTableStore.setInitRecord(json.data[0].children[0].categoryCode);
        };
        this.loading = !this.loading;
        return json;
    };
};

//导入弹窗
class PopStore {
    @observable visible = false;
    @observable loading = false;
    title = '批量导入';
    okText = '开始导入';
    width = 690;
    maskClosable = true;
    disable = true;
    @action
    setVisible = (flag,record) => {
        this.visible = flag;
        if(!flag){
            popErrorStore.setVisible(false);
        }
    };
    @action
    handleSubmit = (value) => {
        //判断导入成功还是失败
        this.loading = true;
        return ProDesignBomFetch.importExcel(value)
            .then(json => {
                if(json.status === 2000){
                    importTableStore.handleSave(json);
                    importTableStore.Ids = {
                        bomTypeId: json.data.bomTypeId,
                        productId: json.data.productId,
                        bomLogIds: json.data.bomLogIds,
                    };
                    this.setVisible(false);
                } else if(json.status === 6001){
                    importTableStore.handleSave(json);
                    popErrorStore.errorExcelUrl = json.data.fileURL;
                    popErrorStore.errorExcelName = json.data.fileName;
                    popErrorStore.setVisible(true);
                    // let list = importTableStore.dataSource.slice();
                    // importTableStore.setVisible('disablledBtn',!list.some((item) => {return item.importStatus == 1}));
                    // importTableStore.setVisible('condition',!list.some((record) => {return record.importStatus == 0;}));
                } else {
                    let error = (msgs) => <div>
                        {
                            msgs.map((item, index) =>
                                <div key={"field_error" + index}>
                                    {item.msg?item.msg:""}
                                </div>)
                        }
                    </div>;
                    if (Array.isArray(json.message)&&json.message.length>0) {
                        message.error(error(json.message));
                    }
                    importTableStore.handleSave(json);
                }
                this.loading = false;
                return json;
            });
    };
};

//失败弹窗
class PopErrorStore {
    @observable visible = false;
    title = '验证失败';
    width = 690;
    maskClosable = true;
    @observable errorExcelUrl = '';
    @observable errorExcelName = '';
    @action
    setVisible = (flag) => {
        this.visible = flag;
        if(!flag){
            popStore.visible = false;
        }
    };
};

// 导入
class ImportTableStore extends TableEditStore{
    constructor(){
        super();
    };
    //给后台传的参数
    Ids = {
        bomTypeId: '',
        productId: '',
        bomLogIds: ''
    };
    setIds = () => {
        this.Ids = {
            bomTypeId: '',
            productId: '',
            bomLogIds: ''
        };
    };
    //整个页面的loading
    @observable spinLoading = true;
    recordKey = 'id';
    selectCell = ["importTypeName"];
    //存在导入结果失败时提示
    @observable disPopconfirm = false;
    //存在导入结果失败时提示
    @observable condition = true;
    //下一步按钮禁用
    @observable disablledBtn = true;
    @action
    setSpin = (flag) =>{
        this.spinLoading = flag;
        if(flag){
            this.condition = true;
            this.disablledBtn = true;
        }
    };
    @action
    setVisible = (visible,flag) => {
        this[visible] = flag;
    };

    @action
    setEditRecord = () => {
        this.editingRecord = {};
        this.editingIndex = null;
    };
    // 初始化数据
    initRecord={
        id: '',
        designTypeCode: '',
        designTypeName: '',
        importTypeCode: '',
        importTypeName: '',
        importFilename: '',
        importResult: '',
        importStatus: '',
        importTime: '',
        importEmplName: '',
        importEmplCode: '',
        fileURL: ''
    };
    // setInitRecord = (flag) => {
    //     this.initRecord.importTypeCode = flag;
    // };
    // @action
    // fetchTableList(params) {
    //     this.loading = true;
    //     let pm = { ...params };
    //     return ProDesignBomFetch.getImportBomList(pm)
    //         .then(this.updateTableList)
    //         .then(json => {
    //             this.setVisible('condition',!(json.data.list.some((record) => {
    //                 return record.importStatus == 0;
    //             })));
    //             this.setVisible('disablledBtn',json.data.list.length == 0 ? true : false);
    //            return json
    //         });
    // };
    //点击添加
    @action.bound
    onAdd() {
        if (!this.beforeEvent('add')) return;
        this.loading = true;
        if (this.editingIndex == null) {
            let newRecord = this.getNewRecord();
            newRecord.isNewRow = true;
            let list = this.dataSource.slice();
            list.splice(this.dataSource.length, 0, newRecord);
            this.dataSource = list;
            this.onEdit(newRecord,this.dataSource.length-1);
            this.setVisible('disablledBtn',!list.some((item) => {return item.importStatus == 1}));
            this.setVisible('condition',!list.some((record) => {return record.importStatus == 0;}));
        } else {
            message.warn("已有行处于编辑状态！")
        }
        this.loading = false;
        this.afterEvent('add');
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
    };
    //点击保存，需重写
    @action.bound
    handleSave(json) {
        if (!this.beforeEvent('save')) return;
        this.loading = true;
        delete this.editingRecord.isNewRow;
        let list = this.dataSource.slice();
        list[this.editingIndex] = json.data;
        this.dataSource = list;
        this.editingRecord = {};
        this.editingIndex = null;
        this.loading = false;
        this.afterEvent('save');
        this.setVisible('disablledBtn',!list.some((item) => {return item.importStatus == 1}));
        this.setVisible('condition',!list.some((record) => {return record.importStatus == 0;}));
    };
    //点击删除
    @action.bound
    onDelete(index) {
        let list = this.dataSource.slice();
        //取消
        if(this.editingIndex != null || this.dataSource.slice()[index].id < 0){
            if (!this.beforeEvent('cancel')) return;
            this.loading = true;
            // if (this.editingRecord.isNewRow) {
                // let list = this.dataSource.slice();
            if(this.editingIndex != null){
                list.splice(this.editingIndex, 1);
            } else {
                list.splice(index, 1);
            }
                this.dataSource = list;
            // }
            this.editingRecord = {};
            this.editingIndex = null;
            this.loading = false;
            this.afterEvent('cancel');
            this.setVisible('disablledBtn',!list.some((item) => {return item.importStatus == 1}));
            this.setVisible('condition',!list.some((record) => {return record.importStatus == 0;}));
        } else {
            //删除
            ProDesignBomFetch.delImportBomList(Object.assign({id:this.dataSource.slice()[index].id},this.Ids))
                .then(json => {
                    if(json.status === 2000) {
                        if (!this.beforeEvent('delete')) return;
                        runInAction(()=>{
                            this.loading = true;
                            // let list = this.dataSource.slice();
                            list.splice(index, 1);
                            this.dataSource = list;
                            this.loading = false;
                            this.afterEvent('delete');
                            this.Ids = {
                                bomTypeId: json.data.bomTypeId,
                                productId: json.data.productId,
                                bomLogIds: json.data.bomLogIds
                            };
                        });
                        // this.Ids.bomLogIds = this.Ids.bomLogIds.replace(/,\d*$/gi,'');
                        // let bomLogIds = this.Ids.bomLogIds.split(',');
                        // bomLogIds.splice(index,1);
                        // runInAction(()=>{
                        //     this.Ids.bomLogIds = bomLogIds.join(',');
                        // });
                        // console.log(this.Ids.bomLogIds)
                        message.success('删除成功');
                        this.setVisible('disablledBtn',!list.some((item) => {return item.importStatus == 1}));
                        this.setVisible('condition',!list.some((record) => {return record.importStatus == 0;}));
                    }
                });
        }
    };

    clearImportExcel = () => {
        ProDesignBomFetch.clearImportExcel();
    };
    get Props() {
        return Object.assign({
            initRecord:this.initRecord
        },super.Props);
    };
}

let deignTypeStore = new DeignTypeStore(),
    importTypeStore = new ImportTypeStore(),
    popStore = new PopStore(),
    popErrorStore = new PopErrorStore(),
    importTableStore = new ImportTableStore();

export { deignTypeStore, importTypeStore, popStore, popErrorStore, importTableStore }
