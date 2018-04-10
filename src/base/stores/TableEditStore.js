import TableStore from './TableStore';
import OperationsComp from '../mobxComps/OperationsComp'
import { message } from '../components/AntdComp';

let { observable, action, computed, runInAction, createTransformer } = mobx;

export default class TableEditStore extends TableStore {
    @observable paging = {
        total: 0,
        current: 1,
        pageSize: 10,
    };
    @observable.shallow dataSource = [];
    editingRecord = {};
    editingIndex;
    disableds = [];
    recordKey = '';
    inputCell = [];
    inputNumberCell = [];
    selectCell = [];
    autoCompleteCell = [];
    radioCell = [];
    datePickerCell = [];

    //所有事件前进行判断处理，是否继续
    beforeEvent(type) {
        if (type == 'edit') {

        }
        return true;
    }
    //所有事件后的联动处理
    afterEvent(type) {
        if (type == 'edit') {

        }
    }
    //获取新行数据
    initRecord = {};
    getNewRecord() {
        let id = this.initRecord[this.recordKey]-1;
        this.initRecord = Object.assign({}, this.initRecord, { [this.recordKey]: id });
        return this.initRecord;
    }
    //点击添加
    @action.bound
    onAdd() {
        if (!this.beforeEvent('add')) return;
        this.loading = true;
        if (this.editingIndex == null) {
            let newRecord = this.getNewRecord();
            newRecord.isNewRow = true;
            let list = this.dataSource.slice();
            list.splice(0, 0, newRecord);
            this.dataSource = list;
            this.onEdit(newRecord,0);
        } else {
            message.warn("已有行处于编辑状态！")
        }
        this.loading = false;
        this.afterEvent('add');
    }
    //点击编辑
    @action.bound
    onEdit(record, index) {
        if (!this.beforeEvent('edit')) return;
        this.loading = true;
        let { page, pageSize } = this.pages;
        if (page && page != 1) {
            index = (page - 1) * pageSize + index;
        };
        if (this.editingIndex == null) {
            this.editingIndex = index;
            this.editingRecord = record;
        } else {
            message.warn("已有行处于编辑状态！")
        }
        this.loading = false;
        this.afterEvent('edit');
    }
    //点击保存，需重写
    @action.bound
    handleSave() {
        if (!this.beforeEvent('save')) return;
        this.loading = true;
        delete this.editingRecord.isNewRow;
        let list = this.dataSource.slice();
        list[this.editingIndex] = this.editingRecord;
        this.dataSource = list;
        this.editingRecord = {};
        this.editingIndex = null;
        this.loading = false;
        this.afterEvent('save');
    }
    //点击取消
    @action.bound
    onCancel() {
        if (!this.beforeEvent('cancel')) return;
        this.loading = true;
        if (this.editingRecord.isNewRow) {
            let list = this.dataSource.slice();
            list.splice(this.editingIndex, 1);
            this.dataSource = list;
        }
        this.editingRecord = {};
        this.editingIndex = null;
        this.loading = false;
        this.afterEvent('cancel');
    }
    //点击删除
    @action.bound
    onDelete(index) {
        if (!this.beforeEvent('delete')) return;
        this.loading = true;
        let { page, pageSize } = this.pages;
        let list = this.dataSource.slice();
        let realIndex = index;
        if (page && page != 1) {
            realIndex = (page - 1) * pageSize + index;
            if (index == 0 && list.length - 1 == realIndex) {
                this.pages.page = page - 1;
            }
        };
        list.splice(realIndex, 1);
        this.dataSource = list;
        this.loading = false;
        this.afterEvent('delete');
    }

 
    @action.bound
    setEditingRecord(record) {
        this.loading = true;
        this.editingRecord = Object.assign({}, this.editingRecord, record);
        this.loading = false;
    }
      
    // @computed
    get Props() {
        let p = super.Props;
        p.editingRecord = this.editingRecord;
        p.editingIndex = this.editingIndex;
        p.disableds = this.disableds;
        p.recordKey = this.recordKey;
        p.inputCell = this.inputCell;
        p.inputNumberCell = this.inputNumberCell;
        p.selectCell = this.selectCell;
        p.optColRender = this.optColRender;
        p.autoCompleteCell = this.autoCompleteCell;
        p.radioCell = this.radioCell;
        p.datePickerCell = this.datePickerCell;
        p.handleSave = this.handleSave;
        p.onCancel = this.onCancel;
        p.onEdit = this.onEdit;
        p.onDelete = this.onDelete;
        p.setEditingRecord = this.setEditingRecord;
        return p;
    }
}
