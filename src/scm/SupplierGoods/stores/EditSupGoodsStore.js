import { SupplierStore, MaterialStore } from '../../data/DropDownStore';
import { AddSupGoodsStore } from './AddSupGoodsStore';
let { observable, action, computed, runInAction, toJS } = mobx;
import { SupplierGoodsFetch } from '../../consts/SupplierGoodsUrls';

export class EditSupGoodsStore extends AddSupGoodsStore {
    constructor() {
        super();
        this.supplierStore = new SupplierStore();
        this.materialStore = new MaterialStore();
    }
    title = '编辑供应商商品目录';

    @action.bound
    fetchDetail(pm) {
        this.loading = true;
        this.resetDetail();
        return SupplierGoodsFetch.supGoodsDetail(pm).then(json => {
            if (json.status === 2000) {
                let { supplierCode, materialCode} = json.data;
                this.setDetail(json.data);
                this.supplierStore.fetchSelectList(supplierCode);
                this.materialStore.fetchSelectList(materialCode);
            };
            this.loading = false;
            return json;
        })
    }
}

const editSupGoodsStore = new EditSupGoodsStore();
const supplierStore = editSupGoodsStore.supplierStore;
const materialStore = editSupGoodsStore.materialStore;

export {
    editSupGoodsStore,
    supplierStore,
    materialStore,
};
